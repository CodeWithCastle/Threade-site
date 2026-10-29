import { useCallback, useEffect, useState } from 'react';
import { CURRENCY_CODES, DEFAULT_CURRENCY } from './pricing';

const KEY = 'threade.currency';

const saved = () => {
  try {
    const value = window.localStorage.getItem(KEY);
    return CURRENCY_CODES.includes(value) ? value : null;
  } catch {
    return null; // private window, or storage turned off
  }
};

/**
 * Which currency the prices are shown in: the visitor's own choice if they
 * made one, otherwise the one their country bills in (/api/region), and
 * dollars until that answers or if it never does.
 */
export default function useCurrency() {
  const [chosen, setChosen] = useState(saved);
  const [guessed, setGuessed] = useState(null);

  useEffect(() => {
    if (chosen || typeof window.fetch !== 'function') return undefined;
    let live = true;
    window
      .fetch('/api/region')
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (live && body && CURRENCY_CODES.includes(body.currency)) setGuessed(body.currency);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [chosen]);

  const choose = useCallback((next) => {
    if (!CURRENCY_CODES.includes(next)) return;
    setChosen(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Nothing to remember it with; the choice still holds for this visit.
    }
  }, []);

  return [chosen ?? guessed ?? DEFAULT_CURRENCY, choose];
}
