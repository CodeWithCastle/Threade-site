// Runs after every build: fails when the output breaks the site's rules.
const fs = require('fs');
const path = require('path');

const build = path.join(__dirname, '..', 'build');
const problems = [];
const html = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) problems.push('index.html has an inline script (the CSP forbids it).');
if (/style="/i.test(html)) problems.push('index.html has an inline style attribute (the CSP forbids it).');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
for (const file of walk(build)) {
  if (file.endsWith('.map')) problems.push(`Source map in the build: ${path.relative(build, file)}`);
  if (/\.(js|html|css)$/.test(file)) {
    const text = fs.readFileSync(file, 'utf8');
    if (/service_role|SERVICE_ROLE|sb_secret_/.test(text)) problems.push(`Secret key name in ${path.relative(build, file)}`);
    if (/https?:\/\/(fonts\.googleapis|fonts\.gstatic|www\.googletagmanager)/.test(text)) problems.push(`Third-party asset in ${path.relative(build, file)}`);
  }
}

if (problems.length) {
  console.error(`Build check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('Build check passed: no inline scripts or styles, no source maps, no secret keys, no third-party assets.');
