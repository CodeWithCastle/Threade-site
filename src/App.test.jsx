import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { joinWaitlist, validateWaitlist, FAILED, NOT_CONNECTED } from './waitlist';
import { FEATURES, PLANS } from './content';

const env = { ...process.env };
afterEach(() => {
  process.env = { ...env };
  jest.restoreAllMocks();
});

describe('home page', () => {
  it('leads with the promise and sends Start free to the app sign-up', () => {
    render(<App path="/" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your workshop, measured to fit.');
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

  it('shows the three plans without inventing prices', () => {
    render(<App path="/" />);
    PLANS.forEach((p) => expect(screen.getByRole('heading', { name: p.name, level: 3 })).toBeInTheDocument());
    expect(screen.getAllByText('Price to be announced')).toHaveLength(2);
    const plans = document.getElementById('plans');
    expect(plans.textContent).not.toMatch(/₦\d|£\d|\$\d/);
  });

  it('links the official legal documents in the app and the website privacy page', () => {
    render(<App path="/" />);
    const legal = screen.getByRole('navigation', { name: 'Legal' });
    expect(within(legal).getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', 'https://app.threade.app/legal/terms');
    expect(within(legal).getByRole('link', { name: 'Website privacy' })).toHaveAttribute('href', '/privacy');
  });

  it('says nothing about drafts or counsel', () => {
    const { container } = render(<App path="/" />);
    expect(container.textContent).not.toMatch(/draft|counsel|lawyer|—/i);
  });
});

describe('waitlist', () => {
  it('asks people to email when the waitlist is not connected', () => {
    delete process.env.REACT_APP_SUPABASE_URL;
    render(<App path="/" />);
    expect(screen.getByRole('note')).toHaveTextContent('The waitlist is not open yet.');
    expect(screen.getByRole('button', { name: 'Join the waitlist' })).toBeDisabled();
  });

  it('checks the form', () => {
    expect(validateWaitlist({ email: 'nope', country: '' })).toEqual({ email: 'Enter an email like name@example.com.', country: 'Choose where your business is.' });
    expect(validateWaitlist({ email: 'ada@example.com', name: 'x'.repeat(81), country: 'NG' })).toEqual({ name: 'Keep your name under 80 characters.' });
    expect(validateWaitlist({ email: 'ada@example.com', country: 'GB' })).toEqual({});
  });

  it('joins, sending only what was typed to the database function', async () => {
    process.env.REACT_APP_SUPABASE_URL = 'https://abc.supabase.co/';
    process.env.REACT_APP_SUPABASE_ANON_KEY = 'public-anon-key';
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    global.fetch = fetchImpl;
    render(<App path="/" />);
    await userEvent.click(screen.getByRole('button', { name: 'Join the waitlist' }));
    expect(screen.getByText('Enter your email.')).toBeInTheDocument();
    expect(fetchImpl).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText('Email'), ' ada@example.com ');
    await userEvent.selectOptions(screen.getByLabelText('Where is your business?'), 'NG');
    await userEvent.click(screen.getByRole('button', { name: 'Join the waitlist' }));
    expect(await screen.findByRole('status')).toHaveTextContent('You are on the list.');
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://abc.supabase.co/rest/v1/rpc/join_waitlist');
    expect(init.headers.apikey).toBe('public-anon-key');
    expect(JSON.parse(init.body)).toEqual({ p_email: 'ada@example.com', p_name: null, p_business: null, p_country: 'NG' });
  });

  it('shows the database refusal in its own words, and a plain message otherwise', async () => {
    process.env.REACT_APP_SUPABASE_URL = 'https://abc.supabase.co';
    process.env.REACT_APP_SUPABASE_ANON_KEY = 'k';
    const form = { email: 'ada@example.com', country: 'GB' };
    const refused = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ code: 'P0001', message: 'Too many sign-ups right now. Try again in a minute.' }) });
    await expect(joinWaitlist(form, { fetchImpl: refused })).rejects.toThrow('Too many sign-ups right now. Try again in a minute.');
    const broken = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ code: 'PGRST202', message: 'Could not find the function' }) });
    await expect(joinWaitlist(form, { fetchImpl: broken })).rejects.toThrow(FAILED);
    const down = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(joinWaitlist(form, { fetchImpl: down })).rejects.toThrow(FAILED);
    delete process.env.REACT_APP_SUPABASE_ANON_KEY;
    await expect(joinWaitlist(form, { fetchImpl: down })).rejects.toThrow(NOT_CONNECTED);
  });
});

describe('website privacy page', () => {
  it('explains the waitlist data only', () => {
    render(<App path="/privacy/" />);
    expect(screen.getByRole('heading', { level: 1, name: 'How this website uses your details' })).toBeInTheDocument();
    expect(screen.getByText(/sets no cookies/)).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
