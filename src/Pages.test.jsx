import { render, screen, within } from '@testing-library/react';
import App from './App';
import { FEATURES, PLANS, SEGMENTS } from './content';
import { GUIDES } from './guides';
import { NOT_FOUND, PAGES, pageFor } from './pages';
import { ALL_QUESTIONS, FAQ_SECTIONS, FIT } from './answers';

// Founder request 2026-10-24: one crawlable page per audience, features, pricing, about and guides.
describe('public pages', () => {
  it.each(PAGES.map((p) => [p.path, p]))('%s has one h1 and its own title, in plain English', (path, page) => {
    render(<App path={path} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.title).toBe(page.title);
    // Plain English rules: no em dashes, "team" for a business's people.
    const text = document.body.textContent;
    expect(text).not.toContain('—');
    expect(text.replace(/Threadé staff/g, '')).not.toMatch(/\bstaff\b/i);
  });

  it.each(PAGES.filter((p) => p.path !== '/').map((p) => p.path))('%s has a breadcrumb back home', (path) => {
    render(<App path={path} />);
    expect(within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it('finds pages with or without a trailing slash; anything else is the not-found page', () => {
    expect(pageFor('/tailors/').path).toBe('/tailors');
    expect(pageFor('/Pricing').path).toBe('/pricing');
    expect(pageFor('/nope')).toBe(NOT_FOUND);
    render(<App path="/nope" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('This page does not exist.');
  });

  it('the features page shows every feature in full, each with its own anchor', () => {
    render(<App path="/features" />);
    FEATURES.forEach((f) => {
      const section = screen.getByRole('region', { name: f.title });
      expect(section).toHaveAttribute('id', f.id);
      expect(section).toHaveTextContent(f.body);
    });
  });

  it('each audience page links to the features it relies on and to the other audiences', () => {
    Object.entries(SEGMENTS).forEach(([key, segment]) => {
      const { unmount } = render(<App path={segment.path} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(segment.title);
      segment.features.forEach((id) => expect(screen.getByRole('link', { name: `${FEATURES.find((f) => f.id === id).title}: how it works` })).toHaveAttribute('href', `/features#${id}`));
      Object.entries(SEGMENTS)
        .filter(([other]) => other !== key)
        .forEach(([, o]) => expect(screen.getByRole('link', { name: o.kicker.replace(/^For /, 'Threadé for ') })).toHaveAttribute('href', o.path));
      unmount();
    });
  });

  it('pricing compares all four plans and shows the published prices', () => {
    render(<App path="/pricing" />);
    const table = screen.getByRole('table', { name: 'What each plan includes' });
    expect(PLANS.map((p) => p.key)).toEqual(['free', 'starter', 'pro', 'business']);
    PLANS.forEach((p) => expect(within(table).getByRole('columnheader', { name: p.name })).toBeInTheDocument());
    expect(within(table).getByRole('row', { name: /People 1 3 6 12/ })).toBeInTheDocument();
    // Dollars until /api/region answers, which it does not in a test.
    expect(screen.getByRole('main')).toHaveTextContent('$3.99');
    expect(screen.getByRole('main')).not.toHaveTextContent(/₦\d|£\d|€\d/);
  });

  it('about shows who provides Threadé and how to reach us, without an invented address', () => {
    render(<App path="/about" />);
    expect(within(screen.getByRole('main')).getAllByText(/sole trader trading as Threadé/).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'Threadé at a glance' })).toBeInTheDocument();
    expect(screen.getByText(/Business address: not provided yet/)).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getByRole('link', { name: 'support@threade.app' })).toHaveAttribute('href', 'mailto:support@threade.app');
  });

  it('every guide is listed and opens with its date and how Threadé helps', () => {
    render(<App path="/guides" />);
    GUIDES.forEach((g) => expect(screen.getByRole('link', { name: g.title })).toHaveAttribute('href', `/guides/${g.slug}`));
    GUIDES.forEach((g) => {
      const { unmount } = render(<App path={`/guides/${g.slug}`} />);
      const article = screen.getByRole('article', { name: g.title });
      expect(within(article).getByText(/Published/)).toContainElement(within(article).getAllByText(/2026/)[0]);
      expect(within(article).getByRole('heading', { name: /^How Threadé (helps|answers these)$/ })).toBeInTheDocument();
      unmount();
    });
  });

  it('the home page links each audience, the workflow and the guides with descriptive text', () => {
    render(<App path="/" />);
    expect(screen.getByRole('link', { name: 'See how it works' })).toHaveAttribute('href', '#workflow');
    expect(screen.getByRole('region', { name: 'One job, from first contact to paid.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Threadé for tailors' })).toHaveAttribute('href', '/tailors');
    expect(screen.getByRole('link', { name: 'Compare every plan in full' })).toHaveAttribute('href', '/pricing');
    expect(screen.queryByRole('link', { name: /^(click here|read more|here)$/i })).not.toBeInTheDocument();
  });

  it('the FAQ page shows every answer openly, grouped by topic, with the key facts and who it suits', () => {
    render(<App path="/faq" />);
    ALL_QUESTIONS.forEach((q) => expect(screen.getByRole('heading', { level: 3, name: q.q })).toBeInTheDocument());
    FAQ_SECTIONS.forEach((s) => expect(screen.getByRole('region', { name: s.title })).toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Threadé at a glance' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Not what it does today' })).toBeInTheDocument();
    expect(screen.getByRole('main')).not.toHaveTextContent(/₦\d|£\d|\$\d|€\d/);
  });

  it('the home page says plainly who Threadé suits and what it does not do', () => {
    render(<App path="/" />);
    const fit = screen.getByRole('region', { name: 'Who Threadé suits, and what it does not do.' });
    FIT.notFor.forEach((x) => expect(fit).toHaveTextContent(x));
    expect(screen.getByRole('link', { name: 'See every question and answer' })).toHaveAttribute('href', '/faq');
  });
});
