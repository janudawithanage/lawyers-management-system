/**
 * SL-LMS frontend — validated environment
 *
 * Checks the values Vite inlined at build time against the shared schema and
 * throws if any is missing or malformed, rather than falling back to a guess.
 * A wrong API URL that silently becomes "/api/v1" is a bug that surfaces as
 * an empty dashboard; a named error at boot is the cheaper failure.
 *
 * Import this, or `@config`, never `import.meta.env` directly.
 */

import {
  collectFrontendEnvProblems,
  formatFrontendEnvProblems,
} from "../../env.schema.js";

const problems = collectFrontendEnvProblems(import.meta.env);

if (problems.length > 0) {
  const error = new Error(formatFrontendEnvProblems(problems));
  error.name = "EnvironmentError";
  throw error;
}

export const env = Object.freeze({
  apiUrl: import.meta.env.VITE_API_URL.trim(),
  appUrl: import.meta.env.VITE_APP_URL.trim(),
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
});

export default env;
