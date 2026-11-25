#!/usr/bin/env node
/**
 * Validate the environment without starting the server.
 *
 * Used as the backend's `build` step so continuous integration fails on a
 * misconfigured or out-of-date `.env.example`, and available as
 * `npm run check:env` before a deployment.
 */

try {
  const { env } = await import("../src/config/env.js");
  process.stdout.write(`Environment valid (${env.NODE_ENV}).\n`);
} catch (error) {
  if (error?.name === "EnvironmentError") {
    process.stderr.write(`\n${error.message}\n\n`);
    process.exit(1);
  }
  throw error;
}
