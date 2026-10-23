// Which environment variables a build may see. Shared by check-env.js (before the build) and
// check-build.js (after it). Messages name variables only, never their values.
//
// The website ships no Supabase address or key (founder decision 2026-10-23): the waitlist form posts
// to this site's own server function (api/waitlist.js), which alone reads the server-only values.
const fs = require('fs');
const path = require('path');

// Bundled into the pages (public values only).
const BUNDLED = ['REACT_APP_SITE_URL', 'REACT_APP_APP_URL'];
// Read by api/waitlist.js on Vercel only. Allowed in the environment; their values must never reach the pages.
const SERVER_ONLY = ['THREADE_SUPABASE_URL', 'THREADE_SUPABASE_PUBLISHABLE_KEY', 'WAITLIST_PROXY_SECRET', 'WAITLIST_IP_SALT'];
// Server keys and database credentials: never in a build environment.
const FORBIDDEN = /^(SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SECRET_KEYS?|SUPABASE_JWT_SECRET|POSTGRES_\w*)$/;
// The files Create React App reads for `npm run build`, most important first.
const ENV_FILES = ['.env.production.local', '.env.local', '.env.production', '.env'];

// Build machine details that may appear in the output by chance (paths, commit text, addresses).
// A name that looks like a secret is still checked.
const MACHINE = /^(PATH|HOME|PWD|OLDPWD|INIT_CWD|SHELL|USER|LOGNAME|HOSTNAME|HOST|LANG|LANGUAGE|LC_\w+|TERM|TERM_\w+|COLORTERM|TZ|TMPDIR|TMP|TEMP|EDITOR|PAGER|SHLVL|_|CI|NODE|NODE_ENV|NODE_OPTIONS|NODE_VERSION|PUBLIC_URL|GENERATE_SOURCEMAP|INLINE_RUNTIME_CHUNK|VERCEL|VERCEL_\w+|NOW_\w+|npm_\w+|NVM_\w+|XDG_\w+|COREPACK_\w*)$/;
const SECRETISH = /(^|_)KEYS?($|_)|TOKEN|SECRET|PASSW|PRIVATE|CREDENTIAL|AUTH|BYPASS|OIDC|COOKIE|SESSION|SALT/i;
const MIN_SECRET_LENGTH = 12;

const set = (value) => typeof value === 'string' && value.trim() !== '';

/** Reads KEY=VALUE lines from the .env files that exist: [{ file, key, value }]. */
function readEnvFiles(root, names = ENV_FILES) {
  const entries = [];
  for (const file of names) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
      const match = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
      if (!match || line.trim().startsWith('#')) continue;
      let value = match[2].trim();
      if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
      entries.push({ file, key: match[1], value });
    }
  }
  return entries;
}

// `$NAME` and `${NAME}` references (dotenv-expand), except escaped `\$`.
const references = (value) => [...value.matchAll(/(?<!\\)\$\{?([A-Za-z_][A-Za-z0-9_]*)/g)].map((m) => m[1]);

/** { problems, warnings } for the build environment and the .env files. Names only. */
function checkEnvironment(env, entries) {
  const problems = [];
  const warnings = [];
  const allowed = BUNDLED.join(' and ');
  for (const [key, value] of Object.entries(env)) {
    if (!set(value)) continue;
    if (FORBIDDEN.test(key)) problems.push(`${key} is set in the build environment. Delete it (Vercel: Settings, Environment Variables; never connect the Supabase integration to this project).`);
    else if (key.startsWith('REACT_APP_') && !BUNDLED.includes(key)) problems.push(`${key} is set: every REACT_APP_ variable is sent to browsers, and only ${allowed} are allowed. Delete it.`);
  }
  for (const { file, key, value } of entries) {
    if (FORBIDDEN.test(key) && set(value)) problems.push(`${key} is in ${file}. Server keys never go in this site's files.`);
    if (key.startsWith('REACT_APP_') && !BUNDLED.includes(key)) problems.push(`${key} is in ${file}: only ${allowed} may reach the browser.`);
    if (SERVER_ONLY.includes(key) && file === '.env') problems.push(`${key} is in the committed .env. Server values go on Vercel or in .env.local only.`);
    for (const name of references(value)) problems.push(`${key} in ${file} reads $${name}. The website maps no variables.`);
  }
  return { problems, warnings };
}

/** Names and values that must never appear in the build: everything not public, at least 12 characters. */
function secretValues(env, entries) {
  const allowed = new Set(BUNDLED);
  const found = new Map();
  const consider = (key, value) => {
    if (!set(value) || value.length < MIN_SECRET_LENGTH || allowed.has(key)) return;
    if (MACHINE.test(key) && !SECRETISH.test(key)) return;
    if (!found.has(value)) found.set(value, key);
  };
  for (const [key, value] of Object.entries(env)) consider(key, value);
  for (const { key, value } of entries) if (!references(value).length) consider(key, value);
  return [...found].map(([value, name]) => ({ name, value }));
}

/** Names of the secrets whose value appears in the file contents (Buffer). */
function leakedIn(buffer, secrets) {
  return secrets.filter(({ value }) => buffer.includes(value)).map(({ name }) => name);
}

// Anything that would let a browser reach Supabase directly: the project address, a key, the
// database function names, or the server function's private names.
const SUPABASE_IN_PAGES = [
  [/[a-z0-9-]+\.supabase\.(co|in)/i, 'a Supabase project address'],
  [/sb_(publishable|secret)_[A-Za-z0-9_-]{8,}/, 'a Supabase key'],
  [/eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/, 'a JWT (old Supabase key)'],
  [/\/rest\/v1\/|join_waitlist/, 'a database call'],
  [/THREADE_SUPABASE_|WAITLIST_PROXY_SECRET|WAITLIST_IP_SALT/, 'a server-only variable name'],
];
function supabaseIn(text) {
  return SUPABASE_IN_PAGES.filter(([pattern]) => pattern.test(text)).map(([, what]) => what);
}

module.exports = { BUNDLED, SERVER_ONLY, FORBIDDEN, ENV_FILES, readEnvFiles, checkEnvironment, secretValues, leakedIn, supabaseIn };
