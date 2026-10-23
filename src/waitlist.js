// The waitlist form: checks what was typed and posts it to this site's own server function
// (api/waitlist.js, logic in src/server/waitlist.js). The pages hold no Supabase address or key.
import { TEAM_EMAIL, WAITLIST } from './content';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ENDPOINT = '/api/waitlist';

export const NOT_CONNECTED = `The waitlist is not open yet. Email ${TEAM_EMAIL} and we will add you.`;
export const OFFLINE = 'You are offline. Connect to the internet and try again.';
export const FAILED = `Something went wrong. Try again, or email ${TEAM_EMAIL}.`;
export const DONE = WAITLIST.done;
export const ALREADY = WAITLIST.already;

// The server answers with a code; the words are ours. Anything else is FAILED (never the server's text).
export const REFUSALS = {
  invalid_email: 'Enter an email like name@example.com.',
  invalid_country: 'Choose where your business is.',
  invalid_name: 'Keep your name under 80 characters.',
  invalid_business: 'Keep the business name under 120 characters.',
  rate_limited: 'Too many sign-ups right now. Try again in a minute.',
  not_configured: NOT_CONNECTED,
};

/** Checks the form: { field: message } for each problem. */
export function validateWaitlist({ email, name, business, country }) {
  const errors = {};
  const e = (email ?? '').trim();
  if (!e) errors.email = 'Enter your email.';
  else if (e.length > 254 || !EMAIL.test(e)) errors.email = 'Enter an email like name@example.com.';
  if ((name ?? '').trim().length > 80) errors.name = 'Keep your name under 80 characters.';
  if ((business ?? '').trim().length > 120) errors.business = 'Keep the business name under 120 characters.';
  if (!country) errors.country = 'Choose where your business is.';
  return errors;
}

/**
 * Sends the form. Resolves { already } when saved (or already on the list); throws an Error with a
 * message for people otherwise. `website` is the hidden field only bots fill: then nothing is sent
 * and the answer looks the same as a success.
 */
export async function joinWaitlist({ email, name, business, country, website }, { fetchImpl = (...args) => fetch(...args) } = {}) {
  if ((website ?? '').trim()) return { already: false };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new Error(OFFLINE);
  let response;
  try {
    response = await fetchImpl(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: (email ?? '').trim(),
        name: (name ?? '').trim() || null,
        business: (business ?? '').trim() || null,
        country,
      }),
    });
  } catch {
    throw new Error(FAILED);
  }
  let body = null;
  try {
    body = await response.json();
  } catch {
    // no body
  }
  if (response.ok && body?.ok === true) return { already: body.already === true };
  const code = body?.error;
  throw new Error(typeof code === 'string' && Object.prototype.hasOwnProperty.call(REFUSALS, code) ? REFUSALS[code] : FAILED);
}
