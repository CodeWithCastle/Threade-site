const fs = require('fs');
const path = require('path');
const { PAGES } = require('./pages');
const { GUIDES } = require('./guides');
const { AUDIENCE } = require('./content');

/**
 * Founder feedback, 2026-10-29: readers could not tell the product was not
 * only for tailors. The live site's own title said "tailoring app". The name
 * stays, so the pages around it carry the breadth.
 *
 * These assert the two things a reader actually judges: what the page calls
 * itself in search and social, and how much of the site is for whom.
 */
const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// Phrases that name tailoring as the whole product.
const TAILORING_ONLY = /tailoring app|app for tailors|run your tailoring|tailoring or fashion business|for tailors, fashion designers and/i;
// Mentioning tailors is fine; mentioning only tailors is not.
const MENTIONS_TRADE = /tailor|fashion|garment|measurement/i;
const MENTIONS_EVERYONE = /shop|trader|perfume|cake|salon|customers|whole business/i;

const balanced = (text) => {
  expect(text).not.toMatch(TAILORING_ONLY);
  if (MENTIONS_TRADE.test(text)) expect(text).toMatch(MENTIONS_EVERYONE);
};

describe('the site does not call itself a tailoring app', () => {
  it('no page title or description frames the product as tailoring only', () => {
    PAGES.forEach((p) => {
      // The tailoring pages are meant to speak only to tailors, and a guide is
      // judged by the balance of the whole set, below, not one at a time.
      if (p.segment === 'tailors' || p.segment === 'fashion-designers' || p.kind === 'guide') return;
      balanced(p.title);
      balanced(p.description);
    });
  });

  it('the home page sells the job, not the trade', () => {
    const home = PAGES.find((p) => p.path === '/');
    expect(home.title).toMatch(/whole business/i);
    expect(home.description).toMatch(/shops and traders/i);
  });

  it('the shell, the social preview and the installed name are not tailoring only', () => {
    const html = read('public/index.html');
    const meta = [...html.matchAll(/content="([^"]*)"/g)].map((m) => m[1]).join(' ');
    const title = html.match(/<title>([^<]*)<\/title>/)[1];
    balanced(`${title} ${meta}`);
    balanced(JSON.parse(read('public/manifest.json')).name);
  });

  it('shops and traders come first among the audiences, and every audience has a page', () => {
    expect(AUDIENCE[0].href).toBe('/small-business');
    AUDIENCE.forEach((a) => expect(PAGES.some((p) => p.path === a.href)).toBe(true));
  });

  it('the guides are not all about tailoring', () => {
    const forShops = GUIDES.filter((g) => g.threade.link === '/small-business');
    // A shop owner has to find more than one guide written for her.
    expect(forShops.length).toBeGreaterThanOrEqual(3);
    expect(GUIDES.length - forShops.length).toBeGreaterThanOrEqual(2);
  });
});
