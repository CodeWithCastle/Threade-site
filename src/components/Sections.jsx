import { useId, useRef, useState } from 'react';
import {
  ABOUT,
  ALWAYS,
  AUDIENCE,
  SEGMENTS,
  WORKFLOW,
  FAQ,
  FEATURES,
  HERO,
  IN_EVERY_PLAN,
  PLANS,
  PLANS_NOTE,
  SIGN_UP_URL,
  STEPS,
} from '../content';
import { Laptop, Phone } from './Shot';
import Tape from './Tape';
import { GUIDES } from '../guides';
import { CURRENCIES, CURRENCY_CODES, priceNote, priceText } from '../pricing';
import useCurrency from '../useCurrency';
import { FIT } from '../answers';

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" />
            {HERO.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span>{HERO.title[0]}</span>{' '}
            <span className="accent-text">{HERO.title[1]}</span>
          </h1>
          <p className="hero__lead">{HERO.lead}</p>
          <div className="hero__actions">
            <a className="button button--primary" href={SIGN_UP_URL}>
              {HERO.primary}
            </a>
            <a className="button button--ghost" href="#workflow">
              {HERO.secondary}
            </a>
          </div>
          <ul className="hero__proof">
            {HERO.proof.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="hero__visual" role="group" aria-label="Threadé on a laptop and a phone">
          <Laptop image="laptop-40-finance" alt="Finance on a laptop: sales, cash, costs, profit and debts" className="hero__laptop" />
          <Phone image="phone-10-home" alt="Home on a phone: deliveries this week, money owed and this month" className="hero__phone" eager />
          <div className="chip chip--float chip--a" aria-hidden="true">
            Deposit recorded <strong>₦20,000</strong>
          </div>
          <div className="chip chip--float chip--b" aria-hidden="true">
            Moved to <strong>Fitting</strong>
          </div>
        </div>
      </div>
      <Tape className="hero__tape" />
    </section>
  );
}

export function Audience() {
  return (
    <section className="audience" aria-label="Who Threadé is for">
      <div className="wrap audience__row">
        <p>Made for</p>
        <ul>
          {AUDIENCE.map((a) => (
            <li key={a.href}>
              <a href={a.href}>{a.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Features() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const base = useId();
  const feature = FEATURES[active];

  const onKey = (event) => {
    const last = FEATURES.length - 1;
    let next = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="features" className="section features" aria-labelledby="features-title">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="kicker">Everything in one place</p>
          <h2 id="features-title">From the first measurement to the final receipt.</h2>
          <p className="section__lead">Threadé follows the way a workshop really runs, so nothing lives on scraps of paper or in old WhatsApp chats.</p>
        </header>
        <div className="features__grid">
          <div className="features__tabs" role="tablist" aria-orientation="vertical" aria-label="Features" onKeyDown={onKey}>
            {FEATURES.map((f, i) => (
              <button
                key={f.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${base}-tab-${f.id}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls={`${base}-panel`}
                tabIndex={i === active ? 0 : -1}
                className={`tab ${i === active ? 'tab--active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="tab__title">{f.title}</span>
                <span className="tab__short">{f.short}</span>
              </button>
            ))}
          </div>
          <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${feature.id}`} className="features__panel" tabIndex={0}>
            <div className="features__text" key={`t-${feature.id}`}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
              <ul className="ticks">
                {feature.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <Phone key={feature.id} image={feature.image} alt={feature.alt} className="features__phone" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Showcase() {
  return (
    <section className="section showcase" aria-labelledby="showcase-title">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="kicker">Phone in the workshop, laptop at the desk</p>
          <h2 id="showcase-title">The same records, wherever you are.</h2>
        </header>
        <div className="showcase__grid">
          <figure className="showcase__item" data-reveal>
            <Laptop image="laptop-27-production" alt="Production board on a laptop" />
            <figcaption>Production: every order by stage, and who is on it.</figcaption>
          </figure>
          <figure className="showcase__item" data-reveal>
            <Laptop image="laptop-20-orders" alt="Orders list on a laptop with overdue and this week" />
            <figcaption>Orders: overdue first, then this week.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function Always() {
  return (
    <section className="section always" aria-labelledby="always-title">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="kicker">Built for real workshops</p>
          <h2 id="always-title">No signal? No problem.</h2>
          <p className="section__lead">Power cuts and patchy data should never stop a fitting. Threadé is built to keep working.</p>
        </header>
        <ul className="cards">
          {ALWAYS.map((item, i) => (
            <li key={item.title} className="card card--stitch" data-reveal>
              <span className="card__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function How() {
  return (
    <section id="how" className="section how" aria-labelledby="how-title">
      <div className="wrap how__grid">
        <header className="section__head section__head--left" data-reveal>
          <p className="kicker">How it works</p>
          <h2 id="how-title">Open for business in minutes.</h2>
          <p className="section__lead">No installation, no training day. If you can use WhatsApp, you can use Threadé.</p>
          <a className="button button--primary" href={SIGN_UP_URL}>
            Create your account
          </a>
        </header>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step" data-reveal>
              <span className="step__n" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Plans() {
  const [currency, chooseCurrency] = useCurrency();
  return (
    <section id="plans" className="section plans" aria-labelledby="plans-title">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="kicker">Plans</p>
          <h2 id="plans-title">Start free. Grow when you are ready.</h2>
          <p className="section__lead">{PLANS_NOTE}</p>
          <fieldset className="plans__currency">
            <legend>Show prices in</legend>
            {CURRENCY_CODES.map((code) => (
              <label key={code} className={currency === code ? 'is-on' : ''}>
                <input
                  type="radio"
                  name="currency"
                  value={code}
                  checked={currency === code}
                  onChange={() => chooseCurrency(code)}
                />
                {CURRENCIES[code].label} ({CURRENCIES[code].symbol})
              </label>
            ))}
          </fieldset>
        </header>
        <div className="plans__grid">
          {PLANS.map((p) => (
            <article key={p.key} className={`plan ${p.highlight ? 'plan--highlight' : ''}`} data-reveal aria-labelledby={`plan-${p.key}`}>
              {p.highlight && <p className="plan__badge">Most teams start here</p>}
              <h3 id={`plan-${p.key}`}>{p.name}</h3>
              <p className="plan__for">{p.for}</p>
              <p className="plan__price">{priceText(p.key, currency)}</p>
              <p className="plan__note">{priceNote(p.key, currency)}</p>
              <ul className="ticks">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className={`button ${p.highlight ? 'button--primary' : 'button--ghost'} button--block`} href={SIGN_UP_URL}>
                Start free
              </a>
            </article>
          ))}
        </div>
        <p className="plans__more">
          <a href="/pricing">Compare every plan in full</a>
        </p>
        <div className="plans__every" data-reveal>
          <p>In every plan</p>
          <ul>
            {IN_EVERY_PLAN.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="wrap faq__grid">
        <header className="section__head section__head--left" data-reveal>
          <p className="kicker">Questions</p>
          <h2 id="faq-title">Good to know.</h2>
          <p className="section__lead">
            <a href="/faq">See every question and answer</a>, read our <a href="/guides">guides</a> or <a href="/about">contact us</a>.
          </p>
        </header>
        <div className="faq__list">
          {FAQ.map((item) => (
            <details key={item.q} className="qa" data-reveal>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Workflow() {
  return (
    <section id="workflow" className="section workflow" aria-labelledby="workflow-title">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="kicker">{WORKFLOW.kicker}</p>
          <h2 id="workflow-title">{WORKFLOW.title}</h2>
          <p className="section__lead">{WORKFLOW.lead}</p>
        </header>
        <ol className="flow">
          {WORKFLOW.steps.map((step, i) => (
            <li key={step.title} className="flow__step card--stitch" data-reveal>
              <span className="step__n" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <a href={step.link} className="flow__link">
                {step.linkText}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Segments() {
  return (
    <section id="who" className="section segments" aria-labelledby="who-title">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="kicker">Who it is for</p>
          <h2 id="who-title">Built for fashion businesses, small and growing.</h2>
        </header>
        <ul className="link-cards link-cards--four">
          {Object.entries(SEGMENTS).map(([key, s]) => (
            <li key={key} className="link-card" data-reveal>
              <h3>
                <a href={s.path}>{s.kicker.replace(/^For /, 'Threadé for ')}</a>
              </h3>
              <p>{s.card}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutTeaser() {
  return (
    <section className="section about-teaser" aria-labelledby="about-title">
      <div className="wrap about-teaser__grid" data-reveal>
        <div>
          <p className="kicker">About</p>
          <h2 id="about-title">{ABOUT.title}</h2>
        </div>
        <div>
          {ABOUT.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <a href="/about">More about Threadé, your data and how to reach us</a>
        </div>
      </div>
    </section>
  );
}

export function GuidesTeaser() {
  return (
    <section className="section" aria-labelledby="guides-title">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="kicker">Guides</p>
          <h2 id="guides-title">Practical help for running your business.</h2>
        </header>
        <ul className="link-cards link-cards--four">
          {[...GUIDES.slice(-1), ...GUIDES.slice(0, 3)].map((g) => (
            <li key={g.slug} className="link-card" data-reveal>
              <h3>
                <a href={`/guides/${g.slug}`}>{g.title}</a>
              </h3>
              <p>{g.short}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Who Threadé suits and what it does not do: honest, so people (and assistants) can tell
// at once whether it fits.
export function Fit({ headingLevel = 2 }) {
  const H = `h${headingLevel}`;
  const Sub = `h${headingLevel + 1}`;
  return (
    <section id="fit" className="section fit" aria-labelledby="fit-title">
      <div className="wrap">
        <header className="section__head" data-reveal>
          <p className="kicker">Is it right for you?</p>
          <H id="fit-title">Who Threadé suits, and what it does not do.</H>
        </header>
        <div className="fit__grid">
          <div className="fit__col card--stitch" data-reveal>
            <Sub>A good fit for</Sub>
            <ul className="ticks">
              {FIT.bestFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="fit__col card--stitch" data-reveal>
            <Sub>Not what it does today</Sub>
            <ul className="crosses">
              {FIT.notFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

