# SL-LMS API

Node.js with Express, layered route → controller → service → repository.
MySQL 8 for data, S3-compatible private object storage for documents.

This package is one of two npm workspaces. Install from the repository root:

```bash
cd ..
cp .env.example .env     # see docs/ENVIRONMENT.md
npm install
npm run dev:backend
```

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | `node --watch src/server.js`                          |
| `npm start`         | Starts the server                                     |
| `npm run check:env` | Validates the environment without starting the server |
| `npm run build`     | Same check — this is what CI runs for this package    |

```bash
curl http://localhost:5050/health
# {"status":"ok","environment":"development","uptime":3}
```

## What is here, and what is not

In place:

- `src/config/` — environment loading and validation at boot
- `src/app.js` — Express application: Helmet, CORS allow-list, body limits, health endpoint
- `src/server.js` — entry point, which fails before listening if configuration is invalid
- the directory structure for the modules, middleware, migrations, seeds and tests

Not yet written: the schema and migrations, the domain modules, authentication,
the centralised error shape, request logging, and the tests. The empty
directories are their places, not oversights.

## Configuration

Read configuration through the validated, frozen `env` export:

```js
import { env } from "./config/env.js";
```

Reading `process.env` directly is a lint error outside the config and tooling
files. The point of validating at boot is lost if other modules read raw values
behind its back.

The schema is [`src/config/env.schema.js`](src/config/env.schema.js), with no
defaults: a variable that is absent is an error, not an invitation to guess.
A missing or malformed value stops the process with every offending variable
named. See [../docs/ENVIRONMENT.md](../docs/ENVIRONMENT.md).

## Architectural rules

Five constraints that are cheap to hold from the start and expensive to
retrofit:

1. **Authorisation is decided here, for every request.** The frontend's
   `RoleRoute` guard shapes navigation; it never protects data. Ownership is
   re-checked per resource, not per route.
2. **The access token never touches persistent storage.** Short-lived access
   token in memory; refresh token in an httpOnly, Secure, SameSite=Strict
   cookie, rotated on use with reuse detection.
3. **Money and time are integers.** Fees in cents; timestamps stored UTC and
   rendered in Asia/Colombo at the edge.
4. **Invariants live in the database.** Double-booking is prevented by a unique
   constraint inside a transaction, not by an availability check in
   application code.
5. **No user-supplied string reaches a query or a filename.** Parameterised
   statements throughout; stored objects are keyed by generated identifier with
   the original filename kept as metadata only.
