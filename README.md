# Lavanya & Balaji Wedding Invitation

A beautiful, modern wedding invitation website with animations, background music, and countdown timer.

## Preview Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Cloudflare Pages

### Option 1: Cloudflare Dashboard
1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Create a new project → Connect to Git
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 22
4. Deploy!

### Option 2: Wrangler CLI
```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name lavanya-balaji-wedding
```

## Customize

| Asset | Path | Notes |
|-------|------|-------|
| **Invitation card** | `public/images/invitation.jpg` | Your actual invitation card image |
| **Couple photo** | `public/images/couple.jpg` | Auto-extracted from invitation (see below) |
| **Background music** | `public/music/wedding-melody.mp3` | Replace with your chosen song |
| **Colors/theme** | `src/styles/main.css` | Edit CSS variables |

### Add your real couple photo

1. Save your invitation card image as `public/images/invitation.jpg`
2. Run the extract script:
   ```bash
   chmod +x scripts/extract-couple-photo.sh
   ./scripts/extract-couple-photo.sh
   ```
3. Rebuild: `npm run build`

## Wedding Details

- **Bride:** S. Lavanya
- **Groom:** R. Balaji
- **Reception:** Sunday, September 06, 2026 | 7:00 PM – 10:00 PM
- **Wedding:** Monday, September 07, 2026 | 9:00 AM – 10:00 AM
- **Venue:** Sengunthar Paavadi Panchayat Thirumana Mandapam, Thiruchengode
