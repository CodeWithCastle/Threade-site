import { useEffect, useRef, useState } from 'react';
import { AUDIENCE, COUNTRIES, FOOTER, LEGAL, NAV, SIGN_IN_URL, SIGN_UP_URL, SUPPORT_EMAIL, TEAM_EMAIL, WAITLIST } from '../content';
import { ALREADY, DONE, joinWaitlist, validateWaitlist } from '../waitlist';
import Mark from './Mark';

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="wrap nav__row">
        <a href="/" className="nav__home" aria-label="Threadé home">
          <Mark />
        </a>
        <nav aria-label="Main" className="nav__links" id="site-menu">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="nav__signin" href={SIGN_IN_URL}>
            Sign in
          </a>
          <a className="button button--primary button--small" href={SIGN_UP_URL}>
            Start free
          </a>
        </nav>
        <button type="button" className="nav__toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((v) => !v)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="nav__bars" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

const EMPTY = { email: '', name: '', business: '', country: '', website: '' };

export function Waitlist() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const doneRef = useRef(null);

  // The form (and its focused button) is replaced by the message: move focus there so
  // keyboard and screen reader users are not left at the top of the page.
  useEffect(() => {
    if (status.state === 'done') doneRef.current?.focus();
  }, [status.state]);

  const set = (key) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((found) => {
      if (!found[key]) return found;
      const { [key]: _fixed, ...rest } = found;
      return rest;
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validateWaitlist(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus({ state: 'sending', message: '' });
    try {
      const { already } = await joinWaitlist(form);
      setStatus({ state: 'done', message: already ? ALREADY : DONE });
      setForm(EMPTY);
    } catch (error) {
      setStatus({ state: 'error', message: error.message });
    }
  };

  const field = (key) => ({
    id: `wl-${key}`,
    value: form[key],
    onChange: set(key),
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `wl-${key}-error` : undefined,
    disabled: status.state === 'sending',
  });

  return (
    <section id="waitlist" className="section waitlist" aria-labelledby="waitlist-title">
      <div className="wrap waitlist__card card--stitch" data-reveal>
        <div className="waitlist__copy">
          <p className="kicker">Waitlist</p>
          <h2 id="waitlist-title">{WAITLIST.title}</h2>
          <p className="section__lead">{WAITLIST.lead}</p>
          <p className="waitlist__or">
            Ready now? <a href={SIGN_UP_URL}>Start free during the pilot</a>.
          </p>
        </div>
        {status.state === 'done' ? (
          <p className="notice notice--ok" role="status" tabIndex={-1} ref={doneRef}>
            {status.message}
          </p>
        ) : (
          <form className="waitlist__form" onSubmit={submit} noValidate aria-describedby="wl-consent">
            <div className="field">
              <label htmlFor="wl-email">Email</label>
              <input type="email" autoComplete="email" inputMode="email" required {...field('email')} />
              {errors.email && (
                <p className="field__error" id="wl-email-error">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="field__row">
              <div className="field">
                <label htmlFor="wl-name">
                  Your name <span className="optional">(optional)</span>
                </label>
                <input type="text" autoComplete="name" maxLength={80} {...field('name')} />
                {errors.name && (
                  <p className="field__error" id="wl-name-error">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="wl-business">
                  Business <span className="optional">(optional)</span>
                </label>
                <input type="text" autoComplete="organization" maxLength={120} {...field('business')} />
                {errors.business && (
                  <p className="field__error" id="wl-business-error">
                    {errors.business}
                  </p>
                )}
              </div>
            </div>
            <div className="field">
              <label htmlFor="wl-country">Where is your business?</label>
              <select {...field('country')}>
                <option value="">Choose one</option>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="field__error" id="wl-country-error">
                  {errors.country}
                </p>
              )}
            </div>
            {/* Left empty by people (hidden from view and from screen readers); bots fill it. */}
            <div className="hp" aria-hidden="true">
              <label htmlFor="wl-website">Website</label>
              <input type="text" id="wl-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
            </div>
            {status.state === 'error' && (
              <p className="notice notice--error" role="alert">
                {status.message}
              </p>
            )}
            <button type="submit" className="button button--primary button--block" disabled={status.state === 'sending'}>
              {status.state === 'sending' ? 'Joining…' : 'Join the waitlist'}
            </button>
            <p className="waitlist__consent" id="wl-consent">
              {WAITLIST.consent} <a href="/privacy">How we use it</a>.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Mark />
          <p>Run your tailoring business from one place.</p>
          <a className="button button--primary button--small" href={SIGN_UP_URL}>
            Start free
          </a>
        </div>
        <nav aria-label="Product" className="footer__col">
          <p className="footer__title">Product</p>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/guides">Guides</a>
          <a href="/#faq">FAQ</a>
          <a href={SIGN_IN_URL}>Sign in</a>
        </nav>
        <nav aria-label="Who it is for" className="footer__col">
          <p className="footer__title">Who it is for</p>
          {AUDIENCE.map((a) => (
            <a key={a.href} href={a.href}>
              {a.label}
            </a>
          ))}
        </nav>
        <nav aria-label="Legal" className="footer__col">
          <p className="footer__title">Legal</p>
          <a href={LEGAL.terms}>Terms of Service</a>
          <a href={LEGAL.dpa}>Data Processing Agreement</a>
          <a href={LEGAL.privacy}>App Privacy Notice</a>
          <a href="/privacy">Website privacy</a>
        </nav>
        <div className="footer__col">
          <p className="footer__title">Contact</p>
          <a href="/about">About Threadé</a>
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          <a href={`mailto:${TEAM_EMAIL}`}>{TEAM_EMAIL}</a>
        </div>
      </div>
      <div className="wrap footer__base">
        <p suppressHydrationWarning>
          © {year} Threadé. {FOOTER.line}
        </p>
        <p>Screens show sample data.</p>
      </div>
    </footer>
  );
}
