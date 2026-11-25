/**
 * SL-LMS — environment loading and validation at boot
 *
 * Importing this module validates the process environment against
 * `env.schema.js`. If anything is missing or malformed it throws an
 * `EnvironmentError` naming every offending variable. Nothing is defaulted
 * and nothing is guessed, so a server that starts is a server whose
 * configuration has been checked.
 *
 * Entry points (`server.js`, `scripts/check-env.js`) catch that error, print
 * it and exit non-zero. The validation itself stays free of `process.exit`
 * so it can be exercised directly from tests.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

import { envSchema, PLACEHOLDER_PATTERN, PRODUCTION_SECRETS } from "./env.schema.js";

const here = path.dirname(fileURLToPath(import.meta.url));

/** Repository root — one `.env` serves both packages, beside `.env.example`. */
export const repoRoot = path.resolve(here, "..", "..", "..");

export class EnvironmentError extends Error {
  constructor(message, problems) {
    super(message);
    this.name = "EnvironmentError";
    this.problems = problems;
  }
}

/**
 * Read `.env` from the repository root into `process.env` without
 * overwriting anything already set by the shell, a container or CI.
 */
export function loadDotEnv({ root = repoRoot, env = process.env } = {}) {
  const file = path.join(root, ".env");
  if (!fs.existsSync(file)) return { loaded: false, file };

  const parsed = dotenv.parse(fs.readFileSync(file));
  for (const [key, value] of Object.entries(parsed)) {
    if (env[key] === undefined) env[key] = value;
  }
  return { loaded: true, file };
}

function describe(issue) {
  const name = issue.path.join(".") || "(root)";
  // Zod reports an absent key as an invalid type against `undefined`.
  const missing =
    issue.code === "invalid_type" &&
    (issue.input === undefined || issue.received === "undefined");
  return {
    name,
    missing,
    message: missing ? "is required but not set" : issue.message,
  };
}

/**
 * Validate an environment object. Returns the parsed, frozen configuration,
 * or throws `EnvironmentError` listing every problem at once — a half-reported
 * misconfiguration costs a boot cycle per variable.
 */
export function validateEnv(source = process.env) {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const problems = result.error.issues.map(describe);
    throw new EnvironmentError(formatProblems(problems), problems);
  }

  const parsed = result.data;

  if (parsed.NODE_ENV === "production") {
    const placeholders = PRODUCTION_SECRETS.filter((key) =>
      PLACEHOLDER_PATTERN.test(String(source[key] ?? "")),
    ).map((name) => ({
      name,
      missing: false,
      message: "still holds the placeholder value from .env.example",
    }));

    if (placeholders.length > 0) {
      throw new EnvironmentError(formatProblems(placeholders), placeholders);
    }
  }

  return Object.freeze(parsed);
}

export function formatProblems(problems) {
  const lines = problems.map(({ name, message }) => `  • ${name} — ${message}`);
  const missing = problems.filter((p) => p.missing).length;
  const malformed = problems.length - missing;

  const counted = [
    missing > 0 && `${missing} missing`,
    malformed > 0 && `${malformed} malformed`,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    `Invalid environment (${counted}). The server will not start.`,
    "",
    ...lines,
    "",
    "Copy .env.example to .env at the repository root and fill in every value.",
    "See docs/ENVIRONMENT.md for what each variable does.",
  ].join("\n");
}

loadDotEnv();

/** Validated, frozen configuration. Import this, never `process.env`. */
export const env = validateEnv();

export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
export const isDevelopment = env.NODE_ENV === "development";

export default env;
