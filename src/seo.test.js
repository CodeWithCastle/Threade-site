import { canonicalFor, headFor, jsonLdText, llmsFullTxt, llmsTxt, sitemapXml, structuredData } from './seo';
import { ALL_QUESTIONS, FIT } from './answers';
import { FEATURES } from './content';
import { GUIDES } from './guides';
import { NOT_FOUND, PAGES, pageFor } from './pages';

describe('page heads and structured data', () => {
  it('every page has a unique title and description, and a canonical address on www', () => {
    const titles = new Set(PAGES.map((p) => p.title));
    const descriptions = new Set(PAGES.map((p) => p.description));
    expect(titles.size).toBe(PAGES.length);
    expect(descriptions.size).toBe(PAGES.length);
    PAGES.forEach((p) => {
      expect(p.description.length).toBeLessThanOrEqual(170);
      expect(headFor(p).canonical).toMatch(/^https:\/\/www\.threade\.app\//);
      expect(headFor(p).robots).toContain('index');
    });
    expect(canonicalFor(pageFor('/'))).toBe('https://www.threade.app/');
    expect(canonicalFor(pageFor('/tailors/'))).toBe('https://www.threade.app/tailors');
  });

  it('the not-found page is not indexed and has no canonical or structured data', () => {
    expect(headFor(NOT_FOUND)).toMatchObject({ canonical: null, robots: 'noindex', jsonLd: null });
  });

  it('says only what is true: no ratings or reviews, and the prices are the published ones', () => {
    const published = ['0.00', '3.99', '7.99', '14.99'];
    PAGES.forEach((p) => {
      const text = JSON.stringify(structuredData(p));
      expect(text).not.toMatch(/aggregateRating|"review"|ratingValue/i);
      for (const [, price] of text.matchAll(/"price":"([^"]*)"/g)) expect(published).toContain(price);
      for (const [, currency] of text.matchAll(/"priceCurrency":"([^"]*)"/g)) expect(currency).toBe('USD');
    });
    const home = structuredData(pageFor('/'))['@graph'].map((n) => n['@type']);
    expect(home).toEqual(['Organization', 'WebSite', 'SoftwareApplication', 'WebPage']);
    const guide = structuredData(pageFor('/guides/deposits-and-balances'))['@graph'];
    expect(guide.map((n) => n['@type'])).toEqual(['Organization', 'WebSite', 'SoftwareApplication', 'WebPage', 'Article', 'BreadcrumbList']);
    expect(guide[5].itemListElement.map((i) => i.item)).toEqual([
      'https://www.threade.app/',
      'https://www.threade.app/guides',
      'https://www.threade.app/guides/deposits-and-balances',
    ]);
  });

  it('structured data can never close its script tag', () => {
    expect(jsonLdText({ a: '</script><script>alert(1)</script>' })).not.toContain('<');
  });

  it('the sitemap lists every indexable page once, with its date, and not the 404', () => {
    const xml = sitemapXml();
    PAGES.forEach((p) => expect(xml).toContain(`<loc>${canonicalFor(p)}</loc>`));
    expect(xml.match(/<url>/g)).toHaveLength(PAGES.length);
    expect(xml).not.toContain('404');
    expect(xml).toContain('<lastmod>2026-10-24</lastmod>');
  });
});

describe('answers for AI assistants', () => {
  it('the FAQ page carries every question and answer as FAQPage data', () => {
    const faq = structuredData(pageFor('/faq'))['@graph'].find((n) => n['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(ALL_QUESTIONS.length);
    expect(faq.mainEntity[0]).toEqual({ '@type': 'Question', name: 'What is Threadé?', acceptedAnswer: { '@type': 'Answer', text: ALL_QUESTIONS[0].a } });
  });

  it('describes the app with its features, audience, countries and help page, and no invented facts', () => {
    const app = structuredData(pageFor('/'))['@graph'].find((n) => n['@type'] === 'SoftwareApplication');
    expect(app.featureList).toEqual(expect.arrayContaining(FEATURES.map((f) => `${f.title}: ${f.short}`)));
    expect(app.areaServed.map((c) => c.name)).toEqual(expect.arrayContaining(['Nigeria', 'United Kingdom']));
    expect(app.softwareHelp.url).toBe('https://www.threade.app/faq');
    expect(app.isAccessibleForFree).toBe(true);
  });

  it('llms.txt is a short map: facts, fit, pages and guides, with absolute links', () => {
    const text = llmsTxt();
    expect(text.startsWith('# Threadé\n\n> ')).toBe(true);
    FIT.notFor.forEach((x) => expect(text).toContain(x));
    GUIDES.forEach((g) => expect(text).toContain(`https://www.threade.app/guides/${g.slug}`));
    expect(text).toContain('https://www.threade.app/llms-full.txt');
    expect(text).not.toMatch(/\]\(\//);
    expect(text).not.toContain('—');
  });

  it('llms-full.txt holds every feature, answer and guide, and the published dollar prices', () => {
    const text = llmsFullTxt();
    FEATURES.forEach((f) => expect(text).toContain(f.body));
    ALL_QUESTIONS.forEach((q) => expect(text).toContain(`Q: ${q.q}`));
    GUIDES.forEach((g) => expect(text).toContain(`### ${g.title}`));
    expect(text).toContain('Starter: $3.99 a month, or $39.90 a year');
    expect(text).not.toMatch(/₦\d|£\d|€\d/);
    expect(text).not.toContain('—');
  });
});

