# EAS Attestation Check-in App

A simple Next.js application that allows event attendees to claim on-chain attestations using the Ethereum Attestation Service (EAS) on Sepolia testnet.

## Features

- **Wallet Connection**: Users can connect their wallet (MetaMask, etc.) to automatically mint attestations
- **Manual Entry**: Users can paste their ENS name or Ethereum address
- **Instant Minting**: Attestations are minted immediately on-chain
- **Gas-less for Users**: The event organizer pays all gas fees
- **ENS Support**: Automatically resolves ENS names to addresses

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your configuration:

```ini
# Get an RPC URL from Infura or Alchemy
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Your organizer wallet private key (needs Sepolia ETH for gas)
ORGANIZER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Your EAS schema UID
SCHEMA_UID=0x5e116f1ab3bdfee801c0a52e9846c135c3667264440eb47956dea251e97f5cf8

# EAS Contract on Sepolia (don't change)
EAS_ADDRESS=0xC2679fBD37d54388Ce493F1DB75320D236e1815e

# Event details (customize these)
EVENT_ID=ethfloripa-2025
EVENT_TITLE=EthFloripa 2025 - Main Hall
EVENT_DATE_UNIX=1762291200
EVENT_LOCATION=ACATE, Florianópolis
EVENT_ORGANIZER=EthFloripa
EVENT_METHOD=qr
```

### 3. Update the Schema

In `pages/api/attest.ts`, make sure the `schemaString` matches your actual EAS schema definition:

```typescript
const schemaString = `
  string eventId,
  string eventTitle,
  uint64 date,
  string location,
  string organizer,
  address attester,
  string method,
  bool attended
`;
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

### For Attendees

1. Visit the check-in page (will be redirected from home)
2. Either:
   - Click "Connect Wallet & Mint" to use your wallet
   - Or paste your ENS name (e.g., `vitalik.eth`) or address (e.g., `0x1234...`)
3. Wait for the attestation to be minted
4. View your attestation on EAS Scan (Sepolia)

### For Organizers

1. Generate a QR code pointing to your deployed app's `/checkin` page
2. Display the QR code at your event
3. Attendees scan and claim their attestations
4. Monitor attestations on [EAS Scan (Sepolia)](https://sepolia.easscan.org)

## Deployment

### Deploy to Vercel

1. Push this code to a GitHub repository
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` in Vercel's settings
4. Deploy!

### Important Security Notes

- **Private Key**: Use a dedicated hot wallet for the organizer key, not your main wallet
- **Fund with Sepolia ETH**: Your organizer wallet needs Sepolia ETH to pay gas fees
- **Environment Variables**: Never commit `.env.local` to version control

## Schema Setup

If you haven't created your EAS schema yet:

1. Go to [EAS Schema Builder (Sepolia)](https://sepolia.easscan.org/schema/create)
2. Create a schema with these fields:
   - `string eventId`
   - `string eventTitle`
   - `uint64 date`
   - `string location`
   - `string organizer`
   - `address attester`
   - `string method`
   - `bool attended`
3. Copy the Schema UID to your `.env.local`

## Optional Enhancements

### Rate Limiting

Add rate limiting to prevent abuse:

```bash
npm install @upstash/ratelimit @upstash/redis
```

### Duplicate Prevention

Track issued attestations to prevent users from claiming multiple times:

```bash
npm install @vercel/kv
```

### Move to Mainnet/L2

When ready for production:
1. Change `RPC_URL` to Base, Optimism, or Ethereum mainnet
2. Update `EAS_ADDRESS` for the target network
3. Register your schema on the production network
4. Fund your organizer wallet with production ETH

## Project Structure

```
.
├── pages/
│   ├── api/
│   │   └── attest.ts       # API route for minting attestations
│   ├── index.tsx           # Home page (redirects to /checkin)
│   └── checkin.tsx         # Main check-in page
├── .env.local              # Environment variables (not committed)
├── .env.example            # Example environment variables
├── package.json
└── README.md
```

## Troubleshooting

### "No wallet found" error
- Make sure MetaMask or another Web3 wallet is installed
- Or use the manual address input instead

### "Invalid address or ENS name" error
- Check that the address is a valid Ethereum address (0x...)
- For ENS names, make sure they're registered and resolve correctly

### Transaction fails
- Ensure the organizer wallet has enough Sepolia ETH
- Check that all environment variables are set correctly
- Verify the schema UID matches your registered schema

## Resources

- [EAS Documentation](https://docs.attest.sh/)
- [EAS SDK](https://github.com/ethereum-attestation-service/eas-sdk)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [EAS Scan (Sepolia)](https://sepolia.easscan.org/)

## License

ISC
