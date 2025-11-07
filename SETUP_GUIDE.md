# Quick Setup Guide

This guide will help you get your EAS attestation check-in app up and running in minutes.

## Prerequisites

- Node.js 18+ installed
- A Sepolia testnet wallet with some ETH
- An RPC provider account (Infura, Alchemy, etc.)

## Step 1: Get Sepolia Test ETH

Your organizer wallet needs Sepolia ETH to pay for gas:

1. Get Sepolia ETH from: https://sepoliafaucet.com/
2. Or try: https://www.infura.io/faucet/sepolia

## Step 2: Get an RPC URL

Choose one of these providers and get an RPC URL:

### Infura (Recommended)
1. Go to https://infura.io
2. Sign up for a free account
3. Create a new project
4. Copy the Sepolia endpoint URL
5. Format: `https://sepolia.infura.io/v3/YOUR_API_KEY`

### Alchemy
1. Go to https://www.alchemy.com
2. Sign up for a free account
3. Create a new app (choose Sepolia)
4. Copy the HTTP URL

## Step 3: Create Your EAS Schema

1. Visit https://sepolia.easscan.org/schema/create
2. Connect your wallet
3. Create a schema with these fields:
   ```
   string eventId
   string eventTitle
   uint64 date
   string location
   string organizer
   address attester
   string method
   bool attended
   ```
4. Make it **revocable** (recommended)
5. Submit and copy the Schema UID

## Step 4: Configure Environment

1. Open `.env.local` in this project
2. Update these values:

```ini
# Your Infura/Alchemy RPC URL
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Your wallet's private key (NEVER share this!)
ORGANIZER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Your schema UID from Step 3
SCHEMA_UID=0xYOUR_SCHEMA_UID

# Don't change this - it's the EAS contract on Sepolia
EAS_ADDRESS=0xC2679fBD37d54388Ce493F1DB75320D236e1815e

# Customize your event details
EVENT_ID=my-event-2025
EVENT_TITLE=My Amazing Event
EVENT_DATE_UNIX=1730851200
EVENT_LOCATION=My Venue
EVENT_ORGANIZER=My Organization
EVENT_METHOD=qr
```

### How to get your private key:
- **MetaMask**: Account Details → Export Private Key
- **IMPORTANT**: Use a dedicated wallet for this, not your main wallet!

### How to get Unix timestamp for your event date:
- Visit: https://www.unixtimestamp.com/
- Enter your event date and copy the timestamp

## Step 5: Run the App

```bash
# Install dependencies (if not done already)
npm install

# Run in development mode
npm run dev
```

Visit http://localhost:3000 and you should see the check-in page!

## Step 6: Test It

1. Open http://localhost:3000/checkin
2. Try connecting a wallet OR paste a test address
3. Click "Mint" and wait for the transaction
4. You should see a success message with links to view the attestation

Test addresses you can use:
- `vitalik.eth` (if ENS is working)
- `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` (random address)

## Step 7: Deploy to Production

### Option A: Vercel (Recommended)

1. Push your code to GitHub (make sure `.env.local` is in `.gitignore`!)
2. Go to https://vercel.com
3. Import your repository
4. Add all environment variables in Vercel's settings
5. Deploy!

### Option B: Other Platforms

This is a standard Next.js app and can be deployed to:
- Railway
- Render
- Heroku
- Any Node.js hosting

## Step 8: Create QR Code

Once deployed, create a QR code:

1. Get your deployed URL (e.g., `https://your-app.vercel.app`)
2. Add `/checkin` to it: `https://your-app.vercel.app/checkin`
3. Use a QR code generator:
   - https://qr-code-generator.com
   - https://www.qr-code-generator.com
4. Print and display at your event!

## Troubleshooting

### "Missing required environment variables"
- Make sure all variables in `.env.local` are set
- Restart the dev server after changing `.env.local`

### "Transaction failed"
- Check that your organizer wallet has Sepolia ETH
- Verify the schema UID is correct
- Make sure RPC_URL is valid and working

### "Invalid address or ENS name"
- ENS resolution requires a proper RPC provider
- Try with a direct address (0x...) instead
- Check that the ENS name exists

### Build fails
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall
- Make sure you're using Node.js 18+

## Next Steps

### Add Rate Limiting
To prevent abuse, add rate limiting:
```bash
npm install @upstash/ratelimit @upstash/redis
```
See: https://github.com/upstash/ratelimit

### Track Issued Attestations
Prevent users from claiming multiple times by storing issued attestations in a database.

### Move to Mainnet/L2
When ready for production:
1. Register your schema on Base, Optimism, or Ethereum mainnet
2. Update `RPC_URL` and `EAS_ADDRESS` for your target network
3. Fund your organizer wallet with real ETH

### Add Custom Branding
- Update colors and fonts in `pages/checkin.tsx`
- Add your logo to `/public`
- Customize the success message

## Security Checklist

- [ ] Using a dedicated wallet for the organizer key
- [ ] Never committed `.env.local` to git
- [ ] Added rate limiting in production
- [ ] Using HTTPS for the deployed app
- [ ] Environment variables set in Vercel/deployment platform
- [ ] Tested with a small amount of gas before the event

## Support

- EAS Documentation: https://docs.attest.sh/
- EAS Discord: https://discord.gg/attestations
- Next.js Docs: https://nextjs.org/docs

## License

ISC
