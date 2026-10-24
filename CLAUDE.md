# Threadé website: rules for every change

Public site for Threadé (React 19, Create React App, plain CSS in `src/index.css`, text in `src/content.js` and guides in `src/guides.js`).

- Pages: every public page is listed in `src/pages.js` (address, title, description, date). `scripts/prerender.js` (postbuild) writes each one as its own HTML file with the content already in it, plus `404.html` and `sitemap.xml`; the browser then hydrates it. Vercel serves them with `cleanUrls` and no catch-all rewrite, so unknown addresses get a real 404. A new page needs an entry in `src/pages.js` and a case in `src/App.jsx`.
- Search: titles and descriptions unique per page; structured data (`src/seo.js`) says only what is true (no ratings, no prices that are not public). `public/robots.txt` keeps every page open to search engines and OAI-SearchBot.
- Markup must render the same on the server and in the browser: no `window`, `document` or dates of "now" during render, no inline `style` (the CSP refuses it in the HTML).

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
