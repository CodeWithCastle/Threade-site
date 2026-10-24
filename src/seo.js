// What goes in each page's <head>: title, description, canonical address and structured data.
// Pure functions, used by scripts/prerender.js at build time and by the tests.
// Structured data says only what is true today: no ratings, no prices that are not public.
import { FAQ, SITE_URL, SUPPORT_EMAIL, TEAM_EMAIL } from './content';
import { guideBySlug } from './guides';
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
  operatingSystem: 'Web browser, Android, iOS, Windows, macOS',
  description: PAGES[0].description,
  image: `${SITE_URL}/og-image.png`,
  publisher: { '@id': ORG_ID },
  offers: { '@type': 'Offer', name: 'Free plan', price: '0', priceCurrency: 'USD' },
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

const faqPage = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

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
  const graph = [organization(), website()];
  if (page.kind === 'home') graph.push(application(), faqPage(FAQ));
  if (page.kind === 'pricing') graph.push(application());
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
