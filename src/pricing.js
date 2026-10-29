/**
 * Public prices for the four plans (plan-2026-10-28, section 2; built
 * 2026-11 in migration 20261109000000_four_tiers.sql).
 *
 * A business is billed in one currency: naira through Paystack in Nigeria,
 * pounds through Stripe in the United Kingdom, dollars through Stripe
 * everywhere else. The site shows the price for the visitor's country and
 * lets them switch, because the country a visitor is in is a guess and the
 * price they will be charged is not.
 */
import { CURRENCY_COUNTRIES, DEFAULT_CURRENCY, currencyForCountry } from './pricing-country';

export const CURRENCIES = Object.freeze({
  NGN: { code: 'NGN', symbol: '₦', label: 'Naira', countries: CURRENCY_COUNTRIES.NGN },
  GBP: { code: 'GBP', symbol: '£', label: 'Pounds', countries: CURRENCY_COUNTRIES.GBP },
  USD: { code: 'USD', symbol: '$', label: 'Dollars', countries: CURRENCY_COUNTRIES.USD },
});

export const CURRENCY_CODES = Object.freeze(Object.keys(CURRENCIES));
export { DEFAULT_CURRENCY, currencyForCountry };

/** Minor units are not needed here: these are whole published prices. */
const PRICES = Object.freeze({
  free: { NGN: 0, GBP: 0, USD: 0 },
  starter: { NGN: 1500, GBP: 2.99, USD: 3.99 },
  pro: { NGN: 6000, GBP: 5.99, USD: 7.99 },
  business: { NGN: 12000, GBP: 11.99, USD: 14.99 },
});

/** Yearly is ten months' worth: two months free. */
export const YEARLY_MONTHS_CHARGED = 10;

const amount = (value, currency) =>
  currency === 'NGN' ? value.toLocaleString('en-NG') : value.toFixed(2);

/** "₦1,500" or "$3.99". Free is "Nothing to pay", which is a price, not a blank. */
export function priceText(planKey, currency = DEFAULT_CURRENCY) {
  const row = PRICES[planKey];
  const code = CURRENCIES[currency] ? currency : DEFAULT_CURRENCY;
  if (!row) return '';
  if (!row[code]) return 'Nothing to pay';
  return `${CURRENCIES[code].symbol}${amount(row[code], code)}`;
}

/** The line under the price: "a month, or ₦15,000 a year" / "No card needed". */
export function priceNote(planKey, currency = DEFAULT_CURRENCY) {
  const row = PRICES[planKey];
  const code = CURRENCIES[currency] ? currency : DEFAULT_CURRENCY;
  if (!row || !row[code]) return 'No card needed';
  const yearly = row[code] * YEARLY_MONTHS_CHARGED;
  return `a month, or ${CURRENCIES[code].symbol}${amount(yearly, code)} a year`;
}

/** Dollar amounts, for structured data, which carries one currency. */
export const usdPrice = (planKey) => PRICES[planKey].USD.toFixed(2);
