import { SIGN_UP_URL } from '../content';

// The trail above a page's title: Home > Guides > This guide. The same trail is in the
// page's structured data (src/seo.js).
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        <li>
          <a href="/">Home</a>
        </li>
        {items.map((item, i) => (
          <li key={item.label}>
            {i === items.length - 1 ? <span aria-current="page">{item.label}</span> : <a href={item.href}>{item.label}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// The top of every page other than home.
export function PageHead({ crumbs, kicker, title, lead, children }) {
  return (
    <header className="page-head">
      <Breadcrumbs items={crumbs} />
      {kicker && <p className="kicker">{kicker}</p>}
      <h1>{title}</h1>
      {lead && <p className="page-head__lead">{lead}</p>}
      {children}
    </header>
  );
}

// The closing call to action on every page.
export function CtaBand({ title = 'Try Threadé with your own records.', lead }) {
  return (
    <section className="section cta-band" aria-labelledby="cta-title">
      <div className="wrap cta-band__card card--stitch">
        <div>
          <h2 id="cta-title">{title}</h2>
          <p className="section__lead">{lead ?? 'Free during the pilot, with every feature of Business. No card needed.'}</p>
        </div>
        <div className="cta-band__actions">
          <a className="button button--primary" href={SIGN_UP_URL}>
            Start free
          </a>
          <a className="button button--ghost" href="/#waitlist">
            Join the waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
