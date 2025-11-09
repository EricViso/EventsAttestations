# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application that enables event attendees to claim on-chain attestations via the Ethereum Attestation Service (EAS). The app supports wallet connection or manual address/ENS entry, with the event organizer paying all gas fees. It currently operates on Sepolia testnet but can be adapted for mainnet or L2s.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Configuration

All configuration is stored in `.env.local` (never committed). Copy from `.env.example`:

**Required Variables:**
- `RPC_URL` - Sepolia RPC endpoint (Infura/Alchemy)
- `ORGANIZER_PRIVATE_KEY` - Hot wallet that pays gas fees
- `SCHEMA_UID` - EAS schema UID (must match schema definition in code)
- `EAS_ADDRESS` - EAS contract address (default: Sepolia)

**Event Variables:**
- `EVENT_ID`, `EVENT_TITLE`, `EVENT_DATE_UNIX`, `EVENT_LOCATION`, `EVENT_ORGANIZER`

These can be overridden via URL query parameters in the `/checkin` page.

## Architecture

### Application Flow
```
User → /checkin page → POST /api/attest → EAS.attest() → On-chain attestation
```

### Key Files

**[pages/api/attest.ts](pages/api/attest.ts)** - Core API endpoint that:
- Validates and resolves recipient addresses (including ENS names)
- Encodes attestation data using SchemaEncoder
- Calls EAS SDK to mint on-chain attestations
- Returns attestation UID and transaction hash

**[pages/checkin.tsx](pages/checkin.tsx)** - Main UI that:
- Supports wallet connection via injected provider (MetaMask, etc.)
- Accepts manual ENS/address input
- Handles URL query parameters for dynamic event configuration
- Displays attestation results with links to EAS Scan and Etherscan

**[pages/index.tsx](pages/index.tsx)** - Home page (redirects to `/checkin`)

### EAS Schema

The schema definition in [pages/api/attest.ts:31-40](pages/api/attest.ts#L31-L40) **must exactly match** the schema registered on EAS:

```typescript
string eventID,
string eventTitle,
uint64 date,
string location,
string organizer,
address attester,
bool attended
```

If you modify the schema, you must:
1. Register the new schema on EAS (https://base-sepolia.easscan.org/schema/create)
2. Update `SCHEMA_UID` in `.env.local`
3. Update `schemaString` in [pages/api/attest.ts](pages/api/attest.ts)
4. Update the `encoder.encodeData()` call to match

### ENS Resolution

The app resolves ENS names to addresses using ethers.js `provider.resolveName()`. ENS resolution happens on Ethereum mainnet (since ENS doesn't exist on Base Sepolia). The app uses Cloudflare's public Ethereum RPC endpoint for ENS lookups. See [pages/api/attest.ts:44-57](pages/api/attest.ts#L44-L57).

### Wallet Connection

Wallet connection uses the injected Ethereum provider (`window.ethereum`). The app requests accounts via `eth_requestAccounts` and submits the first account. See [pages/checkin.tsx:56-70](pages/checkin.tsx#L56-L70).

## Dynamic Event Configuration

The app supports dynamic event parameters via URL query parameters:
- `/checkin?eventId=my-event&eventTitle=My+Event&date=1234567890&location=NYC`

This allows a single deployment to serve multiple events. If no parameters are provided, defaults to environment variables.

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Add all environment variables from `.env.local`
4. Deploy

The organizer wallet needs Sepolia ETH (~0.0005-0.001 ETH per attestation).

## Security Considerations

- **Private Key Storage**: The organizer private key is stored in environment variables and should be a dedicated hot wallet
- **ENS Resolution**: Validates resolved addresses before minting
- **Address Validation**: Uses ethers.js `isAddress()` for validation
- **Rate Limiting**: Not currently implemented (consider adding for production)
- **Duplicate Prevention**: Not currently implemented (consider tracking issued attestations)

## Testing

Manual testing:
1. Start dev server: `npm run dev`
2. Visit http://localhost:3000 (redirects to `/checkin`)
3. Test wallet connection (requires MetaMask or similar)
4. Test manual entry with a test address
5. Verify attestation on EAS Scan: https://sepolia.easscan.org/

## Moving to Production Networks

To deploy on mainnet or L2s:
1. Update `RPC_URL` to target network
2. Update `EAS_ADDRESS` for target network (check https://docs.attest.sh/docs/quick--start/contracts)
3. Register schema on target network
4. Fund organizer wallet with native tokens

Recommended L2s for lower costs: Base, Optimism (~$0.01-0.05 per attestation vs. $2-10 on mainnet)

## Technology Stack

- **Framework**: Next.js 16 (Pages Router)
- **Language**: TypeScript with strict mode enabled
- **Blockchain**: ethers.js v6
- **Attestations**: @ethereum-attestation-service/eas-sdk v2.9
- **Styling**: Inline styles (no CSS framework)

## Common Modifications

### Adding Custom Fields to Attestations
1. Update schema on EAS
2. Update `schemaString` in [pages/api/attest.ts](pages/api/attest.ts)
3. Add new environment variables or URL parameters
4. Update `encoder.encodeData()` array
5. Update `SCHEMA_UID` in `.env.local`

### Adding Rate Limiting
Consider using `@upstash/ratelimit` with Redis to limit requests per IP/address.

### Adding Duplicate Prevention
Track issued attestations in a database (e.g., Vercel KV, Supabase) keyed by recipient address + event ID.

### Supporting Multiple Events
Already supported via URL query parameters. To add event management, consider adding an admin interface or database to store event configurations.
