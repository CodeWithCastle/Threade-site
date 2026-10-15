# Threadé website

The public website for Threadé (`threade.app`): what the app does, plans, FAQ, the launch waitlist and the website privacy note. The app itself is `application-threade` (`app.threade.app`).

React 19 with Create React App, plain CSS, Inter (self-hosted). No cookies, no analytics, nothing loaded from other companies.

## Run

```bash
npm install
cp .env.example .env.local   # fill in (public values only)
npm start                    # http://localhost:3000
npm test                     # CI=true npm test -- --watchAll=false for one run
npm run lint                 # must be clean
npm run build                # build/, then scripts/check-build.js (must pass)
```

| Variable | What |
|---|---|
| `REACT_APP_APP_URL` | The business app (Start free, Sign in, legal pages). Default `https://app.threade.app` |
| `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY` | The waitlist. Same Supabase project as the app; public anon key only. Empty: the form asks people to email team@threade.app |

## Waitlist

The form calls the database function `join_waitlist` (application-threade migration `20261103000000_site_waitlist.sql`, run order step 12). Entries are in the table `site_waitlist`, read in the Supabase SQL Editor:

```sql
select email, name, business_name, country_code, created_at from site_waitlist order by created_at desc;
```

To remove someone who asks: `delete from site_waitlist where email = 'their@email';`

## Deploy (Vercel)

New project from this repo, framework Create React App, production branch `main`. Set the three variables above. Add the domain (`threade.app`, `www.threade.app`). `vercel.json` sends every page to `index.html` and sets the security headers (no inline scripts allowed).

## Content

All text is in `src/content.js`. Facts must match the app: plans (`application-threade/src/features/billing/plans.content.js`), FAQ (`src/features/help/faq.content.js`) and the legal documents. Screens in `public/shots` are the made-up "Sample Atelier" screenshots from `Project Threadé/marketing-screenshots` (webp).

## Branches

`development` for work, `main` for production (Vercel). Merge `development` into `main` with `--no-ff`.
