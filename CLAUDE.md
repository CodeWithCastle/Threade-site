# Threadé website: rules for every change

Public site for Threadé (React 19, Create React App, plain CSS in `src/index.css`, text in `src/content.js`).

- Facts must match the app (plans, FAQ, legal documents, pilot date). Never invent prices, numbers or claims; ask.
- User-facing text: short, plain English, no em dashes.
- No cookies, analytics, trackers or third-party scripts, fonts or images. Fonts and images are self-hosted.
- Only the public anon key; no secrets in code or commits.
- No inline scripts or inline style attributes in `public/index.html` (the CSP forbids them; `npm run build` checks).
- Colours from the Threadé tokens (top of `index.css`); dark theme only.
- Accessible: keyboard works everywhere, focus visible, alt text on every screenshot, reduced motion respected, no horizontal scroll at 360px.
- Before merging: `npm run lint`, `CI=true npm test -- --watchAll=false`, `npm run build`.
- Branches: only `development` and `main`. Commit author: Dan Aremu <danaremut@gmail.com>, no co-author lines.
