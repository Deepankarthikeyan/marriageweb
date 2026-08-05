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

- **Couple photo:** Replace `public/images/couple.jpg`
- **Background music:** Replace `public/music/wedding-melody.mp3` with your chosen song
- **Colors:** Edit CSS variables in `src/styles/main.css`

## Wedding Details

- **Bride:** S. Lavanya
- **Groom:** R. Balaji
- **Reception:** Sunday, September 06, 2026 | 7:00 PM – 10:00 PM
- **Wedding:** Monday, September 07, 2026 | 9:00 AM – 10:00 AM
- **Venue:** Sengunthar Paavadi Panchayat Thirumana Mandapam, Thiruchengode
