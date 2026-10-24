import {
  ABOUT,
  ALWAYS,
  COUNTRIES_SERVED,
  FAQ,
  FEATURES,
  IN_EVERY_PLAN,
  LEGAL,
  PLAN_SECTIONS,
  PLANS,
  SEGMENTS,
  SIGN_UP_URL,
  SUPPORT_EMAIL,
  TEAM_EMAIL,
} from '../content';
import { GUIDES, guideBySlug } from '../guides';
import { FAQ_SECTIONS, KEY_FACTS } from '../answers';
import { Breadcrumbs, CtaBand, PageHead } from './Common';
import { Fit, Plans } from './Sections';
import { Phone } from './Shot';

const listOf = (items) => `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
const featureById = (id) => FEATURES.find((f) => f.id === id);
const GUIDE_FOR = { tailors: 'taking-client-measurements', 'fashion-designers': 'tailoring-order-workflow', boutiques: 'stock-for-small-shops', 'small-business': 'stock-for-small-shops' };

function GuideCards({ guides, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <ul className="link-cards">
      {guides.map((g) => (
        <li key={g.slug} className="link-card">
          <H>
            <a href={`/guides/${g.slug}`}>{g.title}</a>
          </H>
          <p>{g.short}</p>
        </li>
      ))}
    </ul>
  );
}

export function FeaturesPage() {
  return (
    <main id="main">
      <div className="wrap">
        <PageHead
          crumbs={[{ label: 'Features' }]}
          kicker="Features"
          title="Everything a tailoring or fashion business runs on, in one app."
          lead="From the first measurement to the final receipt. Each feature below is in the app today; screens show sample data."
        >
          <nav aria-label="On this page" className="toc">
            {FEATURES.map((f) => (
              <a key={f.id} href={`#${f.id}`}>
                {f.title}
              </a>
            ))}
          </nav>
        </PageHead>
      </div>
      {FEATURES.map((f, i) => (
        <section key={f.id} id={f.id} className={`section feature-row ${i % 2 ? 'feature-row--flip' : ''}`} aria-labelledby={`${f.id}-title`}>
          <div className="wrap feature-row__grid">
            <div className="feature-row__text">
              <p className="kicker">{f.short}</p>
              <h2 id={`${f.id}-title`}>{f.title}</h2>
              <p className="section__lead">{f.body}</p>
              <ul className="ticks">
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <Phone image={f.image} alt={f.alt} className="feature-row__phone" />
          </div>
        </section>
      ))}
      <section className="section always" aria-labelledby="always-title">
        <div className="wrap">
          <header className="section__head">
            <p className="kicker">In every plan</p>
            <h2 id="always-title">Built for real workshops.</h2>
          </header>
          <ul className="cards">
            {ALWAYS.map((item) => (
              <li key={item.title} className="card card--stitch">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}

export function SegmentPage({ segment, crumb }) {
  const s = SEGMENTS[segment];
  const others = Object.entries(SEGMENTS).filter(([key]) => key !== segment);
  const guide = guideBySlug(GUIDE_FOR[segment]);
  return (
    <main id="main">
      <div className="wrap segment-hero">
        <PageHead crumbs={[{ label: crumb }]} kicker={s.kicker} title={s.title} lead={s.lead}>
          <div className="hero__actions">
            <a className="button button--primary" href={SIGN_UP_URL}>
              Start free
            </a>
            <a className="button button--ghost" href="/features">
              See all features
            </a>
          </div>
        </PageHead>
        <Phone image={s.image} alt={s.alt} className="segment-hero__phone" eager />
      </div>
      <section className="section" aria-labelledby="solves-title">
        <div className="wrap">
          <header className="section__head">
            <h2 id="solves-title">What Threadé does for you</h2>
          </header>
          <ul className="cards">
            {s.problems.map((p) => (
              <li key={p.title} className="card card--stitch">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section" aria-labelledby="more-title">
        <div className="wrap related">
          <div>
            <h2 id="more-title">Read more</h2>
            <ul className="related__list">
              {s.features.map((id) => (
                <li key={id}>
                  <a href={`/features#${id}`}>{featureById(id).title}: how it works</a>
                </li>
              ))}
              <li>
                <a href={`/guides/${guide.slug}`}>Guide: {guide.title}</a>
              </li>
              <li>
                <a href="/pricing">Compare plans and pricing</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 id="others-title">Threadé is also for</h2>
            <ul className="related__list">
              {others.map(([key, o]) => (
                <li key={key}>
                  <a href={o.path}>{o.kicker.replace(/^For /, 'Threadé for ')}</a>: {o.card}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}

const Cell = ({ value }) => {
  if (value === true) return <span className="yes">Included</span>;
  if (value === false) return <span className="no">Not included</span>;
  return value;
};

const PRICING_FAQ = ['What happens when the pilot ends?', 'Is there a demo?', 'How do I back up my data?', 'Which countries can use Threadé?'];

export function PricingPage() {
  return (
    <main id="main">
      <div className="wrap">
        <PageHead
          crumbs={[{ label: 'Pricing' }]}
          kicker="Pricing"
          title="Threadé plans and pricing"
          lead="Free for one person. Pro and Business for teams. Prices for Pro and Business are announced before the pilot ends; until then every business has all of Business, free."
        />
      </div>
      <Plans />
      <section className="section" aria-labelledby="compare-title">
        <div className="wrap">
          <header className="section__head">
            <h2 id="compare-title">Compare plans in full</h2>
            <p className="section__lead">From the app’s own Compare plans page. Limits may change before launch.</p>
          </header>
          {/* Scrolls sideways on small screens; focusable so keyboard users can scroll it too. */}
          <div className="table-wrap" role="region" aria-label="Plan comparison" tabIndex={0}>
            <table className="compare">
              <caption className="sr-only">What each plan includes</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {PLANS.map((p) => (
                    <th scope="col" key={p.key}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {PLAN_SECTIONS.map((section) => (
                <tbody key={section.title}>
                  <tr className="compare__group">
                    <th scope="colgroup" colSpan={PLANS.length + 1}>
                      {section.title}
                    </th>
                  </tr>
                  {section.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {PLANS.map((p) => (
                        <td key={p.key}>
                          <Cell value={row.values[p.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <p className="muted">In every plan: {IN_EVERY_PLAN.join(', ')}.</p>
        </div>
      </section>
      <section className="section" aria-labelledby="pricing-faq-title">
        <div className="wrap faq__list">
          <h2 id="pricing-faq-title">Questions about plans</h2>
          {FAQ.filter((f) => PRICING_FAQ.includes(f.q)).map((item) => (
            <details key={item.q} className="qa">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}

export function AboutPage() {
  return (
    <main id="main" className="section prose-page">
      <div className="wrap prose">
        <PageHead crumbs={[{ label: 'About' }]} kicker="About" title={ABOUT.title} />
        <KeyFacts />
        {ABOUT.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <h2>Who we are</h2>
        <p>
          {ABOUT.who} Business address: not provided yet.
        </p>
        <h2>Who it is for</h2>
        <p>
          Tailors, fashion designers, ateliers, boutiques and other small shops in {listOf(COUNTRIES_SERVED)}. Each business works in its own
          currency.
        </p>
        <h2>Your data</h2>
        <p>
          Records are kept on your team’s devices and on servers in the European Union (Ireland). Only people in your business can see your
          records; Threadé staff never see your clients. The admin can download a full backup at any time, on every plan.
        </p>
        <h2>Contact and support</h2>
        <p>
          Support and help with your account: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Privacy questions and everything else:{' '}
          <a href={`mailto:${TEAM_EMAIL}`}>{TEAM_EMAIL}</a>. Signed in, you can also write to us from the app: More, Contact Threadé.
        </p>
        <h2>Legal</h2>
        <ul className="related__list">
          <li>
            <a href={LEGAL.terms}>Terms of Service</a>
          </li>
          <li>
            <a href={LEGAL.dpa}>Data Processing Agreement</a>
          </li>
          <li>
            <a href={LEGAL.privacy}>App Privacy Notice</a>
          </li>
          <li>
            <a href="/privacy">Website privacy</a>
          </li>
        </ul>
      </div>
      <CtaBand />
    </main>
  );
}

export function GuidesPage() {
  return (
    <main id="main">
      <div className="wrap">
        <PageHead
          crumbs={[{ label: 'Guides' }]}
          kicker="Guides"
          title="Guides for running a tailoring or fashion business"
          lead="Practical routines for measurements, money, production and stock, whether or not you use Threadé."
        />
        <GuideCards guides={GUIDES} headingLevel={2} />
      </div>
      <CtaBand />
    </main>
  );
}

const formatDay = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function GuidePage({ slug }) {
  const guide = guideBySlug(slug);
  const others = GUIDES.filter((g) => g.slug !== slug);
  return (
    <main id="main" className="section prose-page">
      <article className="wrap prose" aria-labelledby="guide-title">
        <header className="page-head">
          <Breadcrumbs items={[{ label: 'Guides', href: '/guides' }, { label: guide.title }]} />
          <p className="kicker">Guide</p>
          <h1 id="guide-title">{guide.title}</h1>
          <p className="muted">
            By Threadé. Published <time dateTime={guide.published}>{formatDay(guide.published)}</time>
            {guide.updated !== guide.published && (
              <>
                , updated <time dateTime={guide.updated}>{formatDay(guide.updated)}</time>
              </>
            )}
            .
          </p>
        </header>
        {guide.blocks.map((b, i) => {
          if (b.h) return <h2 key={i}>{b.h}</h2>;
          if (b.list)
            return (
              <ul key={i} className="ticks prose__list">
                {b.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          return <p key={i}>{b.p}</p>;
        })}
        <aside className="guide-box card--stitch" aria-labelledby="guide-threade">
          <h2 id="guide-threade">{guide.threade.title}</h2>
          <p>{guide.threade.body}</p>
          <a href={guide.threade.link}>{guide.threade.linkText}</a>
        </aside>
        <h2>More guides</h2>
        <GuideCards guides={others} />
      </article>
      <CtaBand />
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main id="main" className="section prose-page">
      <div className="wrap prose">
        <p className="kicker">Page not found</p>
        <h1>This page does not exist.</h1>
        <p>The address may be mistyped, or the page has moved.</p>
        <ul className="related__list">
          <li>
            <a href="/">Threadé home page</a>
          </li>
          <li>
            <a href="/features">Features</a>
          </li>
          <li>
            <a href="/guides">Guides</a>
          </li>
        </ul>
      </div>
    </main>
  );
}

// Threadé in one table: the facts people and assistants ask about first.
export function KeyFacts() {
  return (
    <section className="facts" aria-labelledby="facts-title">
      <h2 id="facts-title">Threadé at a glance</h2>
      <dl className="facts__list">
        {KEY_FACTS.map((f) => (
          <div key={f.label} className="facts__row">
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const slugOf = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function FaqPage() {
  return (
    <main id="main">
      <div className="wrap prose">
        <PageHead
          crumbs={[{ label: 'FAQ' }]}
          kicker="FAQ"
          title="Questions about Threadé, answered"
          lead="What Threadé is, what it costs, where it works and how each part of the app works. Inside the app, the same answers are under More, FAQ."
        >
          <nav aria-label="Topics" className="toc">
            {FAQ_SECTIONS.map((s) => (
              <a key={s.title} href={`#${slugOf(s.title)}`}>
                {s.title}
              </a>
            ))}
          </nav>
        </PageHead>
        <KeyFacts />
        {FAQ_SECTIONS.map((section) => (
          <section key={section.title} id={slugOf(section.title)} className="faq-group" aria-labelledby={`${slugOf(section.title)}-title`}>
            <h2 id={`${slugOf(section.title)}-title`}>{section.title}</h2>
            {section.items.map((item) => (
              <div key={item.q} className="answer">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
                {item.steps && (
                  <ul className="ticks prose__list">
                    {item.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
      <Fit />
      <CtaBand />
    </main>
  );
}

