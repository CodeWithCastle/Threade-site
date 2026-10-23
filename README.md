# Threadé website

The public website for Threadé (`threade.app`): what the app does, plans, FAQ, the launch waitlist and the website privacy note. The app itself is `application-threade-business` (`app.threade.app`).

React 19 with Create React App, plain CSS, Inter (self-hosted). No cookies, no analytics, nothing loaded from other companies.

## Run

```bash
npm install
cp .env.example .env.local   # fill in (see below)
npm start                    # http://localhost:3000 (pages only; the waitlist needs `vercel dev`)
npm test                     # CI=true npm test -- --watchAll=false for one run
npm run lint                 # must be clean (src and api)
npm run build                # checks the environment, builds build/, then checks the output (both must pass)
```

| Variable | Where | What |
|---|---|---|
| `REACT_APP_APP_URL` | pages | The business app (Start free, Sign in, legal pages). Default `https://app.threade.app` |
| `REACT_APP_SITE_URL` | pages | This website's address, for link previews (`og:image` must be a full address). Set in `.env`: `https://www.threade.app` (the main address; `threade.app` redirects there) |
| `THREADE_SUPABASE_URL`, `THREADE_SUPABASE_PUBLISHABLE_KEY` | server function only | The Supabase project and its publishable key, used by `api/waitlist.js` on Vercel. Never `REACT_APP_`: the pages hold no Supabase address or key |
| `WAITLIST_PROXY_SECRET` | server function only | At least 32 random characters. The database accepts waitlist entries only with it (its SHA-256 is stored in the database) |
| `WAITLIST_IP_SALT` | server function only | At least 16 random characters. Keys the hash of a visitor's IP address for the per-visitor limit; the address itself is never stored or sent on |

`npm run build` refuses to start (`scripts/check-env.js`) when a server key (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWT_SECRET`, `POSTGRES_*`), any `REACT_APP_` variable other than the two above, a server-only value in the committed `.env`, or a variable expansion in an `.env` file is found. After the build, `scripts/check-build.js` fails when the pages contain a Supabase address, a key, a database call, a server-only variable name, or the value of any private variable (12 characters or more). Both print names, never values.

## Waitlist

The form posts to this site's own server function, `POST /api/waitlist` (`api/waitlist.js`; the logic and its tests are in `src/server/waitlist.js`, which the pages never import). The function:
- accepts only JSON posts from this site (Origin check), checks every field, and answers a filled hidden field (only bots fill it) as if it worked, saving nothing;
- turns the visitor's IP address (Vercel's `x-real-ip`, else the first `x-forwarded-for`) into HMAC-SHA256 with `WAITLIST_IP_SALT`, so the address itself is never stored or sent on;
- calls the database function `join_waitlist_v2` (application-threade-business migration `20261104000800_waitlist_limits.sql`) with the publishable key in the `apikey` header and the proxy secret; the database limits sign-ups per visitor and overall and keeps one entry per email;
- answers codes only (`ok`/`already`, or `invalid_email`, `invalid_country`, `invalid_name`, `invalid_business`, `rate_limited`, `not_configured`, `failed`); the page shows its own words for each, never the database's text. Someone already on the list sees "You are already on the list. We will email you when Threadé opens to everyone."

Entries are in the table `site_waitlist`, read in the Supabase SQL Editor:

```sql
select email, name, business_name, country_code, created_at, invited_at from site_waitlist order by created_at desc;
```

To remove someone who asks: `delete from site_waitlist where email = 'their@email';`

## Deploy (Vercel)

New project from this repo, framework Create React App, production branch `main`. `vercel.json` sets the install command `npm ci --ignore-scripts` (no package runs code while installing), sends every page except `/api/`, `/static/` and files to `index.html`, and sets the security headers: a Content-Security-Policy that allows no inline scripts or styles and lets the pages connect to this site only (`connect-src 'self'`), HSTS for two years, `Cross-Origin-Opener-Policy: same-origin`, no framing. Environment variables: the table above (Production and Preview). Never connect the Supabase integration to this project. Domains: `www.threade.app` (main), `threade.app` redirects to it (done 2026-10-15).

## Content

All text is in `src/content.js`. Facts must match the app: plans (`application-threade-business/src/features/billing/plans.content.js`), FAQ (`src/features/help/faq.content.js`) and the legal documents. Screens in `public/shots` are the made-up "Sample Atelier" screenshots from `Project Threadé/marketing-screenshots` (webp).

## Branches

`development` for work, `main` for production (Vercel). Merge `development` into `main` with `--no-ff`.
