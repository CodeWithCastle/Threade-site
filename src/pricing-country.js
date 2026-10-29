/**
 * The country-to-currency rule on its own, in CommonJS, so the Vercel
 * function (`src/server/region.js`) and the React app (`src/pricing.js`)
 * cannot drift apart. Keep the lists here the only copy.
 */
const CURRENCY_COUNTRIES = { NGN: ['NG'], GBP: ['GB'], USD: [] };
const DEFAULT_CURRENCY = 'USD';

function currencyForCountry(country) {
  const code = String(country ?? '').trim().toUpperCase();
  const found = Object.keys(CURRENCY_COUNTRIES).find((key) => CURRENCY_COUNTRIES[key].includes(code));
  return found ?? DEFAULT_CURRENCY;
}

module.exports = { CURRENCY_COUNTRIES, DEFAULT_CURRENCY, currencyForCountry };
