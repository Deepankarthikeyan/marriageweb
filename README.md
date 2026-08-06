# Balaji & Lavanya Wedding Invitation

A beautiful wedding invitation website with pink rose love doors, animations, music, and countdown.

## Live links

| Platform | URL | How to deploy |
|----------|-----|----------------|
| **Netlify** | *(your-site.netlify.app)* | [**Deploy to Netlify**](https://app.netlify.com/start/deploy?repository=https://github.com/Deepankarthikeyan/marriageweb) — one click, free |
| **Vercel** | *(your-site.vercel.app)* | [**Deploy to Vercel**](https://vercel.com/new/clone?repository-url=https://github.com/Deepankarthikeyan/marriageweb) — one click, free |
| **Render** | *(onrender.com)* | [Import on Render](https://dashboard.render.com/) → New → Static Site → connect this repo |
| **GitHub Pages** | https://deepankarthikeyan.github.io/marriageweb/ | Enable once (see below) |
| **Cloudflare Pages** | https://lavanya-balaji-wedding.pages.dev | Redeploy from Cloudflare dashboard |

### Netlify (recommended — fastest)

1. Click [**Deploy to Netlify**](https://app.netlify.com/start/deploy?repository=https://github.com/Deepankarthikeyan/marriageweb)
2. Sign in with GitHub → deploy (uses `netlify.toml` automatically)
3. Your live URL appears in ~1 minute (e.g. `random-name.netlify.app`)
4. Optional: rename site under **Domain settings**

### Vercel

1. Click [**Deploy to Vercel**](https://vercel.com/new/clone?repository-url=https://github.com/Deepankarthikeyan/marriageweb)
2. Sign in with GitHub → Import → Deploy
3. Live URL: `marriageweb.vercel.app` (or similar)

### Render

1. [Render Dashboard](https://dashboard.render.com/) → **New** → **Static Site**
2. Connect **marriageweb** repo → Render reads `render.yaml`
3. Deploy → live on `*.onrender.com`

### Enable GitHub Pages (free)

1. Open https://github.com/Deepankarthikeyan/marriageweb/settings/pages
2. Under **Build and deployment** → **Source** → choose **GitHub Actions**
3. Go to **Actions** → **Deploy Wedding Site** → **Run workflow** (or wait for the latest `main` push)
4. Live URL: **https://deepankarthikeyan.github.io/marriageweb/**

### Auto-deploy from GitHub Actions (optional)

After one-time setup, every push to `main` deploys automatically:

| Platform | GitHub secrets to add |
|----------|----------------------|
| Netlify | `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID` |
| Vercel | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` |
| Cloudflare | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` |

Add secrets at: https://github.com/Deepankarthikeyan/marriageweb/settings/secrets/actions

### Fix Cloudflare Pages (`lavanya-balaji-wedding.pages.dev`)

Avatar updates are merged to `main` but Cloudflare must redeploy from that branch:

1. Open [Cloudflare Pages](https://dash.cloudflare.com/) → project **lavanya-balaji-wedding**
2. **Settings** → **Builds** → confirm:
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output:** `_site`
3. **Deployments** → **Retry deployment** or **Create deployment** on `main`

Or locally (after `npx wrangler login`):

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
