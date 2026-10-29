import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { joinWaitlist, validateWaitlist, FAILED, NOT_CONNECTED } from './waitlist';
import { FEATURES, PLANS } from './content';

const env = { ...process.env };
const realFetch = global.fetch;
afterEach(() => {
  process.env = { ...env };
  global.fetch = realFetch;
  jest.restoreAllMocks();
});

describe('home page', () => {
  it('leads with the promise and sends Start free to the app sign-up', () => {
    render(<App path="/" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Run your shop or business from one app.');
    const start = screen.getAllByRole('link', { name: 'Start free' });
    expect(start.length).toBeGreaterThan(1);
    start.forEach((link) => expect(link).toHaveAttribute('href', 'https://app.threade.app/signup'));
    screen.getAllByRole('link', { name: 'Sign in' }).forEach((link) => expect(link).toHaveAttribute('href', 'https://app.threade.app/signin'));
  });

  it('shows every feature as a tab and switches with clicks and arrow keys', async () => {
    render(<App path="/" />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(FEATURES.length);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent(FEATURES[2].body);
    await userEvent.keyboard('{ArrowDown}');
    expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[3]).toHaveFocus();
  });

  it('shows the four plans at their published prices, in the currency the visitor picks', async () => {
    render(<App path="/" />);
    PLANS.forEach((p) => expect(screen.getByRole('heading', { name: p.name, level: 3 })).toBeInTheDocument());
    const plans = screen.getByRole('region', { name: 'Start free. Grow when you are ready.' });
    expect(plans).toHaveTextContent('Nothing to pay');
    expect(plans).toHaveTextContent('$3.99');
    expect(plans).toHaveTextContent('$14.99');
    expect(plans).not.toHaveTextContent(/₦\d|£\d/);

    await userEvent.click(within(plans).getByRole('radio', { name: 'Naira (₦)' }));
    expect(plans).toHaveTextContent('₦1,500');
    expect(plans).toHaveTextContent('₦12,000');
    expect(plans).not.toHaveTextContent(/\$\d/);
  });

  it('links the official legal documents in the app and the website privacy page', () => {
    render(<App path="/" />);
    const legal = screen.getByRole('navigation', { name: 'Legal' });
    expect(within(legal).getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', 'https://app.threade.app/legal/terms');
    expect(within(legal).getByRole('link', { name: 'Website privacy' })).toHaveAttribute('href', '/privacy');
  });

  it('shows the Threadé wordmark and says "team" for a business’s people ("staff" is Threadé’s own)', () => {
    const { container } = render(<App path="/" />);
    const home = screen.getByRole('link', { name: 'Threadé home' });
    expect(home).toHaveTextContent('Threadé');
    // The logo before the name is the business app's icon (founder request 2026-10-24).
    expect(within(home).getByRole('presentation', { hidden: true })).toHaveAttribute('src', '/logo192.png');
    const { textContent } = container;
    expect(textContent.replace(/Threadé staff/g, '')).not.toMatch(/\bstaff\b/i);
  });

  it('says nothing about drafts or counsel', () => {
    const { container } = render(<App path="/" />);
    expect(container.textContent).not.toMatch(/draft|counsel|lawyer|—/i);
  });
});

describe('waitlist', () => {
  const answer = (status, body) => jest.fn().mockResolvedValue({ ok: status < 300, status, json: async () => body });
  const fill = async () => {
    await userEvent.type(screen.getByLabelText('Email'), ' ada@example.com ');
    await userEvent.selectOptions(screen.getByLabelText('Where is your business?'), 'NG');
    // The answer arrives after the click (a promise): let React finish inside act.
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: 'Join the waitlist' }));
    });
  };

  it('clears a field’s error as soon as it is changed', async () => {
    render(<App path="/" />);
    await userEvent.click(screen.getByRole('button', { name: 'Join the waitlist' }));
    expect(screen.getByText('Enter your email.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    await userEvent.type(screen.getByLabelText('Email'), 'a');
    expect(screen.queryByText('Enter your email.')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByText('Choose where your business is.')).toBeInTheDocument();
  });

  it('checks the form', () => {
    expect(validateWaitlist({ email: 'nope', country: '' })).toEqual({ email: 'Enter an email like name@example.com.', country: 'Choose where your business is.' });
    expect(validateWaitlist({ email: 'ada@example.com', name: 'x'.repeat(81), country: 'NG' })).toEqual({ name: 'Keep your name under 80 characters.' });
    expect(validateWaitlist({ email: 'ada@example.com', country: 'GB' })).toEqual({});
  });

  it('joins through this site’s own server function, with no Supabase address or key', async () => {
    const fetchImpl = answer(200, { ok: true, already: false });
    global.fetch = fetchImpl;
    render(<App path="/" />);
    await userEvent.click(screen.getByRole('button', { name: 'Join the waitlist' }));
    expect(screen.getByText('Enter your email.')).toBeInTheDocument();
    expect(fetchImpl).not.toHaveBeenCalled();
    await fill();
    const done = await screen.findByRole('status');
    expect(done).toHaveTextContent('You are on the list.');
    expect(done).toHaveFocus();
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('/api/waitlist');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toEqual({ email: 'ada@example.com', name: null, business: null, country: 'NG' });
  });

  it('says so when the email is already on the list', async () => {
    global.fetch = answer(200, { ok: true, already: true });
    render(<App path="/" />);
    await fill();
    expect(await screen.findByRole('status')).toHaveTextContent('You are already on the list. We will email you when Threadé opens to everyone.');
  });

  it('a filled hidden field (a bot) looks like success and sends nothing', async () => {
    const fetchImpl = answer(200, { ok: true, already: false });
    global.fetch = fetchImpl;
    render(<App path="/" />);
    const trap = screen.getByLabelText('Website');
    expect(trap).toHaveAttribute('tabindex', '-1');
    expect(trap).toHaveAttribute('name', 'website');
    // Hidden from screen readers too.
    expect(screen.queryByRole('textbox', { name: 'Website' })).not.toBeInTheDocument();
    fireEvent.change(trap, { target: { value: 'https://spam.example' } });
    await fill();
    expect(await screen.findByRole('status')).toHaveTextContent('You are on the list.');
    expect(fetchImpl).not.toHaveBeenCalled();
    await expect(joinWaitlist({ email: 'a@b.co', country: 'GB', website: 'x' }, { fetchImpl })).resolves.toEqual({ already: false });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('explains known refusals in its own words and nothing else', async () => {
    const form = { email: 'ada@example.com', country: 'GB' };
    const cases = [
      ['invalid_email', 'Enter an email like name@example.com.'],
      ['invalid_country', 'Choose where your business is.'],
      ['invalid_name', 'Keep your name under 80 characters.'],
      ['invalid_business', 'Keep the business name under 120 characters.'],
      ['rate_limited', 'Too many sign-ups right now. Try again in a minute.'],
      ['not_configured', NOT_CONNECTED],
      ['not_allowed', FAILED],
      ['constructor', FAILED],
    ];
    for (const [error, message] of cases) {
      await expect(joinWaitlist(form, { fetchImpl: answer(400, { ok: false, error }) })).rejects.toThrow(message);
    }
    const serverText = answer(400, { code: 'P0001', message: 'relation "site_waitlist" violates constraint', details: 'invalid_email' });
    await expect(joinWaitlist(form, { fetchImpl: serverText })).rejects.toThrow(FAILED);
    await expect(joinWaitlist(form, { fetchImpl: jest.fn().mockResolvedValue({ ok: false, status: 502, json: async () => { throw new Error('html'); } }) })).rejects.toThrow(FAILED);
    await expect(joinWaitlist(form, { fetchImpl: jest.fn().mockRejectedValue(new TypeError('Failed to fetch')) })).rejects.toThrow(FAILED);
  });

  it('a waitlist that is not open yet asks people to email', async () => {
    global.fetch = answer(503, { ok: false, error: 'not_configured' });
    render(<App path="/" />);
    await fill();
    expect(await screen.findByRole('alert')).toHaveTextContent('The waitlist is not open yet.');
  });
});

describe('website privacy page', () => {
  it('explains the waitlist data only', () => {
    render(<App path="/privacy/" />);
    expect(screen.getByRole('heading', { level: 1, name: 'How this website uses your details' })).toBeInTheDocument();
    expect(screen.getByText(/sets no cookies/)).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('covers server logs, the reason (consent), transfers and one entry per email, in plain words', () => {
    const { container } = render(<App path="/privacy" />);
    expect(screen.getByRole('heading', { name: 'Server logs' })).toBeInTheDocument();
    expect(screen.getByText(/keep standard server logs for security\. These include your IP address and browser details\./)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Our reason for using your details' })).toBeInTheDocument();
    expect(screen.getByText(/Your consent: you choose to join the waitlist/)).toBeInTheDocument();
    expect(screen.getByText(/covered by the providers' standard contractual safeguards/)).toBeInTheDocument();
    expect(screen.getByText(/We keep one entry per email address/)).toBeInTheDocument();
    expect(screen.getByText(/Business address: not provided yet/)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/—|draft|counsel|lawyer/i);
  });

  it('keeps the menu links working from every page', () => {
    render(<App path="/privacy" />);
    const main = screen.getByRole('navigation', { name: 'Main' });
    expect(within(main).getByRole('link', { name: 'Features' })).toHaveAttribute('href', '/features');
    expect(within(main).getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
    expect(within(main).getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/faq');
  });
});
