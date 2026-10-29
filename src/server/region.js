/**
 * GET /api/region. Tells the pricing page which currency to show first.
 *
 * Vercel puts the visitor's country in `x-vercel-ip-country`. Nothing is
 * stored and nothing identifies the visitor: the response is a two-letter
 * country and a currency code, and the page lets anyone switch currency.
 */
const { currencyForCountry } = require('../pricing-country');

function handleRegion(req, res, { headers } = {}) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    return res.end(JSON.stringify({ error: 'Use GET.' }));
  }
  const source = headers ?? req.headers ?? {};
  // Vercel sets this header and overwrites anything a client sends, but the
  // function answers on its own address too, where the header is whatever the
  // caller wrote. Only a two-letter country code is ever echoed back.
  const claimed = String(source['x-vercel-ip-country'] ?? '').trim().toUpperCase();
  const country = /^[A-Z]{2}$/.test(claimed) ? claimed : '';
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify({ country: country || null, currency: currencyForCountry(country) }));
}

module.exports = { handleRegion };
