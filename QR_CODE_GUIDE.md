# QR Code Generation Guide for Multiple Talks

This guide explains how to create unique QR codes for each talk/session at your event.

## How It Works

The app now accepts **URL parameters** to dynamically set event details. This means:
- ✅ **One app deployment** handles all talks
- ✅ **Each QR code** has unique parameters
- ✅ **Attestations** are recorded with specific talk details

## URL Parameter Structure

Your QR codes should point to URLs like this:

```
https://your-app.vercel.app/checkin?eventId=TALK_ID&eventTitle=TALK_NAME&date=UNIX_TIMESTAMP&location=ROOM
```

### Available Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `eventId` | Optional* | Unique identifier for the talk | `web3-security-nov11` |
| `eventTitle` | Optional* | Human-readable talk title | `Web3%20Security%20Workshop` |
| `date` | Optional* | Unix timestamp of the talk | `1731283200` |
| `location` | Optional* | Room or location | `Main%20Hall` |

*If not provided, falls back to `.env.local` defaults

## Example QR Codes for EthFloripa 2025

### November 11, 2025 (Unix: 1731283200)

#### Talk 1: Web3 Security Workshop
```
https://your-app.vercel.app/checkin?eventId=web3-security-nov11&eventTitle=Web3%20Security%20Workshop&date=1731283200&location=Room%201
```

#### Talk 2: DeFi Fundamentals
```
https://your-app.vercel.app/checkin?eventId=defi-fundamentals-nov11&eventTitle=DeFi%20Fundamentals&date=1731283200&location=Main%20Hall
```

#### Talk 3: Smart Contract Auditing
```
https://your-app.vercel.app/checkin?eventId=smart-contract-audit-nov11&eventTitle=Smart%20Contract%20Auditing&date=1731283200&location=Room%202
```

### November 12, 2025 (Unix: 1731369600)

#### Talk 4: Vitalik Keynote
```
https://your-app.vercel.app/checkin?eventId=vitalik-keynote-nov12&eventTitle=Vitalik%20Buterin%20Keynote&date=1731369600&location=Main%20Hall
```

#### Talk 5: Building on Base
```
https://your-app.vercel.app/checkin?eventId=building-base-nov12&eventTitle=Building%20on%20Base&date=1731369600&location=Room%201
```

## Converting Dates to Unix Timestamps

Use this tool: https://www.unixtimestamp.com/

**November 11, 2025** (00:00:00 UTC)
- Unix timestamp: `1731283200`

**November 12, 2025** (00:00:00 UTC)
- Unix timestamp: `1731369600`

For specific talk times, add hours/minutes:
- 10:00 AM: add 36000 seconds → `1731283200 + 36000 = 1731319200`
- 2:00 PM: add 50400 seconds → `1731283200 + 50400 = 1731333600`

## URL Encoding Spaces

When creating URLs, replace spaces with `%20`:
- ❌ `eventTitle=Web3 Security`
- ✅ `eventTitle=Web3%20Security`

## Generating QR Codes

### Option 1: QR Code Generator (Recommended)
1. Go to https://www.qr-code-generator.com
2. Select "URL" type
3. Paste your full URL with parameters
4. Customize design if desired
5. Download as PNG or SVG
6. Print and display at the talk venue

### Option 2: Bulk QR Code Generation

If you have many talks, use a spreadsheet + script:

**Google Sheets Example:**

| Talk ID | Title | Date (Unix) | Location | URL |
|---------|-------|-------------|----------|-----|
| web3-security | Web3 Security | 1731283200 | Room 1 | `=CONCATENATE("https://your-app.vercel.app/checkin?eventId=",A2,"&eventTitle=",SUBSTITUTE(B2," ","%20"),"&date=",C2,"&location=",SUBSTITUTE(D2," ","%20"))` |

Then use a QR code API or bulk generator like:
- https://goqr.me/api/
- https://www.qrcode-monkey.com/

### Option 3: Command Line (Python)

```bash
pip install qrcode[pil]
```

```python
import qrcode

talks = [
    {
        "eventId": "web3-security-nov11",
        "eventTitle": "Web3 Security Workshop",
        "date": "1731283200",
        "location": "Room 1"
    },
    {
        "eventId": "defi-fundamentals-nov11",
        "eventTitle": "DeFi Fundamentals",
        "date": "1731283200",
        "location": "Main Hall"
    }
]

base_url = "https://your-app.vercel.app/checkin"

for talk in talks:
    url = f"{base_url}?eventId={talk['eventId']}&eventTitle={talk['eventTitle'].replace(' ', '%20')}&date={talk['date']}&location={talk['location'].replace(' ', '%20')}"

    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(f"qr_{talk['eventId']}.png")
    print(f"Generated: qr_{talk['eventId']}.png")
```

## Testing Your QR Codes

### Before the Event:

1. Generate a test QR code
2. Scan with your phone
3. Verify the page shows correct:
   - Event title
   - Event ID
   - Date (formatted correctly)
4. Try connecting wallet or entering test address
5. Check attestation on https://sepolia.easscan.org/

### Example Test URLs:

**With all parameters:**
```
http://localhost:3000/checkin?eventId=test-talk&eventTitle=Test%20Talk&date=1731283200&location=Test%20Room
```

**Without parameters (uses .env.local defaults):**
```
http://localhost:3000/checkin
```

## Printing Guidelines

### Size Recommendations:
- **Poster size**: 300x300 mm (12x12 inches) - visible from 3-5 meters
- **Table tent**: 100x100 mm (4x4 inches) - visible from 1-2 meters
- **Badge insert**: 50x50 mm (2x2 inches) - scanning distance

### Design Tips:
- Add talk title above/below QR code
- Include "Scan to claim attendance"
- Add your event logo
- Use high contrast (black on white works best)
- Test scanning from expected distance

### File Formats:
- **Print**: Use SVG or high-resolution PNG (300 DPI minimum)
- **Digital displays**: PNG at screen resolution

## What Attendees See

When they scan the QR code, they'll see:

```
Web3 Security Workshop
Event: web3-security-nov11
Date: 11/11/2025

Connect your wallet or paste your ENS / 0x address
to mint your attendance attestation on Sepolia.

[Connect Wallet & Mint]

— or —

[Enter address/ENS field]
[Mint with ENS / Address]
```

## Attestation Data Structure

Each attestation will contain:
- ✅ **eventId**: Unique talk identifier (e.g., `web3-security-nov11`)
- ✅ **eventTitle**: Talk name (e.g., `Web3 Security Workshop`)
- ✅ **date**: Talk date as Unix timestamp
- ✅ **location**: Room/venue (e.g., `Room 1`)
- ✅ **organizer**: From `.env.local` (e.g., `EthFloripa`)
- ✅ **attester**: Organizer wallet address
- ✅ **method**: Check-in method (e.g., `qr`)
- ✅ **attended**: Always `true`

## Advanced: Dynamic QR Codes

For very large events, consider using a QR code management system that redirects through a short URL:

1. Create short links: `https://yoursite.com/t/1` → redirects to full URL
2. Generate QR codes for short links
3. Can update destinations without reprinting QR codes
4. Track scan analytics

## Troubleshooting

### QR code doesn't scan
- Increase size or quality
- Ensure high contrast
- Check for damage/smudging
- Try different QR code generator

### Wrong event info displayed
- Check URL encoding (spaces = `%20`)
- Verify Unix timestamp is correct
- Test URL in browser first
- Check for typos in eventId

### Parameters not working
- Ensure all parameter names are lowercase
- Check for special characters
- Verify URL is properly encoded
- Test without parameters first (should use .env.local defaults)

## Sample Talk Schedule Template

Use this to plan your QR codes:

| Date | Time | Talk | Room | Event ID | QR Status |
|------|------|------|------|----------|-----------|
| Nov 11 | 10:00 | Web3 Security | Room 1 | `web3-security-nov11` | ✅ Generated |
| Nov 11 | 14:00 | DeFi Basics | Main Hall | `defi-basics-nov11` | ✅ Generated |
| Nov 11 | 16:00 | Smart Contracts | Room 2 | `smart-contracts-nov11` | ⏳ Pending |
| Nov 12 | 09:00 | Keynote | Main Hall | `keynote-nov12` | ✅ Generated |
| Nov 12 | 11:00 | Building on Base | Room 1 | `base-workshop-nov12` | ✅ Generated |

---

**Questions?** See `SETUP_GUIDE.md` or `README.md` for more details.
