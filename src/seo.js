// What goes in each page's <head>: title, description, canonical address and structured data.
// Pure functions, used by scripts/prerender.js at build time and by the tests.
// Structured data says only what is true today: no ratings, no prices that are not public.
import { ALL_QUESTIONS, FAQ_SECTIONS, FIT, KEY_FACTS } from './answers';
import { COUNTRIES_SERVED, FEATURES, PLAN_SECTIONS, PLANS, PLANS_NOTE, SEGMENTS, SITE_URL, SUPPORT_EMAIL, TEAM_EMAIL, WORKFLOW } from './content';
import { GUIDES, guideBySlug } from './guides';
import { PAGES } from './pages';

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const APP_ID = `${SITE_URL}/#app`;

export const canonicalFor = (page) => (page.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${page.path}`);

const organization = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Threadé',
  alternateName: 'Threade',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo512.png`,
  email: TEAM_EMAIL,
  description: 'Threadé makes an app that runs tailoring and fashion businesses, and shops and trading businesses of every kind.',
  knowsAbout: ['Small business management', 'Tailoring business management', 'Client measurements', 'Made-to-measure orders', 'Fashion production', 'Retail stock control'],
  founder: { '@type': 'Person', name: 'Dan Aremu' },
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: SUPPORT_EMAIL, availableLanguage: 'English' }],
});

const website = () => ({ '@type': 'WebSite', '@id': SITE_ID, name: 'Threadé', alternateName: 'Threade', url: `${SITE_URL}/`, publisher: { '@id': ORG_ID }, inLanguage: 'en' });

// The Free plan is the only public price: it costs nothing. Pro and Business are not priced yet.
const application = () => ({
  '@type': 'SoftwareApplication',
  '@id': APP_ID,
  name: 'Threadé',
  alternateName: 'Threade',
  url: `${SITE_URL}/`,
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Small business, tailoring and fashion business management',
  operatingSystem: 'Web browser, Android, iOS, Windows, macOS',
  description: PAGES[0].description,
  image: `${SITE_URL}/og-image.png`,
  screenshot: FEATURES.map((f) => `${SITE_URL}/shots/${f.image}@2x.webp`),
  featureList: FEATURES.map((f) => `${f.title}: ${f.short}`).concat(['Works offline', 'Installs from the browser', 'Backup and restore']),
  audience: { '@type': 'BusinessAudience', audienceType: 'Tailors, fashion designers and ateliers, and shops and traders of any kind, such as perfume sellers, cake makers, salons and boutiques' },
  areaServed: COUNTRIES_SERVED.map((c) => ({ '@type': 'Country', name: c.replace(/^the /, '') })),
  inLanguage: 'en',
  isAccessibleForFree: true,
  softwareHelp: { '@type': 'CreativeWork', url: `${SITE_URL}/faq` },
  publisher: { '@id': ORG_ID },
  offers: { '@type': 'Offer', name: 'Free plan', price: '0', priceCurrency: 'USD' },
});

// Each page says what it is, which site it belongs to and that it is about the app.
const webPage = (page) => ({
  '@type': page.kind === 'faq' ? 'FAQPage' : page.kind === 'about' ? 'AboutPage' : 'WebPage',
  '@id': `${canonicalFor(page)}#page`,
  url: canonicalFor(page),
  name: page.title,
  description: page.description,
  isPartOf: { '@id': SITE_ID },
  about: { '@id': APP_ID },
  dateModified: page.updated,
  inLanguage: 'en',
  ...(page.kind === 'faq'
    ? { mainEntity: ALL_QUESTIONS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    : {}),
});

const breadcrumbs = (page) => {
  const items = [{ name: 'Home', path: '/' }];
  if (page.kind === 'guide') items.push({ name: 'Guides', path: '/guides' });
  items.push({ name: page.crumb, path: page.path });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: canonicalFor(item) })),
  };
};

const article = (page) => {
  const guide = guideBySlug(page.guide);
  return {
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published,
    dateModified: guide.updated,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    image: `${SITE_URL}/og-image.png`,
    mainEntityOfPage: canonicalFor(page),
    inLanguage: 'en',
  };
};

/** The structured data for a page, as one @graph object (or null). */
export function structuredData(page) {
  if (page.noindex) return null;
  // The app is described once per page so every page tells an assistant what Threadé is.
  const graph = [organization(), website(), application(), webPage(page)];
  if (page.kind === 'guide') graph.push(article(page));
  if (page.kind !== 'home') graph.push(breadcrumbs(page));
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** JSON for a <script type="application/ld+json"> block: "<" escaped so text can never close the tag. */
export const jsonLdText = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

export function headFor(page) {
  return {
    title: page.title,
    description: page.description,
    canonical: page.noindex ? null : canonicalFor(page),
    robots: page.noindex ? 'noindex' : 'index, follow, max-image-preview:large',
    ogType: page.kind === 'guide' ? 'article' : 'website',
    jsonLd: structuredData(page),
  };
}

/** sitemap.xml for every indexable page. */
export function sitemapXml(pages = PAGES) {
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => `  <url>\n    <loc>${canonicalFor(p)}</loc>${p.updated ? `\n    <lastmod>${p.updated}</lastmod>` : ''}\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// llms.txt (https://llmstxt.org): a short map of the site for AI assistants, and llms-full.txt
// with everything they need to describe Threadé accurately. Built from the same content as
// the pages, so they never disagree. Neither guarantees that an assistant uses them.
const url = (path) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);
const linkLine = (path) => {
  const page = PAGES.find((p) => p.path === path);
  return `- [${page.crumb ?? 'Home'}](${url(path)}): ${page.description}`;
};

export function llmsTxt() {
  const facts = KEY_FACTS.map((f) => `- ${f.label}: ${f.value}`).join('\n');
  const pages = PAGES.filter((p) => p.kind !== 'guide' && p.kind !== 'privacy').map((p) => linkLine(p.path)).join('\n');
  const guides = GUIDES.map((g) => `- [${g.title}](${url(`/guides/${g.slug}`)}): ${g.short}`).join('\n');
  return `# Threadé

> Threadé (also written Threade) is an app for tailors and fashion designers, and for shops and traders of any kind, such as perfume sellers, cake makers and salons. It keeps clients or customers, measurements where they apply, orders, production, payments, store stock, invoices, expenses and finance in one place, shared with the team, and works offline.

${facts}

## Good fit

${FIT.bestFor.map((x) => `- ${x}`).join('\n')}

## Not what it does today

${FIT.notFor.map((x) => `- ${x}`).join('\n')}

## Pages

${pages}

## Guides

${guides}

## Optional

- [Everything on one page](${SITE_URL}/llms-full.txt): every feature, plan and answer in plain text
`;
}

const valueText = (v) => (v === true ? 'yes' : v === false ? 'no' : v);

export function llmsFullTxt() {
  const parts = [llmsTxt().replace(/\n## Optional[\s\S]*$/, '').trim()];
  parts.push(`## Features\n\n${FEATURES.map((f) => `### ${f.title}\n\n${f.body}\n\n${f.points.map((p) => `- ${p}`).join('\n')}\n\nMore: ${url(`/features#${f.id}`)}`).join('\n\n')}`);
  parts.push(`## How an order moves through Threadé\n\n${WORKFLOW.steps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join('\n')}`);
  parts.push(`## Who it is for\n\n${Object.values(SEGMENTS).map((s) => `### ${s.kicker}\n\n${s.lead}\n\n${s.problems.map((p) => `- ${p.title}: ${p.body}`).join('\n')}\n\nMore: ${url(s.path)}`).join('\n\n')}`);
  const rows = PLAN_SECTIONS.flatMap((sec) => sec.rows.map((r) => `| ${r.label} | ${PLANS.map((p) => valueText(r.values[p.key])).join(' | ')} |`));
  parts.push(`## Plans and pricing\n\n${PLANS.map((p) => `- ${p.name}: ${p.price}. ${p.for}.`).join('\n')}\n\n${PLANS_NOTE}\n\n| Feature | ${PLANS.map((p) => p.name).join(' | ')} |\n|---|${PLANS.map(() => '---').join('|')}|\n${rows.join('\n')}`);
  parts.push(`## Questions and answers\n\n${FAQ_SECTIONS.map((sec) => `### ${sec.title}\n\n${sec.items.map((i) => `Q: ${i.q}\nA: ${i.a}${i.steps ? `\n${i.steps.map((st) => `- ${st}`).join('\n')}` : ''}`).join('\n\n')}`).join('\n\n')}`);
  parts.push(`## Guides\n\n${GUIDES.map((g) => `### ${g.title}\n\n${g.blocks.map((b) => b.h ? `#### ${b.h}` : b.list ? b.list.map((x) => `- ${x}`).join('\n') : b.p).join('\n\n')}\n\n${g.threade.title}: ${g.threade.body}`).join('\n\n')}`);
  return `${parts.join('\n\n')}\n`;
}

