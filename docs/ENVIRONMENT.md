# Environment configuration

One `.env` at the repository root configures both packages. `.env.example`
beside it is the tracked template and the only documentation of record for
what each variable means; `.env` itself is git-ignored and never committed.

```bash
cp .env.example .env     # then fill in every value
```

## Why one file

The API reads it through [`backend/src/config/env.js`](../backend/src/config/env.js),
which loads the root `.env` without overwriting anything the shell, the
container or CI already set. The frontend reads the same file because
`frontend/vite.config.js` points Vite's `envDir` at the repository root. A
single file means a single place to keep in step, and one template to copy.

Only `VITE_`-prefixed values reach the browser. Vite inlines them into the
bundle at build time, so **nothing secret may carry a `VITE_` prefix** — a
value there is published, not configured.

## Nothing is defaulted

A missing or malformed variable is an error, and both packages fail at boot
rather than substituting a plausible value:

| Where                                      | What happens                                                          |
| ------------------------------------------ | --------------------------------------------------------------------- |
| `node backend/src/server.js`               | Prints every offending variable and exits 1 before the server listens |
| `npm run build` / `npm run dev` (frontend) | Vite throws at config time, naming every offending variable           |
| Application boot in the browser            | `frontend/src/config/env.js` throws an `EnvironmentError`             |

This is deliberate. A silent fallback turns a misconfigured deployment into
one that looks healthy while talking to the wrong database, so the failure is
made loud and early instead.

The validation lives in two schemas, each the single declaration for its side:

- [`backend/src/config/env.schema.js`](../backend/src/config/env.schema.js) — Zod, every server variable
- [`frontend/env.schema.js`](../frontend/env.schema.js) — plain JavaScript, shared by `vite.config.js` and the runtime check

Adding a variable means adding it to the matching schema **and** to
`.env.example`. CI copies the template before building, so a schema entry
without a template entry fails there rather than in production.

## Variables

### Runtime

| Variable    | Notes                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------- |
| `NODE_ENV`  | `development`, `test` or `production`. The only variable with a default (`development`).          |
| `PORT`      | API listening port. The template uses `5050`: on macOS the AirPlay Receiver already holds `5000`. |
| `LOG_LEVEL` | `fatal`, `error`, `warn`, `info`, `debug` or `trace`.                                             |

### Database — MySQL 8, InnoDB

| Variable                                   | Notes                                                |
| ------------------------------------------ | ---------------------------------------------------- |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` | Connection target.                                   |
| `DB_PASSWORD`                              | Must be set. An empty database password is rejected. |
| `DB_POOL_SIZE`                             | 1–100.                                               |

### Identity

| Variable                                  | Notes                                                                                                                                                          |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | At least 32 characters, and never the same value. Generate with `openssl rand -base64 48`.                                                                     |
| `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL`       | Durations such as `15m`, `30d`. The access token is held in memory; the refresh token lives in an httpOnly, Secure, SameSite=Strict cookie and rotates on use. |
| `BCRYPT_COST`                             | At least 12, at most 15. The security model specifies 12.                                                                                                      |

### HTTP

| Variable        | Notes                                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| `CORS_ORIGINS`  | Comma-separated allow-list of bare origins. No wildcards; no path, query or fragment. |
| `COOKIE_SECRET` | At least 32 characters.                                                               |
| `TRUST_PROXY`   | `true` only behind a TLS-terminating reverse proxy.                                   |

### Document storage — S3-compatible, private bucket

| Variable                                             | Notes                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| `STORAGE_ENDPOINT`                                   | Absolute URL. Local development points at a MinIO emulator. |
| `STORAGE_REGION`, `STORAGE_BUCKET`                   | Never a public bucket.                                      |
| `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY` | Credentials.                                                |
| `STORAGE_SIGNED_URL_TTL`                             | Seconds a signed download URL stays valid; 30–3600.         |

### Transactional e-mail

| Variable                                               | Notes                 |
| ------------------------------------------------------ | --------------------- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Mail transport.       |
| `MAIL_FROM`                                            | Valid e-mail address. |

### Frontend

| Variable       | Notes                                                                         |
| -------------- | ----------------------------------------------------------------------------- |
| `VITE_API_URL` | Absolute base URL of the API including the version prefix, no trailing slash. |
| `VITE_APP_URL` | Public origin the application is served from. Bare origin, no path.           |

## Placeholders and production

Every secret in `.env.example` is a `change-me-…` value that passes validation,
so a fresh checkout builds without hunting for credentials. With
`NODE_ENV=production` the API refuses to start while any secret still holds
one, naming each:

```
Invalid environment (7 malformed). The server will not start.

  • JWT_ACCESS_SECRET — still holds the placeholder value from .env.example
  …
```

Check a deployment's configuration without starting the server:

```bash
npm run check:env --workspace backend
```
