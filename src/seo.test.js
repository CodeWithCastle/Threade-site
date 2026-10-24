import { canonicalFor, headFor, jsonLdText, sitemapXml, structuredData } from './seo';
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

  it('says only what is true: no ratings or reviews, and the only price is the Free plan at 0', () => {
    PAGES.forEach((p) => {
      const text = JSON.stringify(structuredData(p));
      expect(text).not.toMatch(/aggregateRating|"review"|ratingValue/i);
      for (const [, price] of text.matchAll(/"price":"([^"]*)"/g)) expect(price).toBe('0');
    });
    const home = structuredData(pageFor('/'))['@graph'].map((n) => n['@type']);
    expect(home).toEqual(['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage']);
    const guide = structuredData(pageFor('/guides/deposits-and-balances'))['@graph'];
    expect(guide.map((n) => n['@type'])).toEqual(['Organization', 'WebSite', 'Article', 'BreadcrumbList']);
    expect(guide[3].itemListElement.map((i) => i.item)).toEqual([
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
