// Every public page: its address, title, description and date. The prerender script
// (scripts/prerender.js) writes one HTML file per page from this list, and the sitemap
// comes from it too. Titles stay under about 60 characters, descriptions under about 160.
import { GUIDES } from './guides';
import { SEGMENTS } from './content';

const page = (path, kind, title, description, updated, extra = {}) => ({ path, kind, title, description, updated, ...extra });

export const PAGES = [
  page(
    '/',
    'home',
    'Threadé: run your whole business from one app',
    'Customers, orders, payments, stock, invoices and your team in one app. For shops and traders of every kind, and for tailors. Works offline. Free during the pilot.',
    '2026-10-29'
  ),
  page(
    '/features',
    'features',
    'Threadé features: customers, orders, stock and invoices',
    'Every Threadé feature: customers, orders and payments, stock, invoices, finance, team roles and a change log, plus measurements and production for made-to-measure work.',
    '2026-10-29',
    { crumb: 'Features' }
  ),
  page(
    SEGMENTS.tailors.path,
    'segment',
    'Tailor app for measurements, orders and payments | Threadé',
    'A tailoring app for your phone: client measurements by body area with every fitting kept, deposits and balances, and invoices by WhatsApp. Works offline.',
    '2026-10-24',
    { segment: 'tailors', crumb: 'Tailors' }
  ),
  page(
    SEGMENTS['fashion-designers'].path,
    'segment',
    'Fashion business and atelier management app | Threadé',
    'Manage your fashion business and team: a production board by stage, roles for managers, sales and accountants, a change log, store stock and finance.',
    '2026-10-24',
    { segment: 'fashion-designers', crumb: 'Fashion designers and ateliers' }
  ),
  page(
    SEGMENTS.boutiques.path,
    'segment',
    'Boutique and shop sales and stock app | Threadé',
    'Sales, stock and client records for boutiques: low-stock warnings, sales to clients or walk-ins, price rules, receipts by WhatsApp, and what sells.',
    '2026-10-24',
    { segment: 'boutiques', crumb: 'Boutiques' }
  ),
  page(
    SEGMENTS['small-business'].path,
    'segment',
    'App for shops and traders: sales, stock and records | Threadé',
    'An app for shops and traders of any kind, from perfume sellers to cake makers: customers, sales, stock, receipts, expenses and profit. Works offline on any device.',
    '2026-10-29',
    { segment: 'small-business', crumb: 'Shops and traders' }
  ),
  page(
    '/pricing',
    'pricing',
    'Threadé pricing: Free, Starter, Pro and Business',
    'Compare the four Threadé plans: Free for one person, Starter for three, Pro for six, Business for twelve. All of Business is free during the pilot.',
    '2026-10-29',
    { crumb: 'Pricing' }
  ),
  page(
    '/faq',
    'faq',
    'Threadé FAQ: questions about the app, answered',
    'Every question about Threadé answered: what it is, who it is for, price, countries, offline use, orders and payments, stock, invoices, team roles, data and backups.',
    '2026-10-29',
    { crumb: 'FAQ' }
  ),
  page(
    '/about',
    'about',
    'About Threadé: who we are and why we built it',
    'Threadé brings a small business’s clients or customers, orders, stock and payments into one app, for tailors and for shops and traders alike. Who provides it.',
    '2026-10-29',
    { crumb: 'About' }
  ),
  page(
    '/guides',
    'guides',
    'Guides for running a small shop or workshop | Threadé',
    'Practical guides: stock and prices, deposits and balances, cake and food orders, measurements, production with a team, and choosing an app.',
    '2026-10-29',
    { crumb: 'Guides' }
  ),
  ...GUIDES.map((g) =>
    page(`/guides/${g.slug}`, 'guide', g.title.length > 48 ? g.title : `${g.title} | Threadé`, g.description, g.updated, { guide: g.slug, crumb: g.title, published: g.published })
  ),
  page(
    '/privacy',
    'privacy',
    'Website privacy | Threadé',
    'How the Threadé website uses the details you give on the waitlist form. No cookies, no analytics, no adverts.',
    '2026-10-15',
    { crumb: 'Website privacy' }
  ),
];

// Shown for any other address, with a 404 status (build/404.html). Not in the sitemap.
export const NOT_FOUND = page('/404', 'notFound', 'Page not found | Threadé', 'This page does not exist. Go to the Threadé home page.', null, { noindex: true });

const clean = (path) => (path.replace(/\/+$/, '') || '/').toLowerCase();

/** The page for an address, ignoring a trailing slash; NOT_FOUND when there is none. */
export const pageFor = (path = '/') => PAGES.find((p) => p.path === clean(path)) ?? NOT_FOUND;
