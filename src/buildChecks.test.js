/* eslint-disable no-template-curly-in-string */
// The build environment rules (scripts/env-rules.js, check-env.js, check-build.js) and the settings
// that keep server values away from the pages (package.json, vercel.json, .env).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { checkEnvironment, leakedIn, readEnvFiles, secretValues, supabaseIn } = require('../scripts/env-rules');

const root = path.join(__dirname, '..');
const committed = [
  { file: '.env', key: 'GENERATE_SOURCEMAP', value: 'false' },
  { file: '.env', key: 'REACT_APP_SITE_URL', value: 'https://www.threade.app' },
];
const FAKE_SECRET = 'not-a-real-secret-value-123456';
const SERVER = {
  THREADE_SUPABASE_URL: 'https://abcdefghij.supabase.co', THREADE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_server-only-key',
  WAITLIST_PROXY_SECRET: FAKE_SECRET, WAITLIST_IP_SALT: 'salt-value-1234567',
};

describe('before the build (check-env)', () => {
  it('passes with the public names and the server-only waitlist settings', () => {
    expect(checkEnvironment({ ...SERVER, REACT_APP_APP_URL: 'https://app.threade.app', PATH: '/usr/bin' }, committed)).toEqual({ problems: [], warnings: [] });
  });

  it('the committed .env passes as it is', () => {
    expect(checkEnvironment({}, readEnvFiles(root, ['.env'])).problems).toEqual([]);
  });

  it('refuses server keys and database credentials, naming them only', () => {
    const env = { SUPABASE_SERVICE_ROLE_KEY: FAKE_SECRET, SUPABASE_SECRET_KEY: FAKE_SECRET, SUPABASE_JWT_SECRET: FAKE_SECRET, POSTGRES_PASSWORD: FAKE_SECRET };
    const { problems } = checkEnvironment(env, committed);
    expect(problems).toHaveLength(4);
    expect(problems.join('\n')).not.toContain(FAKE_SECRET);
  });

  it('refuses any Supabase value meant for the pages', () => {
    const { problems } = checkEnvironment({ REACT_APP_SUPABASE_URL: 'https://x.supabase.co', REACT_APP_SUPABASE_ANON_KEY: 'k', REACT_APP_SUPABASE_PUBLISHABLE_KEY: 'k' }, committed);
    expect(problems).toHaveLength(3);
    const files = checkEnvironment({}, [...committed,
      { file: '.env', key: 'REACT_APP_SUPABASE_URL', value: '$THREADE_SUPABASE_URL' },
      { file: '.env', key: 'THREADE_SUPABASE_URL', value: 'https://x.supabase.co' }]).problems;
    expect(files).toEqual([
      expect.stringContaining('REACT_APP_SUPABASE_URL is in .env'),
      expect.stringContaining('reads $THREADE_SUPABASE_URL'),
      expect.stringContaining('THREADE_SUPABASE_URL is in the committed .env'),
    ]);
  });

  it('the script fails without printing the value', () => {
    const run = spawnSync(process.execPath, [path.join(root, 'scripts', 'check-env.js')], {
      env: { PATH: process.env.PATH, SUPABASE_SECRET_KEY: FAKE_SECRET }, encoding: 'utf8',
    });
    expect(run.status).toBe(1);
    expect(run.stderr).toContain('SUPABASE_SECRET_KEY');
    expect(run.stdout + run.stderr).not.toContain(FAKE_SECRET);
    expect(spawnSync(process.execPath, [path.join(root, 'scripts', 'check-env.js')], { env: { PATH: process.env.PATH, ...SERVER }, encoding: 'utf8' }).status).toBe(0);
  });
});

describe('after the build (check-build)', () => {
  it('treats the server-only waitlist values as private', () => {
    const names = secretValues({ ...SERVER, REACT_APP_SITE_URL: 'https://www.threade.app', VERCEL_PROJECT_PRODUCTION_URL: 'www.threade.app' }, committed).map((s) => s.name).sort();
    expect(names).toEqual(['THREADE_SUPABASE_PUBLISHABLE_KEY', 'THREADE_SUPABASE_URL', 'WAITLIST_IP_SALT', 'WAITLIST_PROXY_SECRET']);
    expect(leakedIn(Buffer.from(`fetch("${SERVER.THREADE_SUPABASE_URL}")`), secretValues(SERVER, []))).toEqual(['THREADE_SUPABASE_URL']);
  });

  it('finds any Supabase address, key or database call in the pages', () => {
    expect(supabaseIn('fetch("https://abc.supabase.co/rest/v1/rpc/join_waitlist")')).toEqual(['a Supabase project address', 'a database call']);
    expect(supabaseIn('k="sb_publishable_abcdefgh123"')).toEqual(['a Supabase key']);
    expect(supabaseIn('process.env.THREADE_SUPABASE_URL')).toEqual(['a server-only variable name']);
    expect(supabaseIn('fetch("/api/waitlist")')).toEqual([]);
  });
});

describe('settings', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const all = vercel.headers.find((h) => h.source === '/(.*)').headers;
  const header = (key) => all.find((h) => h.key === key)?.value;

  it('checks the environment before and the output after every build, and installs without package scripts', () => {
    expect(pkg.scripts.prebuild).toBe('node scripts/check-env.js');
    expect(pkg.scripts.postbuild).toBe('node scripts/check-build.js');
    expect(vercel.installCommand).toBe('npm ci --ignore-scripts');
  });

  it('pages may connect to this site only, with strict headers', () => {
    const csp = header('Content-Security-Policy');
    expect(csp).toContain("connect-src 'self';");
    expect(csp).not.toContain('supabase');
    expect(csp).not.toContain('unsafe-inline');
    expect(csp).toContain("object-src 'none'");
    expect(header('Strict-Transport-Security')).toBe('max-age=63072000; includeSubDomains');
    expect(header('Cross-Origin-Opener-Policy')).toBe('same-origin');
  });

  it('uses the business app logo files and wordmark', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public', 'manifest.json'), 'utf8'));
    expect(manifest.icons.map((i) => i.src)).toEqual(['favicon.ico', 'logo192.png', 'logo512.png']);
    const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
    expect(html).toContain('<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />');
    expect(html).toContain('<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />');
    expect(html).not.toContain('favicon.svg');
    const css = fs.readFileSync(path.join(root, 'src', 'index.css'), 'utf8');
    const mark = /\.mark \{([^}]*)\}/.exec(css)[1];
    expect(mark).toContain('font-size: 22px;');
    expect(mark).toContain('font-weight: 700;');
    expect(mark).toContain('letter-spacing: -0.01em;');
  });

  it('never sends /api/ addresses to the page', () => {
    const [rewrite] = vercel.rewrites;
    const pattern = new RegExp(`^${rewrite.source}$`);
    expect(pattern.test('/privacy')).toBe(true);
    expect(pattern.test('/api/waitlist')).toBe(false);
    expect(rewrite.destination).toBe('/index.html');
  });

  it('the pages read environment variables by literal name only and never import the server code', () => {
    const allowed = new Set(['NODE_ENV', 'PUBLIC_URL', 'REACT_APP_APP_URL', 'REACT_APP_SITE_URL']);
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
      .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
    const sources = walk(path.join(root, 'src')).filter((f) => /\.jsx?$/.test(f) && !/\.test\.jsx?$|[\\/]server[\\/]|setupTests/.test(f));
    const found = [];
    for (const file of sources) {
      const text = fs.readFileSync(file, 'utf8');
      for (const match of text.matchAll(/process\.env(\.([A-Za-z_][A-Za-z0-9_]*))?/g)) {
        if (!match[2] || !allowed.has(match[2])) found.push(`${path.relative(root, file)}: ${match[0]}`);
      }
      if (/from ['"][./]*server|require\(['"][./]*server/.test(text)) found.push(`${path.relative(root, file)} imports server code`);
    }
    expect(found).toEqual([]);
    const fn = fs.readFileSync(path.join(root, 'api', 'waitlist.js'), 'utf8');
    expect(fn).toContain("require('../src/server/waitlist')");
  });
});
