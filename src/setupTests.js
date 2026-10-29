// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// No test should reach the network. /api/region is the only call the pages make
// on load; without this jsdom tries a real request and logs a connection error.
const noNetwork = () => Promise.resolve({ ok: false, status: 503, json: () => Promise.resolve({}) });
// The server-side suites run in node, where there is no window.
const browser = typeof window !== 'undefined';
const realFetch = browser ? window.fetch : undefined;

beforeEach(() => {
  if (browser) window.fetch = jest.fn(noNetwork);
});

afterEach(() => {
  if (browser) window.fetch = realFetch;
});
