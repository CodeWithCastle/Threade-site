import { currencyForCountry, priceNote, priceText, usdPrice } from './pricing';

// The published prices (plan-2026-10-28 section 2). A change here is a price change.
describe('published prices', () => {
  it('shows naira, pounds or dollars by plan', () => {
    expect(['free', 'starter', 'pro', 'business'].map((k) => priceText(k, 'NGN'))).toEqual([
      'Nothing to pay',
      '₦1,500',
      '₦6,000',
      '₦12,000',
    ]);
    expect(['starter', 'pro', 'business'].map((k) => priceText(k, 'USD'))).toEqual(['$3.99', '$7.99', '$14.99']);
    expect(['starter', 'pro', 'business'].map((k) => priceText(k, 'GBP'))).toEqual(['£2.99', '£5.99', '£11.99']);
  });

  it('says a year costs ten months, and that Free needs no card', () => {
    expect(priceNote('starter', 'NGN')).toBe('a month, or ₦15,000 a year');
    expect(priceNote('business', 'USD')).toBe('a month, or $149.90 a year');
    expect(priceNote('free', 'NGN')).toBe('No card needed');
  });

  it('bills Nigeria in naira, the United Kingdom in pounds and everywhere else in dollars', () => {
    expect(currencyForCountry('NG')).toBe('NGN');
    expect(currencyForCountry('gb')).toBe('GBP');
    expect(currencyForCountry('GH')).toBe('USD');
    expect(currencyForCountry(undefined)).toBe('USD');
  });

  it('falls back to dollars for a currency it does not know', () => {
    expect(priceText('pro', 'EUR')).toBe('$7.99');
    expect(usdPrice('pro')).toBe('7.99');
  });
});
