// Runs before `npm run build` (prebuild): refuses to build when the build environment or an .env
// file holds a server key, a database credential, or a REACT_APP_ variable that is not allowed
// (Create React App sends every REACT_APP_ variable to browsers). Prints names, never values.
const path = require('path');
const { checkEnvironment, readEnvFiles } = require('./env-rules');

const { problems, warnings } = checkEnvironment(process.env, readEnvFiles(path.join(__dirname, '..')));
warnings.forEach((w) => console.warn(`Note: ${w}`));
if (problems.length) {
  console.error(`Environment check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('Environment check passed: no server keys, only the allowed public variables.');
