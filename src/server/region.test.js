const { handleRegion } = require('./region');

const res = () => {
  const out = { statusCode: 0, headers: {}, body: '' };
  return {
    out,
    set statusCode(v) {
      out.statusCode = v;
    },
    get statusCode() {
      return out.statusCode;
    },
    setHeader: (k, v) => {
      out.headers[k] = v;
    },
    end: (b) => {
      out.body = b;
      return out;
    },
  };
};

const get = (headers) => {
  const r = res();
  handleRegion({ method: 'GET', headers }, r);
  return { ...r.out, json: JSON.parse(r.out.body) };
};

describe('GET /api/region', () => {
  it('bills Nigeria in naira', () => {
    expect(get({ 'x-vercel-ip-country': 'NG' }).json).toEqual({ country: 'NG', currency: 'NGN' });
  });

  it('bills the United Kingdom in pounds', () => {
    expect(get({ 'x-vercel-ip-country': 'gb' }).json).toEqual({ country: 'GB', currency: 'GBP' });
  });

  it('bills everywhere else in dollars', () => {
    expect(get({ 'x-vercel-ip-country': 'KE' }).json).toEqual({ country: 'KE', currency: 'USD' });
    expect(get({ 'x-vercel-ip-country': 'US' }).json).toEqual({ country: 'US', currency: 'USD' });
  });

  it('falls back to dollars when the header is missing, and stores nothing else about the visitor', () => {
    const answer = get({});
    expect(answer.json).toEqual({ country: null, currency: 'USD' });
    expect(Object.keys(answer.json)).toEqual(['country', 'currency']);
    expect(answer.headers['Cache-Control']).toBe('no-store');
  });

  it('refuses anything but GET', () => {
    const r = res();
    handleRegion({ method: 'POST', headers: {} }, r);
    expect(r.out.statusCode).toBe(405);
  });
});
