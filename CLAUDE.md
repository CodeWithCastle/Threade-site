# Threadé website: rules for every change

Public site for Threadé (React 19, Create React App, plain CSS in `src/index.css`, text in `src/content.js`).

- Facts must match the app (plans, FAQ, legal documents, pilot date). Never invent prices, numbers or claims; ask.
- User-facing text: short, plain English, no em dashes.
- No cookies, analytics, trackers or third-party scripts, fonts or images. Fonts and images are self-hosted.
- The pages hold no Supabase address or key: the waitlist posts to `api/waitlist.js` (logic in `src/server/`, never imported by the pages), which reads the server-only `THREADE_SUPABASE_URL`, `THREADE_SUPABASE_PUBLISHABLE_KEY`, `WAITLIST_PROXY_SECRET` and `WAITLIST_IP_SALT`. Only `REACT_APP_SITE_URL` and `REACT_APP_APP_URL` reach the pages, read by literal name (never `process.env[name]`). No secrets in code or commits; `npm run build` checks before and after.
- No inline scripts or inline style attributes in `public/index.html` (the CSP forbids them; `npm run build` checks).
- Colours from the Threadé tokens (top of `index.css`); dark theme only.
- Accessible: keyboard works everywhere, focus visible, alt text on every screenshot, reduced motion respected, no horizontal scroll at 360px.
- Before merging: `npm run lint`, `CI=true npm test -- --watchAll=false`, `npm run build`.
- Words: "Staff" means Threadé employees only; a business's employees are its "team".
- Branches: only `development` and `main`. Commit author: Dan Aremu <danaremut@gmail.com>, no co-author lines.
