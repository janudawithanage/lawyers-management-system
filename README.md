# Sri Lanka Lawyer Management System (SL-LMS)

A platform connecting clients with verified lawyers across Sri Lanka: search by
specialisation, district and language, book appointments, upload case documents
and track cases.

Two packages in one repository — a React frontend and a Node.js API — sharing
one install, one lint command and one environment file.

## Repository layout

```
lawyers-management-system/
├── frontend/              React 19 + Vite 7 + Tailwind CSS 4 application
├── backend/               Node.js API (Express), layered route → controller → service → repository
│   ├── src/config/        environment loading and validation at boot
│   ├── src/modules/       one folder per domain: auth, cases, appointments, documents, …
│   ├── src/middleware/    authn, authz, validation, rate limit, error handler
│   ├── src/lib/           logger, mailer, storage, token service
│   ├── db/migrations/     versioned schema; up and down for every change
│   └── db/seeds/          reference data and the fixture-equivalent seed
├── docs/                  project documentation
├── scripts/               repository operations
├── .github/workflows/     continuous integration
└── .env.example           environment template for both packages
```

## Getting started

Node.js 20.19 or newer.

```bash
cp .env.example .env     # fill in every value — see docs/ENVIRONMENT.md
npm install              # at the root; the packages are npm workspaces
npm run dev              # both packages, prefixed `api` and `web`
```

| Command                                        | What it does                                            |
| ---------------------------------------------- | ------------------------------------------------------- |
| `npm run dev`                                  | Frontend and API together                               |
| `npm run dev:frontend` / `npm run dev:backend` | One at a time                                           |
| `npm run build`                                | Builds the frontend and validates the API's environment |
| `npm run lint`                                 | ESLint over the whole repository                        |
| `npm run format`                               | Prettier over the whole repository                      |

Nothing is defaulted: a missing or malformed environment variable stops the API
at boot and fails the frontend build, naming the variable.
[docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) has the detail.

## Current state

The frontend is substantially complete — 41 pages across client, lawyer and
administrator dashboards, behind role-based route guards, with a full design
system. It runs entirely on fixtures: there is no database yet, and sign-in is
mocked in `frontend/src/features/auth/services/authService.js`.

The backend is a scaffold. The environment layer, the Express application and
the module structure are in place; the schema, the domain endpoints and
authentication are the next phases of work.

## Contributing

`main` is protected and cannot be pushed to directly. Every change goes through
a pull request, where CI runs install, lint and build.
[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) has the workflow.

## Documentation

[docs/](docs/) — quick start, environment reference, contributing guide, and the
authentication, routing and security notes.

## License

MIT.
