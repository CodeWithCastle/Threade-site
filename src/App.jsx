import { useEffect } from 'react';
import { AboutTeaser, Always, Audience, Faq, Features, Fit, GuidesTeaser, Hero, How, Plans, Segments, Showcase, Workflow } from './components/Sections';
import { Footer, Nav, Waitlist } from './components/Frame';
import { AboutPage, FaqPage, FeaturesPage, GuidePage, GuidesPage, NotFoundPage, PricingPage, SegmentPage } from './components/Pages';
import PrivacyPage from './components/PrivacyPage';
import { pageFor } from './pages';
import useReveal from './useReveal';

function Home() {
  return (
    <main id="main">
      <Hero />
      <Audience />
      <Features />
      <Workflow />
      <Showcase />
      <Segments />
      <Fit />
      <Always />
      <How />
      <Plans />
      <AboutTeaser />
      <GuidesTeaser />
      <Faq />
      <Waitlist />
    </main>
  );
}

function Body({ page }) {
  switch (page.kind) {
    case 'home':
      return <Home />;
    case 'features':
      return <FeaturesPage />;
    case 'segment':
      return <SegmentPage segment={page.segment} crumb={page.crumb} />;
    case 'pricing':
      return <PricingPage />;
    case 'about':
      return <AboutPage />;
    case 'faq':
      return <FaqPage />;
    case 'guides':
      return <GuidesPage />;
    case 'guide':
      return <GuidePage slug={page.guide} />;
    case 'privacy':
      return <PrivacyPage />;
    default:
      return <NotFoundPage />;
  }
}

// One component per page in src/pages.js. Each page is prerendered to its own HTML file at
// build time (scripts/prerender.js), then React takes over in the browser.
export default function App({ path = window.location.pathname }) {
  const page = pageFor(path);
  useReveal([page.path]);
  // The prerendered HTML already has the title; this keeps it right in `npm start`.
  useEffect(() => {
    document.title = page.title;
  }, [page.title]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <Body page={page} />
      <Footer />
    </>
  );
}
