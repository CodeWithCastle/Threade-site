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
    'Threadé: tailoring app for clients, measurements and orders',
    'Run your tailoring or fashion business from one app: clients, measurements, orders, production, payments, stock and invoices. Works offline. Free during the pilot.',
    '2026-10-24'
  ),
  page(
    '/features',
    'features',
    'Threadé features: measurements, orders, stock and invoices',
    'Every Threadé feature: versioned client measurements, orders and payments, a production board, store stock, invoices and receipts, finance, team roles and a change log.',
    '2026-10-24',
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
    'Boutique sales and stock app for fashion shops | Threadé',
    'Sales, stock and client records for boutiques: low-stock warnings, sales to clients or walk-ins, price rules, receipts by WhatsApp, and what sells.',
    '2026-10-24',
    { segment: 'boutiques', crumb: 'Boutiques' }
  ),
  page(
    SEGMENTS['small-business'].path,
    'segment',
    'Sales, stock and records app for small shops | Threadé',
    'A simple app for small shops: customer records, sales, stock, receipts, expenses and profit, with roles for your team. Works offline on any device.',
    '2026-10-24',
    { segment: 'small-business', crumb: 'Small shops' }
  ),
  page(
    '/pricing',
    'pricing',
    'Threadé pricing: Free, Pro and Business plans',
    'Compare the Threadé plans: Free for one person, Pro for you and up to 2 helpers, Business for teams of 10. Every business has all of Business free during the pilot.',
    '2026-10-24',
    { crumb: 'Pricing' }
  ),
  page(
    '/about',
    'about',
    'About Threadé: who we are and why we built it',
    'Threadé brings a tailoring or fashion business’s clients, measurements, orders and payments into one app. Who provides it, where data is kept and how to reach us.',
    '2026-10-24',
    { crumb: 'About' }
  ),
  page(
    '/guides',
    'guides',
    'Guides for running a tailoring or fashion business | Threadé',
    'Practical guides for tailors, fashion designers and shop owners: measurements, deposits and balances, production with a team, and stock control.',
    '2026-10-24',
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
