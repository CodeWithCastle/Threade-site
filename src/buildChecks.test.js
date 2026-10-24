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

  // Vercel adds these for Create React App projects (System Environment Variables). The builds of
  // 2026-10-24 failed on them; www.threade.app is in every page, so it must not count as a secret.
  it("allows Vercel's own REACT_APP_VERCEL_ details, but not one that looks like a secret", () => {
    const vercel = { REACT_APP_VERCEL_ENV: 'production', REACT_APP_VERCEL_URL: 'x-abc123-team.vercel.app', REACT_APP_VERCEL_PROJECT_PRODUCTION_URL: 'www.threade.app', REACT_APP_VERCEL_GIT_COMMIT_MESSAGE: 'Merge development into main', REACT_APP_VERCEL_GIT_COMMIT_SHA: '6440ce919889f153fe31a533cc91b3c30b5f9fcb' };
    expect(checkEnvironment(vercel, committed).problems).toEqual([]);
    expect(secretValues(vercel, committed)).toEqual([]);
    const { problems } = checkEnvironment({ REACT_APP_VERCEL_OIDC_TOKEN: FAKE_SECRET }, committed);
    expect(problems).toEqual([expect.stringContaining('REACT_APP_VERCEL_OIDC_TOKEN')]);
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
    expect(pkg.scripts.postbuild).toBe('node scripts/prerender.js && node scripts/check-build.js');
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

  it('serves each prerendered page at its clean address and unknown addresses as a real 404', () => {
    // No catch-all rewrite: /features is build/features.html, anything else is build/404.html
    // with a 404 status, so search engines never index a copy of the home page.
    expect(vercel.rewrites).toBeUndefined();
    expect(vercel.cleanUrls).toBe(true);
    expect(vercel.trailingSlash).toBe(false);
    // Hashed build files never change, so browsers may keep them for a year.
    expect(vercel.headers.find((h) => h.source === '/static/(.*)').headers[0].value).toBe('public, max-age=31536000, immutable');
  });

  it('robots.txt opens the pages to search engines and AI assistants, keeps /api/ out, and names the sitemap', () => {
    const robots = fs.readFileSync(path.join(root, 'public', 'robots.txt'), 'utf8');
    expect(robots).toMatch(/User-agent: \*\nAllow: \/\nDisallow: \/api\//);
    // Founder decision 2026-10-24: search, user-triggered and training crawlers are all welcome.
    const named = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'Googlebot', 'Google-Extended', 'Bingbot', 'PerplexityBot', 'CCBot'];
    named.forEach((bot) => expect(robots).toContain(`User-agent: ${bot}\n`));
    expect(robots).toMatch(/User-agent: CCBot\nAllow: \/\nDisallow: \/api\//);
    expect(robots).toContain('Sitemap: https://www.threade.app/sitemap.xml');
    expect(robots).not.toMatch(/Disallow: \/\s*$/m);
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
