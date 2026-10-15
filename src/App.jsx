import { Always, Audience, Faq, Features, Hero, How, Plans, Showcase } from './components/Sections';
import { Footer, Nav, Waitlist } from './components/Frame';
import PrivacyPage from './components/PrivacyPage';
import useReveal from './useReveal';

// Two pages: the home page and /privacy. Any other address shows the home page.
export default function App({ path = window.location.pathname }) {
  const privacy = path.replace(/\/+$/, '') === '/privacy';
  useReveal([privacy]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      {privacy ? (
        <PrivacyPage />
      ) : (
        <main id="main">
          <Hero />
          <Audience />
          <Features />
          <Showcase />
          <Always />
          <How />
          <Plans />
          <Faq />
          <Waitlist />
        </main>
      )}
      <Footer />
    </>
  );
}
