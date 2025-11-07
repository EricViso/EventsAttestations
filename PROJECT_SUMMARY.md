# EAS Attestation Check-in App - Project Summary

## What This Is

A simple, production-ready Next.js web application that allows event attendees to claim on-chain attestations via the Ethereum Attestation Service (EAS). Attendees can either connect their wallet or manually enter their address/ENS name to receive an instant attestation on Sepolia testnet.

## Key Features

1. **Two Ways to Claim**: Wallet connection OR manual address/ENS entry
2. **Instant Minting**: Attestations are created immediately on-chain
3. **Gas-less for Users**: Event organizer pays all transaction fees
4. **ENS Support**: Automatically resolves ENS names to addresses
5. **Mobile-Friendly**: Works great on phones for QR code scanning
6. **Production Ready**: Built with TypeScript and Next.js best practices

## How It Works

```
User scans QR → Opens /checkin page → Submits wallet/address
    ↓
API validates address/ENS
    ↓
Server calls EAS.attest() with your schema
    ↓
Transaction mined on Sepolia
    ↓
User sees success + attestation UID + links to view on EAS Scan
```

## Project Structure

```
EventsAttestations/
├── pages/
│   ├── _app.tsx              # Next.js app wrapper
│   ├── _document.tsx         # Custom HTML document
│   ├── index.tsx             # Home page (redirects to /checkin)
│   ├── checkin.tsx           # Main check-in UI
│   └── api/
│       └── attest.ts         # API endpoint that mints attestations
├── .env.local                # Your configuration (not in git)
├── .env.example              # Example configuration
├── .gitignore                # Git ignore rules
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── README.md                 # Main documentation
├── SETUP_GUIDE.md            # Step-by-step setup instructions
└── PROJECT_SUMMARY.md        # This file
```

## Technology Stack

- **Framework**: Next.js 16 (React)
- **Language**: TypeScript
- **Blockchain**: Ethereum (Sepolia testnet)
- **Attestations**: EAS SDK v2.9
- **Web3**: ethers.js v6
- **Styling**: Inline styles (easily customizable)

## API Endpoint

### POST `/api/attest`

Mints a new attestation for a recipient.

**Request Body:**
```json
{
  "recipient": "vitalik.eth" // or "0x1234..."
}
```

**Response (Success):**
```json
{
  "status": "ok",
  "uid": "0xabc123...",
  "txHash": "0xdef456..."
}
```

**Response (Error):**
```json
{
  "error": "Invalid address or ENS name"
}
```

## Environment Variables

All configuration is in `.env.local`:

| Variable | Description | Example |
|----------|-------------|---------|
| `RPC_URL` | Sepolia RPC endpoint | `https://sepolia.infura.io/v3/...` |
| `ORGANIZER_PRIVATE_KEY` | Wallet private key (pays gas) | `0xabc123...` |
| `SCHEMA_UID` | Your EAS schema UID | `0x5e116f...` |
| `EAS_ADDRESS` | EAS contract (don't change) | `0xC2679f...` |
| `EVENT_ID` | Unique event identifier | `ethfloripa-2025` |
| `EVENT_TITLE` | Event name | `EthFloripa 2025` |
| `EVENT_DATE_UNIX` | Event date (Unix timestamp) | `1762291200` |
| `EVENT_LOCATION` | Event location | `ACATE, Florianópolis` |
| `EVENT_ORGANIZER` | Organizer name | `EthFloripa` |
| `EVENT_METHOD` | Check-in method | `qr` |

## Schema Definition

The app uses this EAS schema (must match exactly in `pages/api/attest.ts`):

```
string eventId         - Unique event identifier
string eventTitle      - Event name
uint64 date            - Event date (Unix timestamp)
string location        - Event location
string organizer       - Organizer name
address attester       - Address of the attester (organizer)
string method          - How they checked in (qr, manual, etc.)
bool attended          - Always true (attendance confirmed)
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npm run lint
```

## Deployment Checklist

Before deploying to production:

- [ ] Create EAS schema on Sepolia
- [ ] Get RPC URL from Infura/Alchemy
- [ ] Create dedicated organizer wallet
- [ ] Fund wallet with Sepolia ETH (~0.05 ETH for 50-100 attestations)
- [ ] Update all `.env.local` variables
- [ ] Test locally with `npm run dev`
- [ ] Push to GitHub (ensure `.env.local` is gitignored!)
- [ ] Deploy to Vercel/Railway/etc.
- [ ] Add environment variables in deployment platform
- [ ] Test on deployed URL
- [ ] Generate QR code pointing to `/checkin` page
- [ ] Print QR code for event

## Cost Estimates (Sepolia)

- Gas per attestation: ~0.0005-0.001 ETH
- For 100 attendees: ~0.05-0.1 Sepolia ETH
- Sepolia ETH is free from faucets

## Moving to Production

To use on mainnet or L2s:

1. **Base** (Recommended for low fees)
   - EAS Address: Check https://docs.attest.sh/docs/quick--start/contracts
   - RPC: Get from Alchemy/Infura
   - Cost: ~$0.01-0.05 per attestation

2. **Optimism** (Also good for low fees)
   - Similar setup to Base
   - Check EAS docs for contract address

3. **Ethereum Mainnet** (Most expensive)
   - Only if you need maximum security
   - Cost: ~$2-10 per attestation (depending on gas)

## Security Considerations

1. **Private Key**: Never commit `.env.local` or share your private key
2. **Dedicated Wallet**: Use a separate wallet just for this app
3. **Rate Limiting**: Add rate limiting to prevent spam (see SETUP_GUIDE.md)
4. **Duplicate Prevention**: Track issued attestations to prevent duplicates
5. **HTTPS Only**: Always use HTTPS in production
6. **Environment Variables**: Store securely in deployment platform

## Future Enhancements

Possible improvements:

- **Rate limiting** with Upstash Redis
- **Database** to track issued attestations
- **Admin dashboard** to view all attendees
- **Multiple events** support
- **Off-chain attestations** for zero gas
- **Delegated attestations** for user signatures
- **Custom branding** and themes
- **Multiple check-in methods** (QR, NFC, manual)
- **Batch attestations** for organizers
- **Revocation interface** for organizers

## Support Resources

- **EAS Documentation**: https://docs.attest.sh/
- **EAS Schema Registry**: https://sepolia.easscan.org/
- **Next.js Docs**: https://nextjs.org/docs
- **ethers.js Docs**: https://docs.ethers.org/v6/

## Testing

Manual testing steps:

1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000
3. Should redirect to `/checkin`
4. Try wallet connection (if you have MetaMask)
5. Try manual entry with test address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
6. Should see success message with UID and transaction hash
7. Click links to verify on EAS Scan and Etherscan

## Troubleshooting

See `SETUP_GUIDE.md` for detailed troubleshooting steps.

## License

ISC - Free to use, modify, and distribute.

## Credits

Built with the suggestion architecture provided for EthFloripa 2025 event. Adapted for general event use.

---

**Ready to use!** Follow `SETUP_GUIDE.md` to get started.
