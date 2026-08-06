# Balaji & Lavanya Wedding Invitation

A beautiful wedding invitation website with pink rose love doors, animations, music, and countdown.

## Live links

| Platform | URL | Status |
|----------|-----|--------|
| **GitHub Pages** | https://deepankarthikeyan.github.io/marriageweb/ | Enable in [Repo Settings → Pages](https://github.com/Deepankarthikeyan/marriageweb/settings/pages) → Source: **GitHub Actions** |
| **Cloudflare Pages** | https://lavanya-balaji-wedding.pages.dev | Deploy via [Cloudflare Dashboard](https://pages.cloudflare.com/) |

### Enable GitHub Pages (free, 1 minute)

1. Open https://github.com/Deepankarthikeyan/marriageweb/settings/pages
2. Under **Build and deployment** → **Source** → choose **GitHub Actions**
3. Push to `main` or run **Deploy Wedding Site** workflow manually
4. Your site will be live at **https://deepankarthikeyan.github.io/marriageweb/**

### Deploy to Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Create project → Connect GitHub → `marriageweb`
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `_site`
   - **Node version:** 22
4. Live URL: **https://lavanya-balaji-wedding.pages.dev**

Or with Wrangler CLI:
```bash
npm install
npm run deploy
```

## Preview Locally

```bash
npm run preview
```

Open http://localhost:8765

## Customize

| Asset | Path | Notes |
|-------|------|-------|
| **Invitation card** | `public/images/invitation.jpg` | Your actual invitation card image |
| **Couple photo** | `public/images/couple.jpg` | Auto-extracted from invitation (see below) |
| **Background music** | `public/music/wedding-melody.mp3` | Replace with your chosen song |
| **Colors/theme** | `src/styles/main.css` | Edit CSS variables |

### Add your real couple photo

**Easiest — upload on GitHub:**

1. Open: https://github.com/Deepankarthikeyan/marriageweb/upload/cursor/wedding-invitation-4ebd
2. Drag your couple photo into `public/images/`
3. Name it **`couple.jpg`** and commit

**Or locally:**

```bash
./scripts/add-couple-photo.sh /path/to/your/couple-photo.jpg
npm run build && npm run deploy
```

## Wedding Details

- **Bride:** S. Lavanya
- **Groom:** R. Balaji
- **Reception:** Sunday, September 06, 2026 | 7:00 PM – 10:00 PM
- **Wedding:** Monday, September 07, 2026 | 9:00 AM – 10:00 AM
- **Venue:** Sengunthar Paavadi Panchayat Thirumana Mandapam, Thiruchengode
