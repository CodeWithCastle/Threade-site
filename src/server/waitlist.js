// The waitlist's server side: POST /api/waitlist (api/waitlist.js calls handleWaitlist).
// Runs on Vercel only. Never imported by the pages, so none of this, nor the values it reads, is in
// the browser bundle (scripts/check-build.js proves it after every build).
//
// It checks what was typed, drops what a bot filled into the hidden field, turns the visitor's IP
// address into a keyed hash (HMAC-SHA256 with WAITLIST_IP_SALT; the address itself is never stored
// or sent on), and calls the database function join_waitlist_v2 with the publishable key in the
// apikey header and the proxy secret. Answers carry codes only, never the database's own text.
const crypto = require('crypto');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRIES = ['NG', 'GB', 'OTHER'];
const TIMEOUT_MS = 8000;
// Database refusals the site explains in its own words (src/waitlist.js); anything else is "failed".
const KNOWN = { invalid_email: 400, invalid_country: 400, invalid_name: 400, invalid_business: 400, rate_limited: 429, not_configured: 503 };

/** The server-only settings, or null when one is missing (the waitlist is then "not open yet"). */
function settings(env) {
  const url = String(env.THREADE_SUPABASE_URL ?? '').trim().replace(/\/+$/, '');
  const key = String(env.THREADE_SUPABASE_PUBLISHABLE_KEY ?? '').trim();
  const secret = String(env.WAITLIST_PROXY_SECRET ?? '').trim();
  const salt = String(env.WAITLIST_IP_SALT ?? '').trim();
  if (!/^https:\/\/[^/]+$/.test(url) || !key || secret.length < 32 || salt.length < 16) return null;
  return { url, key, secret, salt };
}

const text = (value) => (value === undefined || value === null ? '' : value);

/** { error } for the first problem, or { form } with the cleaned values. */
function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'bad_request' };
  const fields = ['email', 'name', 'business', 'country', 'website'];
  if (fields.some((f) => typeof text(body[f]) !== 'string')) return { error: 'bad_request' };
  const email = text(body.email).trim().toLowerCase();
  const name = text(body.name).trim();
  const business = text(body.business).trim();
  const country = text(body.country).trim();
  if (email.length < 3 || email.length > 254 || !EMAIL.test(email)) return { error: 'invalid_email' };
  if (!COUNTRIES.includes(country)) return { error: 'invalid_country' };
  if (name.length > 80) return { error: 'invalid_name' };
  if (business.length > 120) return { error: 'invalid_business' };
  return { form: { email, name: name || null, business: business || null, country }, honeypot: text(body.website).trim() !== '' };
}

/** The visitor's address as Vercel gives it: x-real-ip, else the first x-forwarded-for entry. */
function clientIp(headers) {
  const real = String(headers['x-real-ip'] ?? '').trim();
  if (real) return real;
  const forwarded = String(headers['x-forwarded-for'] ?? '').split(',')[0].trim();
  return forwarded || 'unknown';
}

/** 64 hex characters: HMAC-SHA256 of the address with the salt. The address is not kept. */
const clientKey = (ip, salt) => crypto.createHmac('sha256', salt).update(ip).digest('hex');

// Only this site's own pages may post (a browser always sends Origin with a POST).
function sameOrigin(headers) {
  const origin = headers.origin;
  if (!origin) return true;
  try {
    const host = String(headers['x-forwarded-host'] ?? headers.host ?? '').split(',')[0].trim().toLowerCase();
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body !== undefined && typeof req.body !== 'string' && !Buffer.isBuffer(req.body)) return req.body;
  let raw = req.body;
  if (raw === undefined) {
    raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 4096) throw new Error('too_large');
    }
  }
  raw = String(raw);
  if (raw.length > 4096) throw new Error('too_large');
  return JSON.parse(raw);
}

/** The handler: (req, res, { env, fetchImpl }). */
async function handleWaitlist(req, res, { env = {}, fetchImpl = (...args) => fetch(...args) } = {}) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  const headers = req.headers ?? {};
  if (!/^application\/json\b/i.test(String(headers['content-type'] ?? ''))) return send(res, 415, { ok: false, error: 'bad_request' });
  if (!sameOrigin(headers)) return send(res, 403, { ok: false, error: 'forbidden' });
  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { ok: false, error: 'bad_request' });
  }
  const checked = validate(body);
  if (checked.error) return send(res, 400, { ok: false, error: checked.error });
  // A bot filled the hidden field: answer as if it worked, save nothing.
  if (checked.honeypot) return send(res, 200, { ok: true, already: false });
  const config = settings(env);
  if (!config) return send(res, 503, { ok: false, error: 'not_configured' });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response;
  try {
    response = await fetchImpl(`${config.url}/rest/v1/rpc/join_waitlist_v2`, {
      method: 'POST',
      // The publishable key goes in apikey only (it is not a JWT, so no Authorization header).
      headers: { 'Content-Type': 'application/json', apikey: config.key },
      body: JSON.stringify({
        p_email: checked.form.email,
        p_name: checked.form.name,
        p_business: checked.form.business,
        p_country: checked.form.country,
        p_client_key: clientKey(clientIp(headers), config.salt),
        p_proxy_secret: config.secret,
      }),
      signal: controller.signal,
    });
  } catch {
    return send(res, 502, { ok: false, error: 'failed' });
  } finally {
    clearTimeout(timer);
  }
  let data = null;
  try {
    data = await response.json();
  } catch {
    // no body
  }
  if (response.ok) return send(res, 200, { ok: true, already: data?.already === true });
  const code = data?.code === 'P0001' ? data.details : null;
  if (code && KNOWN[code]) return send(res, KNOWN[code], { ok: false, error: code });
  // Unexpected (wrong secret, missing function, server error): no details to the browser.
  return send(res, 502, { ok: false, error: 'failed' });
}

module.exports = { handleWaitlist, validate, clientIp, clientKey, settings, sameOrigin };
