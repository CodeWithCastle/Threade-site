// Everything the site says, in one place. Plain English, no em dashes.
// Facts here must match the business app (plans.content.js, faq.content.js, legal.content.js).

const env = (key, fallback = '') => (process.env[key] ?? '').trim() || fallback;

export const APP_URL = env('REACT_APP_APP_URL', 'https://app.threade.app').replace(/\/+$/, '');
export const SIGN_UP_URL = `${APP_URL}/signup`;
export const SIGN_IN_URL = `${APP_URL}/signin`;
export const LEGAL = {
  terms: `${APP_URL}/legal/terms`,
  dpa: `${APP_URL}/legal/dpa`,
  privacy: `${APP_URL}/legal/privacy`,
};
export const TEAM_EMAIL = 'team@threade.app';
export const SUPPORT_EMAIL = 'support@threade.app';
export const PILOT_END = '30 November 2026';

// "/#..." so the links also work from /privacy (a bare "#..." would stay on that page).
export const NAV = [
  { href: '/#features', label: 'Features' },
  { href: '/#how', label: 'How it works' },
  { href: '/#plans', label: 'Plans' },
  { href: '/#faq', label: 'FAQ' },
];

export const HERO = {
  eyebrow: `Pilot open: free until ${PILOT_END}`,
  title: ['Your workshop,', 'measured to fit.'],
  lead: 'Clients, measurements, orders, production, store, payments and invoices for tailors, fashion designers and small fashion businesses. It works without internet and keeps your whole team in step.',
  primary: 'Start free',
  secondary: 'Join the waitlist',
  proof: ['Works offline', 'Installs on any phone', 'Data kept in the EU'],
};

export const AUDIENCE = ['Tailors', 'Fashion designers', 'Ateliers', 'Boutiques', 'Small shops', 'Nigeria and the UK'];

export const FEATURES = [
  {
    id: 'clients',
    title: 'Clients and measurements',
    short: 'Every client, every fitting.',
    body: 'Keep contact details, notes and photos. Take measurements by body area, head to toe, and keep a new version at every fitting so you can compare with the last one. Add your own fields when your work needs them.',
    points: ['Female and male lists, in centimetres or inches', 'Versions you can compare', 'Call or WhatsApp from the profile'],
    image: 'phone-15-measurement',
    alt: 'Measurements by body area, compared with the last fitting',
  },
  {
    id: 'orders',
    title: 'Orders and payments',
    short: 'Know who owes what.',
    body: 'Create made-to-measure orders linked to the right measurements. Take a deposit, record part payments and see the balance at a glance. Overdue and due-this-week orders come first.',
    points: ['Deposits and part payments', 'Balances on every order and client', 'Voids need a reason, nothing disappears'],
    image: 'phone-21-order-detail',
    alt: 'An order with payments, balance, production and documents',
  },
  {
    id: 'production',
    title: 'Production board',
    short: 'Cutting, sewing, fitting, ready.',
    body: 'See every open order by stage and who is working on it. Move an order to the next stage in one tap; the whole team sees it at once.',
    points: ['Assign people to each stage', 'Due dates on every card', 'Filter to your own work'],
    image: 'phone-27-production',
    alt: 'Production board with orders by stage and who does each',
  },
  {
    id: 'store',
    title: 'Store and sales',
    short: 'Ready-made items, in stock.',
    body: 'Sell ready-made items alongside your made-to-measure work. Track stock and sizes, restock, and get a warning when an item runs low. Sales staff sell at the set price; managers can discount within your limit.',
    points: ['Stock and low-stock alerts', 'Sales to clients or walk-ins', 'Price rules you control'],
    image: 'phone-31-store',
    alt: 'Store items with stock levels',
  },
  {
    id: 'documents',
    title: 'Invoices and receipts',
    short: 'Professional, in seconds.',
    body: 'Invoices, receipts and delivery slips with your business details, ready to share as a PDF or an image by WhatsApp or email. Share a link your client can open without an app.',
    points: ['PDF or image', 'Share by WhatsApp or email', 'Links that expire after 14 days'],
    image: 'phone-25-invoice',
    alt: 'An invoice ready to share',
  },
  {
    id: 'finance',
    title: 'Finance and expenses',
    short: 'See how the business is doing.',
    body: 'Sales, cash received, costs, profit, money owed and a tax estimate, by week, month or year. Record expenses and link them to orders. Download the numbers for your accountant.',
    points: ['Profit and margin', 'Expenses by category', 'CSV and PDF downloads'],
    image: 'phone-40-finance',
    alt: 'Finance: sales, cash, costs, profit and debts',
  },
  {
    id: 'team',
    title: 'Team and change log',
    short: 'Everyone in their lane.',
    body: 'Invite managers, sales staff and an accountant, each with the right access. Every change is recorded: who did it and when. The admin stays in charge of the business, backups and the team.',
    points: ['Admin, manager, sales and accountant roles', 'A change log of every action', 'Remove access in one tap'],
    image: 'phone-55-team',
    alt: 'Team with roles and a pending invite',
  },
];

export const ALWAYS = [
  { title: 'Works offline', body: 'Everything is saved on your device first. No signal in the market? Keep working; changes go up when the connection returns.' },
  { title: 'On every device', body: 'Install it on Android, iPhone, Windows or Mac from the browser. No app store, nothing to download.' },
  { title: 'In step with your team', body: 'Changes reach your team within seconds. If two people edit the same thing, the latest change wins on every device.' },
  { title: 'Locked when you step away', body: 'A 4-digit PIN locks the app after the time you choose. Recovery codes get the admin back in without email.' },
  { title: 'Your data stays yours', body: 'Download a full backup any time, on every plan. Nothing is deleted when a plan changes.' },
  { title: 'Private by design', body: 'Only your business sees your records, kept on servers in the European Union (Ireland). Threadé staff never see your clients.' },
];

export const STEPS = [
  { title: 'Create your account', body: 'Your email and a password. Confirm your email and you are in.' },
  { title: 'Set up your business', body: 'Name, address, type of business and your unit. About two minutes.' },
  { title: 'Bring your team', body: 'Invite people with a link and pick their role. They join on their own phone.' },
];

// From the app's Compare plans page (plans.content.js). Limits may change before launch.
export const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: 'Nothing to pay',
    note: 'No card needed',
    for: 'One person getting organised',
    features: ['1 person', 'Unlimited clients, orders and payments', '3 photos per client', '25 store items', '3 of your own measurement fields', 'Invoices and receipts', 'Finance for this and last month'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 'Price to be announced',
    note: 'Before the pilot ends',
    for: 'You and up to 2 helpers',
    highlight: true,
    features: ['3 people (admin and sales)', 'Assign people to stages', '12 photos per client', 'Unlimited store items and fields', 'Share links to invoices and receipts', 'No "Made with Threadé" line', 'All finance periods, CSV and PDF', 'Full change log, email support'],
  },
  {
    key: 'business',
    name: 'Business',
    price: 'Price to be announced',
    note: 'Before the pilot ends',
    for: 'Ateliers and shops with managers',
    features: ['10 people, every role', 'Managers and an accountant', 'Everything in Pro', 'Finance by staff member', 'Priority support'],
  },
];
export const IN_EVERY_PLAN = ['Works offline', 'Sync across devices', 'Install on your phone', 'App lock with PIN', 'Recovery codes', 'Backup and restore'];
export const PLANS_NOTE = `During the pilot every business has all of Business, free, until ${PILOT_END}. Before it ends you choose your plan; Free needs no payment details. Limits may change before launch.`;

// From the app's FAQ (faq.content.js), shortened where needed.
export const FAQ = [
  { q: 'What is Threadé?', a: 'An app for tailors, fashion designers and small businesses. It keeps your clients, measurements, orders, payments, store stock, expenses and invoices in one place, and shares them with your team.' },
  { q: 'Do I need to download it from an app store?', a: 'No. Open Threadé in your browser, sign in once, then add it to your home screen or dock. It gets its own icon and opens full screen.' },
  { q: 'Does it work without internet?', a: 'Yes. Everything you add is saved on your device first. When the connection comes back, your changes are sent to the server and your team sees them. Signing up, inviting people and sharing links need the internet.' },
  { q: 'Where is my data kept?', a: 'On the devices of your team and on secure servers in the European Union (Ireland). Only people in your business can see it.' },
  { q: 'Who can do what?', a: 'Admin: everything, including team, backups and deleting the business. Manager: clients, orders, store, expenses and sales staff. Sales: clients, measurements, orders and, if allowed, store sales. Accountant: orders, store (view only), finance and expenses.' },
  { q: 'Do I need my clients’ permission?', a: 'Yes. When you set up the business you confirm that you tell your clients their details are kept in Threadé and keep them only with their permission.' },
  { q: 'Can I use inches instead of centimetres?', a: 'Yes. The admin chooses the unit. Measurements are shown in the unit you choose; nothing you recorded changes.' },
  { q: 'What happens when the pilot ends?', a: `The pilot is free until ${PILOT_END}. Before then you choose Free, Pro or Business. Free needs no payment details; nothing you recorded is deleted on any plan.` },
  { q: 'How do I back up my data?', a: 'The admin downloads one file with everything, any time, on every plan. Restoring asks for the admin’s password.' },
];

export const WAITLIST = {
  title: 'Not ready yet? Join the waitlist.',
  lead: 'Leave your email and we will tell you when Threadé opens to everyone, with prices and a launch offer. No spam, ever.',
  consent: 'We use your details only to tell you about Threadé.',
  done: 'You are on the list. We will email you when Threadé opens to everyone.',
};

export const COUNTRIES = [
  { value: 'NG', label: 'Nigeria' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'OTHER', label: 'Somewhere else' },
];

export const FOOTER = {
  line: 'Threadé is provided by Dan Aremu, a sole trader trading as Threadé.',
};
