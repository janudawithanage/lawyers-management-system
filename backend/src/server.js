#!/usr/bin/env node
/**
 * SL-LMS — API entry point
 *
 * Validates the environment before anything else is imported. A missing or
 * malformed variable stops the process here, with a named error, rather than
 * surfacing as a confusing failure once the server is already listening.
 */

let env;
let createApp;

try {
  ({ env } = await import("./config/env.js"));
  ({ createApp } = await import("./app.js"));
} catch (error) {
  if (error?.name === "EnvironmentError") {
    process.stderr.write(`\n${error.message}\n\n`);
    process.exit(1);
  }
  throw error;
}

const app = createApp();
const server = app.listen(env.PORT, () => {
  process.stdout.write(`SL-LMS API listening on port ${env.PORT} [${env.NODE_ENV}]\n`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
