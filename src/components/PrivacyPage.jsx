import { useEffect } from 'react';
import { LEGAL, TEAM_EMAIL } from '../content';

// The website's own privacy note: the waitlist form only. The app has its own Privacy Notice.
export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Website privacy: Threadé';
  }, []);
  return (
    <main id="main" className="section prose-page">
      <div className="wrap prose">
        <p className="kicker">Website privacy</p>
        <h1>How this website uses your details</h1>
        <p className="muted">In force from 15 October 2026.</p>

        <h2>Who we are</h2>
        <p>
          Dan Aremu, a sole trader trading as Threadé. Business address: not provided yet. Questions and requests about your
          details: <a href={`mailto:${TEAM_EMAIL}`}>{TEAM_EMAIL}</a>.
        </p>

        <h2>What we collect</h2>
        <p>
          Only what you type into the waitlist form: your email, and if you give them, your name, your business name and
          where your business is. This website sets no cookies, has no analytics and no adverts, and loads nothing from other
          companies.
        </p>

        <h2>Why</h2>
        <p>To tell you when Threadé opens to everyone, with prices and offers for the launch. Nothing else. We never sell or share your details.</p>

        <h2>Where it is kept</h2>
        <p>On servers of Supabase in the European Union (Ireland), outside Nigeria and the UK. The website itself is served by Vercel. Both are US companies.</p>

        <h2>How long</h2>
        <p>Until you ask us to remove you, or until we close the waitlist, whichever comes first.</p>

        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or remove your details at any time: email <a href={`mailto:${TEAM_EMAIL}`}>{TEAM_EMAIL}</a>.
          In Nigeria you can complain to the Nigeria Data Protection Commission; in the UK, to the Information Commissioner’s Office.
        </p>

        <h2>Using the app</h2>
        <p>
          The Threadé app has its own <a href={LEGAL.privacy}>Privacy Notice</a>, <a href={LEGAL.terms}>Terms of Service</a> and{' '}
          <a href={LEGAL.dpa}>Data Processing Agreement</a>.
        </p>
        <p>
          <a href="/" className="button button--ghost">
            Back to the home page
          </a>
        </p>
      </div>
    </main>
  );
}
