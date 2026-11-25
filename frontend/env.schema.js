/**
 * SL-LMS frontend — environment schema
 *
 * Declared once and used twice: `vite.config.js` checks it when the dev
 * server or a build starts, so a misconfigured checkout fails immediately
 * with the variable named; `src/config/env.js` checks the same rules against
 * the inlined values at application boot, which catches a bundle built
 * against a different `.env` than the one deployed.
 *
 * Plain JavaScript with no imports, because Vite's own config loads it
 * before any dependency resolution happens.
 *
 * Only VITE_-prefixed values reach the browser. Nothing secret belongs here.
 */

/** @type {Record<string, { description: string, validate: (value: string) => string | null }>} */
export const frontendEnvSchema = {
  VITE_API_URL: {
    description: "Absolute base URL of the SL-LMS API, including the version prefix.",
    validate: (value) => {
      let url;
      try {
        url = new URL(value);
      } catch {
        return 'must be an absolute URL, e.g. "http://localhost:5000/api/v1"';
      }
      if (!/^https?:$/.test(url.protocol)) return "must use http or https";
      if (url.pathname.endsWith("/")) return "must not end with a trailing slash";
      return null;
    },
  },
  VITE_APP_URL: {
    description:
      "Public origin the application is served from; used for canonical links.",
    validate: (value) => {
      let url;
      try {
        url = new URL(value);
      } catch {
        return 'must be an absolute URL, e.g. "http://localhost:5173"';
      }
      if (!/^https?:$/.test(url.protocol)) return "must use http or https";
      if (url.pathname !== "/") return "must be a bare origin with no path";
      return null;
    },
  },
};

export const requiredFrontendEnvKeys = Object.keys(frontendEnvSchema);

/**
 * Validate a source of environment values.
 *
 * @param {Record<string, unknown>} source `loadEnv()` output or `import.meta.env`.
 * @returns {{ name: string, missing: boolean, message: string }[]} one entry per problem.
 */
export function collectFrontendEnvProblems(source) {
  const problems = [];

  for (const [name, { validate }] of Object.entries(frontendEnvSchema)) {
    const raw = source?.[name];

    if (raw === undefined || raw === null || String(raw).trim() === "") {
      problems.push({ name, missing: true, message: "is required but not set" });
      continue;
    }

    const message = validate(String(raw).trim());
    if (message) problems.push({ name, missing: false, message });
  }

  return problems;
}

/**
 * @param {{ name: string, missing: boolean, message: string }[]} problems
 * @returns {string} a message naming every offending variable.
 */
export function formatFrontendEnvProblems(problems) {
  const missing = problems.filter((problem) => problem.missing).length;
  const malformed = problems.length - missing;
  const counted = [
    missing > 0 && `${missing} missing`,
    malformed > 0 && `${malformed} malformed`,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    `Invalid frontend environment (${counted}).`,
    "",
    ...problems.map(({ name, message }) => `  • ${name} — ${message}`),
    "",
    "Copy .env.example to .env at the repository root and fill in every value.",
    "See docs/ENVIRONMENT.md for what each variable does.",
  ].join("\n");
}
