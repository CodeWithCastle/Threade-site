// Everything the site says, in one place. Plain English, no em dashes.
// Facts here must match the business app (plans.content.js, faq.content.js, legal.content.js).

// Literal name only: Create React App then bundles this value and nothing else.
export const APP_URL = ((process.env.REACT_APP_APP_URL ?? '').trim() || 'https://app.threade.app').replace(/\/+$/, '');
export const SIGN_UP_URL = `${APP_URL}/signup`;
export const SIGN_IN_URL = `${APP_URL}/signin`;
export const LEGAL = {
  terms: `${APP_URL}/legal/terms`,
  dpa: `${APP_URL}/legal/dpa`,
  privacy: `${APP_URL}/legal/privacy`,
};
// The site's own address (canonical links, sitemap, structured data). www is the main domain;
// threade.app redirects to it.
export const SITE_URL = ((process.env.REACT_APP_SITE_URL ?? '').trim() || 'https://www.threade.app').replace(/\/+$/, '');
export const TEAM_EMAIL = 'team@threade.app';
export const SUPPORT_EMAIL = 'support@threade.app';
export const PILOT_END = '30 November 2026';

// Full paths ("/#...") so the links work from every page.
export const NAV = [
  { href: '/features', label: 'Features' },
  { href: '/#workflow', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/guides', label: 'Guides' },
  { href: '/faq', label: 'FAQ' },
];

export const HERO = {
  eyebrow: `Pilot open: free until ${PILOT_END}`,
  title: ['Run your shop or business', 'from one app.'],
  lead: 'Threadé keeps your clients or customers, orders, payments, stock and invoices in one place, shared with your team. Built for tailors and fashion designers, and for shops and traders of every kind, from perfume sellers to cake makers. It works without internet, on any phone or laptop.',
  primary: 'Start free',
  secondary: 'See how it works',
  proof: ['Works offline', 'Installs on any phone', 'Data kept in the EU'],
};

// The countries offered at sign-up in the app (shared/constants/countries.js). Each business
// works in its own currency.
export const COUNTRIES_SERVED = ['Nigeria', 'the United Kingdom', 'Ghana', 'Kenya', 'South Africa', 'Ireland', 'Canada', 'the United States'];

// Who Threadé is for. Each has its own page (src/pages.js).
export const AUDIENCE = [
  { href: '/tailors', label: 'Tailors' },
  { href: '/fashion-designers', label: 'Fashion designers and ateliers' },
  { href: '/boutiques', label: 'Boutiques' },
  { href: '/small-business', label: 'Shops and traders' },
];

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
    body: 'Sell ready-made items alongside your made-to-measure work. Track stock and sizes, restock, and get a warning when an item runs low. Sales team members sell at the set price; managers can discount within your limit.',
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
    body: 'Invite managers, sales team members and an accountant, each with the right access. Every change is recorded: who did it and when. The admin stays in charge of the business, backups and the team.',
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
    features: ['10 people, every role', 'Managers and an accountant', 'Everything in Pro', 'Finance by team member', 'Priority support'],
  },
];
export const IN_EVERY_PLAN = ['Works offline', 'Sync across devices', 'Install on your phone', 'App lock with PIN', 'Recovery codes', 'Backup and restore'];
export const PLANS_NOTE = `During the pilot every business has all of Business, free, until ${PILOT_END}. Before it ends you choose your plan; Free needs no payment details. Limits may change before launch.`;

// From the app's FAQ (faq.content.js), shortened where needed.
export const FAQ = [
  { q: 'What is Threadé?', a: 'An app for running a small or medium business: tailors and fashion designers, and shops and traders selling goods or services, such as perfume sellers, cake makers, salons and boutiques. It keeps your clients or customers, orders, payments, store stock, expenses and invoices in one place, and shares them with your team.' },
  { q: 'Do I need to download it from an app store?', a: 'No. Open Threadé in your browser, sign in once, then add it to your home screen or dock. It gets its own icon and opens full screen.' },
  { q: 'Does it work without internet?', a: 'Yes. Everything you add is saved on your device first. When the connection comes back, your changes are sent to the server and your team sees them. Signing up, inviting people and sharing links need the internet.' },
  { q: 'Where is my data kept?', a: 'On the devices of your team and on secure servers in the European Union (Ireland). Only people in your business can see it.' },
  { q: 'Who can do what?', a: 'Admin: everything, including team, backups and deleting the business. Manager: clients, orders, store, expenses and sales team members. Sales: clients, measurements, orders and, if allowed, store sales. Accountant: orders, store (view only), finance and expenses.' },
  { q: 'Do I need my clients’ permission?', a: 'Yes. When you set up the business you confirm that you tell your clients their details are kept in Threadé and keep them only with their permission.' },
  { q: 'Can I use inches instead of centimetres?', a: 'Yes. The admin chooses the unit. Measurements are shown in the unit you choose; nothing you recorded changes.' },
  { q: 'What happens when the pilot ends?', a: `The pilot is free until ${PILOT_END}. Before then you choose Free, Pro or Business. Free needs no payment details; nothing you recorded is deleted on any plan.` },
  { q: 'How do I back up my data?', a: 'The admin downloads one file with everything, any time, on every plan. Restoring asks for the admin’s password.' },
  { q: 'Which countries can use Threadé?', a: `Businesses in ${COUNTRIES_SERVED.slice(0, -1).join(', ')} and ${COUNTRIES_SERVED[COUNTRIES_SERVED.length - 1]}. Each business works in its own currency.` },
  { q: 'Is Threadé only for tailors?', a: 'No. Tailors and fashion designers get measurements and made-to-measure orders. Every other business, from a perfume seller to a cake maker to a trader, chooses Shop or trader at sign-up and gets customers, store sales, stock, receipts, expenses and finance, without the measurement screens. Both are built in from the start, not one added on top of the other.' },
  { q: 'Is there a demo?', a: 'Not yet. During the pilot you can start free and try everything with your own records; nothing to pay and no card needed.' },
];

export const WAITLIST = {
  title: 'Not ready yet? Join the waitlist.',
  lead: 'Leave your email and we will tell you when Threadé opens to everyone, with prices and a launch offer. No spam, ever.',
  consent: 'We use your details only to tell you about Threadé.',
  done: 'You are on the list. We will email you when Threadé opens to everyone.',
  already: 'You are already on the list. We will email you when Threadé opens to everyone.',
};

export const COUNTRIES = [
  { value: 'NG', label: 'Nigeria' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'OTHER', label: 'Somewhere else' },
];

export const FOOTER = {
  line: 'Threadé is provided by Dan Aremu, a sole trader trading as Threadé.',
};

// "How it works": one made-to-measure order from start to finish. Each step names a real feature.
export const WORKFLOW = {
  kicker: 'How it works',
  title: 'One order, from first fitting to delivery.',
  lead: 'Here is how a typical made-to-measure order moves through Threadé. Every step is a screen in the app today.',
  steps: [
    { title: 'A client comes in', body: 'Add them with their phone number, notes and, with their permission, photos. Take their measurements by body area, head to toe.', link: '/features#clients', linkText: 'See clients and measurements' },
    { title: 'You agree the order', body: 'Record the garment, the delivery date and the price, linked to the measurements you just took. Take a deposit and send the invoice by WhatsApp.', link: '/features#orders', linkText: 'See orders and payments' },
    { title: 'The team makes it', body: 'The order joins the production board: cutting, sewing, fitting, ready. Each person sees what is theirs and moves it on with one tap.', link: '/features#production', linkText: 'See the production board' },
    { title: 'Fitting and changes', body: 'Take new measurements at the fitting. They are saved as a new version, so the order keeps the measurements it was made with.', link: '/features#clients', linkText: 'See measurement versions' },
    { title: 'Paid and delivered', body: 'Record each part payment. The balance updates at once, the client gets a receipt, and a delivery slip goes with the garment.', link: '/features#documents', linkText: 'See invoices and receipts' },
    { title: 'You see the numbers', body: 'Sales, cash received, costs, profit and money owed, by week, month or year, ready for your accountant.', link: '/features#finance', linkText: 'See finance' },
  ],
};

// The audience pages. Facts only: every point is a feature the app has today.
export const SEGMENTS = {
  tailors: {
    path: '/tailors',
    kicker: 'For tailors',
    title: 'The tailor app for measurements, orders and payments.',
    lead: 'Stop searching notebooks and old WhatsApp chats for a client’s measurements. Threadé keeps every client, every fitting and every balance in one place on your phone.',
    card: 'Measurements, orders and balances for independent tailors.',
    problems: [
      { title: 'Measurements you can find in seconds', body: 'Each client has a profile with their measurements by body area. Every fitting is saved as a new version, so you can compare with the last one and returning clients never start from zero.' },
      { title: 'Deposits and balances you do not have to remember', body: 'Record a deposit and every part payment. Each order and each client shows what is still owed, and overdue orders come first.' },
      { title: 'Invoices and receipts your clients can open', body: 'Send an invoice or receipt with your business details as a PDF or an image by WhatsApp or email.' },
      { title: 'Work through power cuts and bad signal', body: 'Everything is saved on your phone first. Keep working offline; your changes go up when the connection returns.' },
      { title: 'Your own measurement fields', body: 'Use the female and male lists, in centimetres or inches, and add your own fields when your work needs them.' },
      { title: 'Room to grow', body: 'When you take on an apprentice or a helper, invite them with their own sign-in and role on Pro or Business. They work on their own phone, from the same records.' },
    ],
    image: 'phone-15-measurement',
    alt: 'Measurements by body area, compared with the last fitting',
    features: ['clients', 'orders', 'documents'],
  },
  'fashion-designers': {
    path: '/fashion-designers',
    kicker: 'For fashion designers and ateliers',
    title: 'Run your fashion business and your team in one app.',
    lead: 'When more than one person works on a garment, everyone needs to know what stage it is at and who has it next. Threadé gives your atelier one board, one set of records and the right access for each person.',
    card: 'A production board, roles and finance for teams.',
    problems: [
      { title: 'A production board for every order', body: 'See every open order by stage: cutting, sewing, fitting, ready. Move orders on with one tap and the whole team sees it within seconds. On Pro and Business, assign people to each stage.' },
      { title: 'The right access for each person', body: 'Invite managers, sales team members and an accountant. Each role sees and does only what it should, and you can remove access in one tap.' },
      { title: 'A record of every change', body: 'The change log shows who did what and when, so questions about a price or a payment have a clear answer.' },
      { title: 'Made-to-measure and ready-to-wear together', body: 'Sell ready-made pieces from your store alongside custom orders, with stock levels and low-stock warnings.' },
      { title: 'Finance you can act on', body: 'Sales, cash received, costs, profit and money owed by week, month or year. On Business, see sales by team member. Download CSV and PDF for your accountant.' },
      { title: 'Client history the whole team can use', body: 'Measurement versions, notes, preferences, photos and past orders on every client profile.' },
    ],
    image: 'phone-27-production',
    alt: 'Production board with orders by stage and who does each',
    features: ['production', 'team', 'finance'],
  },
  boutiques: {
    path: '/boutiques',
    kicker: 'For boutiques and shops',
    title: 'Sales and stock for your boutique, with clients you remember.',
    lead: 'Track what is on the rail, sell to clients or walk-ins, and see what sells. Threadé keeps your stock, sales, receipts and client records together, with or without made-to-measure work.',
    card: 'Stock, sales, receipts and price rules for shops.',
    problems: [
      { title: 'Stock you can trust', body: 'Keep each item with its stock level and sizes. Restock, adjust with a reason, and get a warning when an item runs low.' },
      { title: 'Quick sales to clients or walk-ins', body: 'Record a sale in a few taps. Stock goes down at once and the sale shows in the item’s history.' },
      { title: 'Prices you control', body: 'Sales team members sell at the set price. Managers can give a discount up to the limit you set.' },
      { title: 'Receipts and invoices', body: 'Share a receipt or invoice with your business details by WhatsApp or email, as a PDF or an image.' },
      { title: 'See what sells and what it is worth', body: 'Each item shows what sold recently and the value of the stock you hold. Finance shows sales, costs and profit.' },
      { title: 'Your team, each with the right access', body: 'Give sales team members, a manager and an accountant their own sign-in and role.' },
    ],
    image: 'phone-31-store',
    alt: 'Store items with stock levels',
    features: ['store', 'documents', 'finance'],
  },
  'small-business': {
    path: '/small-business',
    kicker: 'For shops and traders',
    title: 'Clients, stock, sales and money, for any shop or trade.',
    lead: 'Threadé is built for shops and traders as much as for tailors: perfume and cosmetics sellers, bakers and cake makers, salons, and any small or medium business selling goods or services. Choose Shop or trader when you set up and you get customers, sales, stock, receipts, expenses and finance, built for exactly that, not a tailoring app with corners cut.',
    card: 'Customers, sales, stock and finance for any shop or trade.',
    problems: [
      { title: 'Customer records in one place', body: 'Keep each customer’s contact details and notes, and see what they bought and what they owe.' },
      { title: 'Sales and stock that stay in step', body: 'Every sale takes the items out of stock. Restock and adjust with a reason, and get a warning when something runs low, whether you are tracking bottles of perfume or finished cakes.' },
      { title: 'Receipts and invoices', body: 'Share receipts and invoices with your business details by WhatsApp or email.' },
      { title: 'Expenses and profit', body: 'Record expenses by category and see sales, costs, profit and money owed by week, month or year.' },
      { title: 'Records you can rely on', body: 'Nothing disappears: a payment is voided with a reason, not deleted, and the change log shows who did what and when.' },
      { title: 'Works offline, on any device', body: 'Install it from the browser on Android, iPhone, Windows or Mac. It keeps working when the internet does not.' },
    ],
    image: 'phone-31-store',
    alt: 'Store items with stock levels',
    features: ['store', 'finance', 'team'],
  },
};

export const ABOUT = {
  title: 'Why Threadé exists',
  body: [
    'In most small businesses the information is everywhere: clients or customers in WhatsApp, orders in someone’s head, stock in a notebook and balances in a spreadsheet. For a tailor, measurements get lost in the mix too, and client history is lost between orders.',
    'Threadé brings it into one place, for a tailor or fashion designer and for a shop or trader selling goods or services. The client or customer is at the centre, a tailor’s measurements are kept as dated versions so every order uses the right ones, and the whole team works from the same records, even without internet.',
  ],
  who: 'Threadé is provided by Dan Aremu, a sole trader trading as Threadé.',
};

// The full plan comparison, from the app's Compare plans page (plans.content.js). A value is
// true (included), false (not included) or a short text. Limits may change before launch.
export const PLAN_SECTIONS = [
  { title: 'Team', rows: [
    { label: 'People', values: { free: '1', pro: '3', business: '10' } },
    { label: 'Roles', values: { free: 'Admin', pro: 'Admin, Sales', business: 'All roles' } },
    { label: 'Assign people to stages', values: { free: false, pro: true, business: true } },
  ] },
  { title: 'Clients and measurements', rows: [
    { label: 'Clients, orders and payments', values: { free: 'Unlimited', pro: 'Unlimited', business: 'Unlimited' } },
    { label: 'Your own measurement fields', values: { free: '3', pro: 'Unlimited', business: 'Unlimited' } },
    { label: 'New measurement categories', values: { free: false, pro: true, business: true } },
    { label: 'Photos per client', values: { free: '3', pro: '12', business: '12' } },
  ] },
  { title: 'Store', rows: [{ label: 'Store items', values: { free: '25', pro: 'Unlimited', business: 'Unlimited' } }] },
  { title: 'Documents', rows: [
    { label: 'Invoices, receipts and delivery slips', values: { free: true, pro: true, business: true } },
    { label: 'No "Made with Threadé" line', values: { free: false, pro: true, business: true } },
    { label: 'Share links to invoices and receipts', values: { free: false, pro: true, business: true } },
  ] },
  { title: 'Money', rows: [
    { label: 'Finance periods', values: { free: 'This and last month', pro: 'All', business: 'All' } },
    { label: 'Finance by team member', values: { free: false, pro: false, business: true } },
    { label: 'CSV and PDF exports', values: { free: false, pro: true, business: true } },
  ] },
  { title: 'Records and help', rows: [
    { label: 'Change log', values: { free: '30 days', pro: 'Full', business: 'Full' } },
    { label: 'Support', values: { free: 'FAQ', pro: 'Email', business: 'Priority' } },
  ] },
];

