// Vercel server function: POST /api/waitlist. Server-only settings (Vercel, Settings, Environment
// Variables; never REACT_APP_): THREADE_SUPABASE_URL, THREADE_SUPABASE_PUBLISHABLE_KEY,
// WAITLIST_PROXY_SECRET, WAITLIST_IP_SALT. The logic and its tests are in src/server/waitlist.js.
const { handleWaitlist } = require('../src/server/waitlist');

module.exports = (req, res) => handleWaitlist(req, res, { env: process.env });
