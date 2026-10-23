/**
 * @jest-environment node
 */
// The waitlist's server function (api/waitlist.js -> handleWaitlist), run as Vercel would.
const crypto = require('crypto');
const { handleWaitlist, clientIp, clientKey, validate } = require('./waitlist');

const ENV = {
  THREADE_SUPABASE_URL: 'https://abcdefghij.supabase.co/',
  THREADE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test-key',
  WAITLIST_PROXY_SECRET: 'p'.repeat(40),
  WAITLIST_IP_SALT: 's'.repeat(24),
};

function request({ method = 'POST', body = { email: ' Ada@Example.com ', country: 'NG' }, headers = {} } = {}) {
  return {
    method,
    body,
    headers: { 'content-type': 'application/json', host: 'www.threade.app', origin: 'https://www.threade.app', 'x-real-ip': '203.0.113.7', ...headers },
  };
}
function response() {
  const res = { statusCode: 0, headers: {}, body: null };
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  res.end = (text) => { res.body = JSON.parse(text); };
  return res;
}
const database = (status, body) => jest.fn().mockResolvedValue({ ok: status < 300, status, json: async () => body });

async function call(req, { env = ENV, fetchImpl = database(200, { ok: true, already: false }) } = {}) {
  const res = response();
  await handleWaitlist(req, res, { env, fetchImpl });
  return { res, fetchImpl };
}

describe('server function: the call to the database', () => {
  it('sends the checked form, a keyed hash of the IP address and the proxy secret, with the publishable key in apikey only', async () => {
    const { res, fetchImpl } = await call(request({ body: { email: ' Ada@Example.com ', name: ' Ada ', business: '', country: 'NG' } }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, already: false });
    expect(res.headers['cache-control']).toBe('no-store');
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://abcdefghij.supabase.co/rest/v1/rpc/join_waitlist_v2');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json', apikey: 'sb_publishable_test-key' });
    const sent = JSON.parse(init.body);
    const expectedKey = crypto.createHmac('sha256', ENV.WAITLIST_IP_SALT).update('203.0.113.7').digest('hex');
    expect(sent).toEqual({ p_email: 'ada@example.com', p_name: 'Ada', p_business: null, p_country: 'NG', p_client_key: expectedKey, p_proxy_secret: ENV.WAITLIST_PROXY_SECRET });
    expect(sent.p_client_key).toMatch(/^[0-9a-f]{64}$/);
    expect(init.body).not.toContain('203.0.113.7');
  });

  it('says when the email is already on the list', async () => {
    const { res } = await call(request(), { fetchImpl: database(200, { ok: true, already: true }) });
    expect(res.body).toEqual({ ok: true, already: true });
  });

  it('takes the address from x-real-ip, else the first x-forwarded-for', () => {
    expect(clientIp({ 'x-real-ip': '198.51.100.1', 'x-forwarded-for': '10.0.0.1' })).toBe('198.51.100.1');
    expect(clientIp({ 'x-forwarded-for': ' 198.51.100.2 , 10.0.0.1' })).toBe('198.51.100.2');
    expect(clientIp({})).toBe('unknown');
    expect(clientKey('198.51.100.1', 'salt-a')).not.toBe(clientKey('198.51.100.1', 'salt-b'));
  });
});

describe('server function: what it refuses', () => {
  it('only POST with JSON from this site', async () => {
    expect((await call(request({ method: 'GET' }))).res.statusCode).toBe(405);
    expect((await call(request({ headers: { 'content-type': 'text/plain' } }))).res.statusCode).toBe(415);
    const other = await call(request({ headers: { origin: 'https://evil.example' } }));
    expect(other.res.statusCode).toBe(403);
    expect(other.fetchImpl).not.toHaveBeenCalled();
  });

  it('checks every field before calling the database', async () => {
    expect(validate({ email: 'nope', country: 'NG' })).toEqual({ error: 'invalid_email' });
    expect(validate({ email: 'a@b.co', country: 'FR' })).toEqual({ error: 'invalid_country' });
    expect(validate({ email: 'a@b.co', country: 'NG', name: 'x'.repeat(81) })).toEqual({ error: 'invalid_name' });
    expect(validate({ email: 'a@b.co', country: 'NG', business: 'x'.repeat(121) })).toEqual({ error: 'invalid_business' });
    expect(validate({ email: ['a@b.co'], country: 'NG' })).toEqual({ error: 'bad_request' });
    expect(validate(null)).toEqual({ error: 'bad_request' });
    const { res, fetchImpl } = await call(request({ body: { email: 'nope', country: 'NG' } }));
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ ok: false, error: 'invalid_email' });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect((await call(request({ body: '{not json' }))).res.statusCode).toBe(400);
  });

  it('a filled hidden field looks like success and saves nothing', async () => {
    const { res, fetchImpl } = await call(request({ body: { email: 'bot@example.com', country: 'NG', website: 'https://spam.example' } }));
    expect(res.body).toEqual({ ok: true, already: false });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('is not open until every server setting is there', async () => {
    for (const missing of Object.keys(ENV)) {
      const { res, fetchImpl } = await call(request(), { env: { ...ENV, [missing]: '' } });
      expect(res.statusCode).toBe(503);
      expect(res.body).toEqual({ ok: false, error: 'not_configured' });
      expect(fetchImpl).not.toHaveBeenCalled();
    }
    expect((await call(request(), { env: { ...ENV, WAITLIST_PROXY_SECRET: 'short' } })).res.body.error).toBe('not_configured');
  });

  it('passes on known refusal codes only, never the database text', async () => {
    const refusal = (details, message = 'Some database text.') => database(400, { code: 'P0001', message, details });
    expect((await call(request(), { fetchImpl: refusal('rate_limited') })).res).toMatchObject({ statusCode: 429, body: { ok: false, error: 'rate_limited' } });
    expect((await call(request(), { fetchImpl: refusal('invalid_email') })).res.body).toEqual({ ok: false, error: 'invalid_email' });
    expect((await call(request(), { fetchImpl: refusal('not_configured') })).res.statusCode).toBe(503);
    const notAllowed = await call(request(), { fetchImpl: refusal('not_allowed', 'This request is not allowed.') });
    expect(notAllowed.res).toMatchObject({ statusCode: 502, body: { ok: false, error: 'failed' } });
    const missing = await call(request(), { fetchImpl: database(404, { code: 'PGRST202', message: 'Could not find the function public.join_waitlist_v2' }) });
    expect(missing.res.body).toEqual({ ok: false, error: 'failed' });
    expect(JSON.stringify(missing.res.body)).not.toContain('join_waitlist');
    const down = await call(request(), { fetchImpl: jest.fn().mockRejectedValue(new Error('connect ECONNREFUSED')) });
    expect(down.res).toMatchObject({ statusCode: 502, body: { ok: false, error: 'failed' } });
  });
});
