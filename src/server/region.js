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
  const country = String(source['x-vercel-ip-country'] ?? '').trim().toUpperCase();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify({ country: country || null, currency: currencyForCountry(country) }));
}

module.exports = { handleRegion };
