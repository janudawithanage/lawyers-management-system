# SL-LMS frontend

React 19, Vite 7, Tailwind CSS 4, React Router 7, Framer Motion.

This package is one of two npm workspaces. Install and lint from the repository
root, not here:

```bash
cd ..
npm install
npm run dev:frontend
npm run lint
```

| Command                             | Run from                                                       |
| ----------------------------------- | -------------------------------------------------------------- |
| `npm run dev` / `build` / `preview` | here, or `npm run <script> --workspace frontend` from the root |
| `npm run lint`                      | the root only — one ESLint config covers both packages         |

## Environment

Configuration comes from the single `.env` at the repository root; Vite's
`envDir` points there. Only `VITE_`-prefixed values reach the browser, and they
are inlined into the bundle at build time, so nothing secret belongs in one.

`env.schema.js` declares the required variables once and is used twice: by
`vite.config.js`, so a build fails immediately when one is missing or
malformed, and by `src/config/env.js`, so application boot fails the same way.
Read values through `@config`, never `import.meta.env`.

See [../docs/ENVIRONMENT.md](../docs/ENVIRONMENT.md).

## Layout

```
src/
├── components/   ui primitives, layout, dashboard chrome, shared pieces
├── features/     auth, admin, client, lawyer — pages, hooks, data, services
├── layouts/      public, auth and dashboard shells
├── routes/       route tree and the guard components
├── context/      auth and theme providers; hooks live in sibling .js modules
├── store/        global store (Context + useReducer)
├── services/     HTTP client and mock seed data
├── config/       validated environment and application configuration
└── theme/        design tokens
```

Context and store files are split so each `.jsx` module exports only
components: Vite's fast refresh can hot-update a module whose exports are all
components, and loses that the moment a hook or a constant is exported
alongside. Hence `AuthContext.jsx` (provider) beside `auth-context.js`
(context object, role map, `useAuth`).

## Data

Every screen runs on fixtures from `src/features/*/data/` and
`src/services/mockSeedData.js`. `src/services/api.js` is a complete HTTP client
with bearer-token injection, timeouts and multipart upload — written, and not
yet used by anything. It should be treated as new, untested code when the
screens are converted to the real API.
