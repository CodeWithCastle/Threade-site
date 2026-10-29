// Vercel server function: GET /api/region. No settings and no stored data;
// it reads Vercel's own country header. Logic and tests: src/server/region.js.
const { handleRegion } = require('../src/server/region');

module.exports = (req, res) => handleRegion(req, res);
