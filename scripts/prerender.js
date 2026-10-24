// Runs after `react-scripts build` (postbuild, before check-build): writes every public page in
// src/pages.js as its own HTML file with the page already rendered, so search engines and AI
// search crawlers read the content without running JavaScript. React then attaches to it
// (src/index.js). Also writes 404.html and sitemap.xml.
//
// Vercel serves /features from build/features.html ("cleanUrls" in vercel.json) and any
// unknown address with build/404.html and a 404 status.
const fs = require('fs');
const path = require('path');
const Module = require('module');

process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production'; // Same JSX runtime as the production bundle; Babel turns imports into require for Node
// The same .env files the build used, so links and addresses match the browser bundle exactly.
require('react-scripts/config/env');

const root = path.join(__dirname, '..');
const src = path.join(root, 'src');
const build = path.join(root, 'build');

// Compile src/*.js(x) on the fly with the same Babel preset Create React App uses.
const babel = require('@babel/core');
const compile = (module, filename) => {
  const { code } = babel.transformFileSync(filename, {
    babelrc: false,
    configFile: false,
    presets: [[require.resolve('babel-preset-react-app'), { runtime: 'automatic' }]],
  });
  module._compile(code, filename);
};
const plainJs = Module._extensions['.js'];
Module._extensions['.jsx'] = compile;
Module._extensions['.js'] = (module, filename) => (filename.startsWith(src) ? compile(module, filename) : plainJs(module, filename));
Module._extensions['.css'] = () => {};

const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require(path.join(src, 'App.jsx')).default;
const { PAGES, NOT_FOUND } = require(path.join(src, 'pages.js'));
const { headFor, jsonLdText, sitemapXml } = require(path.join(src, 'seo.js'));

const escapeAttr = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const template = fs.readFileSync(path.join(build, 'index.html'), 'utf8');

function replaceOnce(html, pattern, value, what) {
  if (!pattern.test(html)) throw new Error(`prerender: ${what} not found in build/index.html`);
  return html.replace(pattern, value);
}

function pageHtml(page) {
  const head = headFor(page);
  // StrictMode as in src/index.js, so the markup (and useId values) match on hydration.
  let body = renderToString(React.createElement(React.StrictMode, null, React.createElement(App, { path: page.path })));
  // React puts image preloads at the start of the markup; they belong in <head>, and the
  // root must hold exactly what the browser renders.
  const preloads = body.match(/^(?:<link [^>]*\/>)+/)?.[0] ?? '';
  body = body.slice(preloads.length);
  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeText(head.title)}</title>`, 'title');
  html = replaceOnce(html, /<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttr(head.description)}"/>`, 'description');
  html = replaceOnce(html, /<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeAttr(head.title)}"/>`, 'og:title');
  html = replaceOnce(html, /<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeAttr(head.description)}"/>`, 'og:description');
  html = replaceOnce(html, /<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${head.ogType}"/>`, 'og:type');
  const extra = [`<meta name="robots" content="${head.robots}"/>`, preloads];
  if (head.canonical) {
    html = replaceOnce(html, /<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeAttr(head.canonical)}"/>`, 'og:url');
    extra.push(`<link rel="canonical" href="${escapeAttr(head.canonical)}"/>`);
  } else {
    html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, '');
  }
  // Structured data is a data block, not a script the browser runs (the CSP allows it).
  if (head.jsonLd) extra.push(`<script type="application/ld+json">${jsonLdText(head.jsonLd)}</script>`);
  html = replaceOnce(html, /<\/head>/, `${extra.join('')}</head>`, '</head>');
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`, 'root element');
  // The page is in the HTML now: the "needs JavaScript" note would be wrong.
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, '');
  return html;
}

const fileFor = (page) => (page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`);

const written = [];
for (const page of [...PAGES, NOT_FOUND]) {
  const file = path.join(build, page === NOT_FOUND ? '404.html' : fileFor(page));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, pageHtml(page));
  written.push(path.relative(build, file));
}
fs.writeFileSync(path.join(build, 'sitemap.xml'), sitemapXml());
written.push('sitemap.xml');
console.log(`Prerendered ${written.length - 1} pages and the sitemap: ${written.join(', ')}`);
