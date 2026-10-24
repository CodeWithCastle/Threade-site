import { useEffect } from 'react';

// Fades [data-reveal] elements in as they scroll into view. The HTML shows everything (for
// people without JavaScript and for search engines); only elements still below the screen
// when the page starts are hidden, then shown as they arrive. With reduced motion or no
// IntersectionObserver, nothing is hidden.
export default function useReveal(deps = []) {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') return undefined;
    const below = (node) => node.getBoundingClientRect().top > window.innerHeight;
    const nodes = Array.from(document.querySelectorAll('[data-reveal]:not(.is-visible)')).filter(below);
    nodes.forEach((n) => n.classList.add('reveal-pending'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            entry.target.classList.remove('reveal-pending');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => {
      io.disconnect();
      nodes.forEach((n) => n.classList.remove('reveal-pending'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
