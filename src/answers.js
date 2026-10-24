// Plain answers about Threadé: key facts, who it suits and does not suit, and every question
// and answer. Used by /faq, /about, the home page, structured data and llms.txt. Founder
// request 2026-10-24: make Threadé easy for people and AI assistants to understand.
// Facts only. The app sections are copied from the business app's FAQ (faq.content.js).
import { COUNTRIES_SERVED, PILOT_END, SUPPORT_EMAIL, TEAM_EMAIL } from './content';

const list = (items) => `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export const KEY_FACTS = [
  { label: 'What it is', value: 'An app that runs a tailoring or fashion business: clients, measurements, orders, production, payments, store stock, invoices, expenses and finance, shared with the team.' },
  { label: 'Made for', value: 'Tailors, fashion designers, ateliers, boutiques and other small shops.' },
  { label: 'Countries', value: `${list(COUNTRIES_SERVED)}, each business in its own currency.` },
  { label: 'Devices', value: 'Any phone, tablet or laptop with a modern browser. Installs on Android, iPhone, iPad, Windows and Mac without an app store.' },
  { label: 'Works offline', value: 'Yes. Records are saved on the device first and sent to the server when the connection returns.' },
  { label: 'Price', value: `Free plan for one person. Pro (3 people) and Business (10 people) prices are to be announced. During the pilot, until ${PILOT_END}, every business has all of Business free.` },
  { label: 'Data', value: 'On the team’s devices and on servers in the European Union (Ireland). Only the business can see its records. Full backup download on every plan.' },
  { label: 'Provided by', value: 'Dan Aremu, a sole trader trading as Threadé.' },
  { label: 'Contact', value: `${SUPPORT_EMAIL} (support), ${TEAM_EMAIL} (everything else).` },
];

// Who Threadé suits, and what it does not do today. Both lists are checked against the app.
export const FIT = {
  bestFor: [
    'Tailors who keep measurements in notebooks or WhatsApp and want them in one place, with every fitting kept.',
    'Fashion designers and ateliers with a small team who need to see what stage each order is at and who has it.',
    'Boutiques and fashion shops that sell ready-made items and want stock, sales and receipts together.',
    'Small shops outside fashion that need customers, sales, stock, expenses and profit in one simple app.',
    'Businesses with unreliable power or internet: it keeps working offline.',
  ],
  notFor: [
    'An online shop or website where your customers buy: Threadé is for running the business, not selling online.',
    'Appointment booking for clients: orders have delivery dates, but there is no booking calendar.',
    'Taking card payments: Threadé records the payments you receive; it does not process them.',
    'Importing records from spreadsheets or other apps: you add records in Threadé; restore works from Threadé backups.',
    'Payroll or full bookkeeping: finance shows sales, costs and profit and exports CSV and PDF for your accountant.',
    'Teams of more than 10 people: the largest plan has 10.',
  ],
};

const ABOUT_SECTION = {
  title: 'About Threadé',
  items: [
    { q: 'What is Threadé?', a: 'An app for tailors, fashion designers and small businesses. It keeps your clients, measurements, orders, payments, store stock, expenses and invoices in one place, and shares them with your team.' },
    { q: 'Who makes Threadé?', a: `Threadé is provided by Dan Aremu, a sole trader trading as Threadé. Write to ${SUPPORT_EMAIL} for support and ${TEAM_EMAIL} for anything else.` },
    { q: 'How much does Threadé cost?', a: `The Free plan costs nothing and needs no card. Pro and Business prices will be announced before the pilot ends. Until ${PILOT_END}, every business has all of Business free.` },
    { q: 'Which countries can use Threadé?', a: `Businesses in ${list(COUNTRIES_SERVED)}. Each business works in its own currency.` },
    { q: 'Is Threadé good for tailors in Nigeria?', a: 'Yes. It keeps working through power cuts and bad signal, a Nigerian business works in naira, and invoices and receipts go out by WhatsApp. Measurements can be in centimetres or inches.' },
    { q: 'Is Threadé good for tailors and dressmakers in the UK?', a: 'Yes. A UK business works in pounds, can use inches or centimetres, and keeps its data on servers in the European Union (Ireland).' },
    { q: 'My shop is not a tailoring business. Can I use it?', a: 'Yes. When you set up, choose Other business. You get customers, store sales, stock, receipts, expenses, finance and your team, without measurements or made-to-measure orders.' },
    { q: 'Is there a demo?', a: 'Not yet. During the pilot you can start free and try everything with your own records; nothing to pay and no card needed.' },
    { q: 'What does Threadé not do?', a: FIT.notFor.join(' ') },
  ],
};

// From the app's FAQ (More, FAQ). Keep in step with faq.content.js.
const APP_SECTIONS = [
  {
    title: 'Getting started',
    items: [
      {
        q: 'How do I install it on my phone or laptop?',
        a: 'Open Threadé in your browser and sign in once, then add it like an app. It gets its own icon and opens full screen. There is nothing to download from an app store.',
        steps: [
          'Android (Chrome): tap the menu (three dots), then Add to Home screen or Install app, then Install.',
          'iPhone or iPad (Safari): tap Share (the square with an arrow), then Add to Home Screen, then Add.',
          'Windows or Mac (Chrome or Edge): use the install icon at the right of the address bar, or the browser menu.',
          'Mac (Safari): click File, then Add to Dock.',
        ],
      },
      {
        q: 'Does it work without internet?',
        a: 'Yes. Everything you add is saved on your device first. When the connection comes back, your changes are sent to the server and your team sees them. Signing up, inviting people and sharing links need the internet.',
      },
      { q: 'Where is my data kept?', a: 'On the devices of your team and on secure servers in the European Union (Ireland). Only people in your business can see it.' },
    ],
  },
  {
    title: 'Team and access',
    items: [
      { q: 'Who can do what?', a: 'Admin: everything, including team, backups and deleting the business. Manager: clients, orders, store, expenses and sales team members. Sales: clients, measurements, orders and, if allowed, store sales. Accountant: orders, store (view only), finance and expenses.' },
      { q: 'How do I add someone to my team?', a: 'More, Team members, Invite member. Choose their role. They get an email; they open the link in it, choose a password and join. You can also copy the invite link and send it yourself.' },
      { q: 'How do I remove someone?', a: 'More, Team members, choose the person, then Remove from team. They lose access straight away. Records they made stay, with their name.' },
    ],
  },
  {
    title: 'Clients and measurements',
    items: [
      { q: 'Do I need my clients’ permission?', a: 'Yes. When you set up the business you confirm that you tell your clients their details are kept in Threadé and keep them only with their permission. Tell each client when you take their details.' },
      { q: 'How do I take measurements?', a: 'Open the client, then Measurements, Take new measurement. Fill in what you measured; empty fields are fine. Each time you measure again, a new version is kept so you can compare.' },
      { q: 'Can I change a measurement?', a: 'Yes, with Edit measurements, until an order uses it. Then it is locked so the order stays accurate; take a new measurement instead.' },
      { q: 'Can I use inches instead of centimetres?', a: 'Yes. The admin chooses the unit in More, Business. Measurements are shown in the unit you choose; nothing you recorded changes.' },
    ],
  },
  {
    title: 'Orders, production and payments',
    items: [
      { q: 'How do I create an order?', a: 'Orders, New order. For made-to-measure work choose the client, their measurements, the garment, price and delivery date, and any deposit. With Store on you can also sell ready-made items.' },
      { q: 'How do I record a payment?', a: 'Open the order and choose Record payment. Payments are never edited: if one is wrong, void it with a reason and record it again.' },
      { q: 'Why can I not delete an order or a client?', a: 'An order with payments cannot be deleted; void its payments first. A client with orders or measurements is archived instead, so your history and finance stay correct. You can restore them later.' },
      { q: 'What is the Production page?', a: 'Your made-to-measure orders by stage: Cutting, Sewing, Fitting and Ready. Team members move orders along; the admin and managers choose who does each stage. Mark the order delivered when the client has it.' },
    ],
  },
  {
    title: 'Store, documents and money',
    items: [
      { q: 'How do I sell ready-made items?', a: 'The admin turns on Store in More. Add items with price, stock and an optional cost price. Sell from Orders, New order, From store; stock goes down as you sell.' },
      { q: 'How do I send an invoice or receipt?', a: 'Open the order, then Documents. Issue an invoice, a receipt for a payment or a delivery slip, then share it by WhatsApp or email, as a PDF or image, or as a link that works for 14 days.' },
      { q: 'What does the tax percentage do?', a: 'It shows your tax code on invoices and receipts and a tax estimate in Finance. It is not added to your prices or order totals. The admin changes it in More, Business.' },
      { q: 'Where do I see how the business is doing?', a: 'Finance (admin and accountants) shows sales, cash received, costs, profit and who owes you, by period, and downloads as PDF or CSV. Expenses are in More, Money.' },
    ],
  },
  {
    title: 'Sync, backups and safety',
    items: [
      { q: 'How soon does my team see my changes?', a: 'Usually within a few seconds while the app is open and online.' },
      { q: 'Who changed what?', a: 'The admin and managers can open More, Change log: every change, who made it and when.' },
      { q: 'How do I back up my data?', a: 'The admin opens More, Backup and restore, enters their password and downloads one file with everything. Keep it private: it holds your clients’ details. Restoring a backup also asks for the password.' },
      { q: 'What happens if I delete my business?', a: 'The admin downloads a final backup and the business closes for everyone. You can cancel within 30 days; after that everything is deleted, including your team’s logins.' },
    ],
  },
];

export const FAQ_SECTIONS = [ABOUT_SECTION, ...APP_SECTIONS];
export const ALL_QUESTIONS = FAQ_SECTIONS.flatMap((s) => s.items);
