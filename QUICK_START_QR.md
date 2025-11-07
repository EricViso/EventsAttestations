# Quick Start: Generate Your QR Codes

## 📋 Before You Start

1. Deploy your app to Vercel (or get your URL)
2. Know your talk schedule with dates

## 🔢 Get Unix Timestamps

Visit: https://www.unixtimestamp.com/

**EthFloripa 2025 Dates:**
- **November 11, 2025**: `1731283200`
- **November 12, 2025**: `1731369600`

## 🔗 Create Your URLs

Replace `your-app.vercel.app` with your actual domain.

### Template:
```
https://your-app.vercel.app/checkin?eventId=TALK-ID&eventTitle=TALK%20TITLE&date=TIMESTAMP&location=ROOM
```

### Real Examples:

**Day 1 (Nov 11) - Morning Talk**
```
https://your-app.vercel.app/checkin?eventId=web3-security&eventTitle=Web3%20Security&date=1731283200&location=Room%201
```

**Day 1 (Nov 11) - Afternoon Talk**
```
https://your-app.vercel.app/checkin?eventId=defi-basics&eventTitle=DeFi%20Basics&date=1731283200&location=Main%20Hall
```

**Day 2 (Nov 12) - Keynote**
```
https://your-app.vercel.app/checkin?eventId=keynote&eventTitle=Vitalik%20Keynote&date=1731369600&location=Main%20Hall
```

**Day 2 (Nov 12) - Workshop**
```
https://your-app.vercel.app/checkin?eventId=base-workshop&eventTitle=Building%20on%20Base&date=1731369600&location=Room%202
```

## 🎨 Generate QR Codes

### Option 1: Online (Easiest)
1. Go to: https://www.qr-code-generator.com
2. Click "URL"
3. Paste your full URL (with parameters!)
4. Click "Create QR Code"
5. Download PNG (or SVG for printing)
6. Done! 🎉

### Option 2: Use Google Sheets + Batch
1. Create spreadsheet with your talks
2. Build URLs with formula
3. Use bulk QR generator
4. See `QR_CODE_GUIDE.md` for details

## 📝 Fill This Template

Copy this and fill in your details:

```
Talk 1:
- Event ID: ________________
- Title: ________________
- Date (Unix): 1731283200 (Nov 11)
- Location: ________________
- URL: https://your-app.vercel.app/checkin?eventId=____&eventTitle=____&date=1731283200&location=____

Talk 2:
- Event ID: ________________
- Title: ________________
- Date (Unix): 1731283200 (Nov 11)
- Location: ________________
- URL: https://your-app.vercel.app/checkin?eventId=____&eventTitle=____&date=1731283200&location=____

Talk 3:
- Event ID: ________________
- Title: ________________
- Date (Unix): 1731369600 (Nov 12)
- Location: ________________
- URL: https://your-app.vercel.app/checkin?eventId=____&eventTitle=____&date=1731369600&location=____
```

## ⚠️ Important Notes

1. **Replace spaces with %20** in URLs
   - ❌ `Web3 Security`
   - ✅ `Web3%20Security`

2. **Test before printing!**
   - Scan with your phone
   - Check the page shows correct info
   - Try minting a test attestation

3. **Use unique eventId for each talk**
   - Good: `web3-security-nov11`, `defi-basics-nov11`
   - Bad: `talk1`, `talk2` (too generic)

## 🖨️ Printing Tips

- **Minimum size**: 5cm x 5cm (2" x 2")
- **Recommended**: 10cm x 10cm (4" x 4")
- **Format**: PNG at 300 DPI or SVG
- **Colors**: Black on white (best scanning)

## ✅ Checklist

- [ ] App deployed to production
- [ ] All URLs created with correct parameters
- [ ] URLs tested in browser
- [ ] QR codes generated
- [ ] QR codes tested by scanning
- [ ] Test attestation minted successfully
- [ ] QR codes printed
- [ ] Displayed at venue before talks

## 🆘 Problems?

**QR doesn't scan?**
- Make it bigger
- Increase contrast
- Check printer quality

**Wrong info shows up?**
- Check URL has `%20` for spaces
- Verify Unix timestamp
- Test URL in browser first

**Can't generate QR?**
- Try different generator
- Check URL is complete
- Remove special characters

---

**Need more help?** See `QR_CODE_GUIDE.md` for detailed instructions.
