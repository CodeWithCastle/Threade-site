# Engineering Contract & Agent Rules: Marketing Website

> **Scope:** `application-threade-site/`  
> **App:** Public marketing site for Threadé (React 19, Create React App, plain CSS in `src/index.css`, text in `src/content.js`, guides in `src/guides.js`).

---

# Engineering Contract

## Before making changes
- Read `AGENTS.md` and the relevant project documentation.
- Inspect the existing implementation and its callers before editing.
- Identify the established patterns in adjacent files and follow them.
- Understand the task's intent, acceptance criteria, and constraints.
- If a requirement is ambiguous and materially affects the design, ask before making assumptions.

## Coding standards
- Prefer existing project abstractions over introducing new ones.
- Match existing naming, formatting, typing, module boundaries, and error-handling conventions.
- Do not introduce a new library, framework, design pattern, or abstraction without justification.
- Do not duplicate existing functionality.
- Preserve backward compatibility unless a breaking change is explicitly requested.
- Avoid unrelated refactoring and unnecessary file changes.
- Never replace working code with a simplified approximation of the existing system.

## Implementation process
1. Trace the relevant code and data flow.
2. State the implementation plan and expected files affected.
3. Implement the smallest complete solution.
4. Run relevant tests, linting, type checks, and builds.
5. Review the diff for regressions and unrelated changes.
6. Report completed changes, validation results, and unresolved risks.

## Context handoff
- Keep `docs/CURRENT_STATE.md` accurate for substantial or interrupted tasks.
- Record decisions, constraints, and rejected approaches that matter to future work.
- Identify modified files, remaining steps, failed tests, and exact blockers.
- Never claim that tests passed unless they were actually executed successfully.

## Safety
- Preserve unrelated user changes.
- Never overwrite or discard uncommitted work.
- Do not commit, push, deploy, or perform destructive operations without authorization.

---

## Operating Rules & Routing
- **Page Directory:** Every public page must be registered in `src/pages.js` (address, title, description, published date).
- **Static Pre-rendering:** `scripts/prerender.js` runs postbuild and generates static HTML files for each page, plus `404.html` and `sitemap.xml`. Vercel serves these with `cleanUrls` enabled.
- **Adding a Page:** A new route requires an entry in `src/pages.js` and a corresponding route handler in `src/App.jsx`.
- **Hydration Invariance:** The markup rendered on the server must match the browser exactly:
  - Do NOT reference `window`, `document`, or dynamic "now" timestamps during initial render.
  - Do NOT use inline `style` attributes (the Content Security Policy refuses inline styles in HTML).

---

## Privacy & Trackers Policy
- **Zero Third-Party Assets:** Strictly NO cookies, trackers, analytics scripts, third-party CDNs, external web fonts, or remote images.
- **Self-Hosted Only:** All typography and images must be self-hosted in `public/`.

---

## SEO & Structured Data
- **Metadata Accuracy:** Unique page titles and meta descriptions per page.
- **Truthful Schema:** Structured JSON-LD schema (`src/seo.js`) must reflect reality (no fabricated reviews, ratings, or non-public prices).
- **Robots Policy:** `public/robots.txt` must keep pages open to standard web crawlers and AI search agents (e.g. OAI-SearchBot).

---

## Environment Variables & Security
- **No Direct Supabase Keys in HTML/Bundle:** The public site does NOT hold Supabase URLs or anon keys.
- **Serverless Form Handling:** Waitlist submissions post to the serverless function `api/waitlist.js` (logic in `src/server/`, never imported by React pages).
- **Literal Reads:** Only `REACT_APP_SITE_URL` and `REACT_APP_APP_URL` are accessible on the client, read by literal string name (never `process.env[key]`).
- **CSP Integrity:** `npm run build` verifies that no secret keys or inline scripts exist in the output.

---

## Design, Accessibility & Copy
- **Theme:** Dark theme only, powered by tokens at the top of `src/index.css`.
- **Accessibility:** Keyboard navigable, visible focus states, meaningful alt text on all screenshots, reduced-motion media query compliance, responsive down to 360px viewport width without horizontal overflow.
- **Copy Standards:** Plain, concise English. No em dashes (`—`).
- **Terminology:** "Staff" refers exclusively to Threadé internal employees. A subscriber's workers are referred to as their "team" or "team members".

---

## Pre-Merge Verification Commands
```bash
npm run lint
CI=true npm test -- --watchAll=false
npm run build
```

---

## Git & Commit Rules
- **`main` and `development` are permanent.** Never delete either, local or remote, for any reason: they are the record of truth. "Delete the branches" after a merge means the working branch only; if that is at all ambiguous, name the exact branches back to the user and wait.
- **Branches:** Work only on `development` and `main`.
- Delete a working branch only once it is fully merged, and only with `git branch -d`, which refuses when work would be lost. Never `-D`.
- **Commit Author:** `Dan Aremu <danaremut@gmail.com>`. No co-author trailers.

---

## Agent Handover Protocol

Prepare this project for a handoff to another coding agent.

1. Update `docs/CURRENT_STATE.md` with the task objective, acceptance criteria, architecture involved, decisions and rationale, completed changes, incomplete work, known issues, and precise next steps.
2. Document any new coding conventions or architectural decisions in the appropriate shared documentation.
3. List all modified and untracked files relevant to this task.
4. Record the exact validation commands executed and their actual results. Clearly distinguish tests that were not run from tests that failed.
5. Identify assumptions, unresolved questions, potential regressions, and constraints that the next agent must preserve.
6. Review the Git diff to ensure the handoff accurately describes the implementation.
7. Do not discard changes, reset files, commit, or push anything.

The handoff must enable a new agent with no access to this conversation to continue the original task without reimplementing completed work or changing the established architecture.
