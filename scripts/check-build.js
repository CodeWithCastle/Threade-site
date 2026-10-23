// Runs after every build: fails when the output breaks the site's rules.
const fs = require('fs');
const path = require('path');
const { leakedIn, readEnvFiles, secretValues, supabaseIn } = require('./env-rules');

const build = path.join(__dirname, '..', 'build');
const problems = [];
const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) problems.push('index.html has an inline script (the CSP forbids it).');
if (/style="|<style[\s>]/i.test(html)) problems.push('index.html has an inline style (the CSP forbids it).');
if (/%REACT_APP_[A-Z_]+%/.test(html)) problems.push('index.html has an unfilled %REACT_APP_...% value (set it in .env or on Vercel).');
if (!/<meta property="og:image" content="https:\/\/[^"]+"/.test(html)) problems.push('og:image must be a full https address (REACT_APP_SITE_URL).');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
// The value of any variable that is not public (build environment and .env files, 12 characters or
// more, including the server-only Supabase address and key) must not be in any file. In memory; names only.
const secrets = secretValues(process.env, readEnvFiles(path.join(__dirname, '..')));
for (const file of walk(build)) {
  const name = path.relative(build, file);
  if (file.endsWith('.map')) problems.push(`Source map in the build: ${name}`);
  for (const leaked of leakedIn(fs.readFileSync(file), secrets)) problems.push(`The value of ${leaked} is in the build: ${name}. Only public values may reach the pages.`);
  if (/\.(js|html|css|json|txt)$/.test(file)) {
    const text = fs.readFileSync(file, 'utf8');
    if (/service_role|SERVICE_ROLE|sb_secret_/.test(text)) problems.push(`Secret key name in ${name}`);
    if (/https?:\/\/(fonts\.googleapis|fonts\.gstatic|www\.googletagmanager)/.test(text)) problems.push(`Third-party asset in ${name}`);
    // The pages never talk to Supabase: the waitlist goes through api/waitlist.js on this site.
    for (const what of supabaseIn(text)) problems.push(`${what} in ${name}. The website ships no Supabase address or key.`);
  }
}

if (problems.length) {
  console.error(`Build check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('Build check passed: no inline scripts or styles, no source maps, no secret keys or private values, no Supabase address or key, no third-party assets.');
