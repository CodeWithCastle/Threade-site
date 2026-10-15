// The waitlist form: checks what was typed and sends it to the database function
// public.join_waitlist (application-threade-business migration 20261103000000_site_waitlist).
import { TEAM_EMAIL } from './content';

const env = (key) => (process.env[key] ?? '').trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NOT_CONNECTED = `The waitlist is not open yet. Email ${TEAM_EMAIL} and we will add you.`;
export const OFFLINE = 'You are offline. Connect to the internet and try again.';
export const FAILED = `Something went wrong. Try again, or email ${TEAM_EMAIL}.`;

export const waitlistReady = () => Boolean(env('REACT_APP_SUPABASE_URL') && env('REACT_APP_SUPABASE_ANON_KEY'));

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

/** Sends the form. Resolves when saved; throws an Error with a message for people otherwise. */
export async function joinWaitlist({ email, name, business, country }, { fetchImpl = fetch } = {}) {
  if (!waitlistReady()) throw new Error(NOT_CONNECTED);
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new Error(OFFLINE);
  const url = `${env('REACT_APP_SUPABASE_URL').replace(/\/+$/, '')}/rest/v1/rpc/join_waitlist`;
  const key = env('REACT_APP_SUPABASE_ANON_KEY');
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        p_email: email.trim(),
        p_name: (name ?? '').trim() || null,
        p_business: (business ?? '').trim() || null,
        p_country: country,
      }),
    });
  } catch {
    throw new Error(FAILED);
  }
  if (response.ok) return true;
  let body = null;
  try {
    body = await response.json();
  } catch {
    // no body
  }
  // The database explains a refusal in plain words (code P0001); anything else is unexpected.
  if (body?.code === 'P0001' && body.message) throw new Error(body.message);
  throw new Error(FAILED);
}
