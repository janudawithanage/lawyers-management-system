# Contributing

## Getting set up

```bash
git clone https://github.com/janudawithanage/lawyers-management-system.git
cd lawyers-management-system
cp .env.example .env     # fill in every value; see docs/ENVIRONMENT.md
npm install              # one install at the root covers both packages
```

`npm install` must be run at the repository root. The two packages are npm
workspaces, so the lockfile and `node_modules` live at the root and running
`npm install` inside `frontend/` or `backend/` will fight it.

## Running things

| Command                                        | What it does                                               |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                                  | Both packages together, output prefixed `api` and `web`    |
| `npm run dev:frontend` / `npm run dev:backend` | One at a time                                              |
| `npm run build`                                | Builds the frontend and validates the API's environment    |
| `npm run lint`                                 | ESLint over the whole repository — one command, one config |
| `npm run format`                               | Prettier over the whole repository                         |
| `npm run check:env --workspace backend`        | Validates configuration without starting the server        |

## `main` is protected

`main` cannot be pushed to directly. Every change goes through a pull request,
and CI must pass before it can merge:

```bash
git switch -c descriptive-branch-name
# work, commit
git push -u origin descriptive-branch-name
gh pr create
```

CI runs install, lint and build on every pull request. It is the same three
commands you can run locally, so a red build is reproducible at your desk.

The protection rules are applied by [`scripts/protect-main.sh`](../scripts/protect-main.sh),
which is idempotent and records in its comments why each rule is set the way it
is. Run it after changing the CI job's name, since the required status check is
matched by that name.

## Lint and formatting

One ESLint flat config at the repository root covers both packages, with
`files` blocks for the browser and Node environments rather than separate
configs that drift apart. Formatting is Prettier's job: `eslint-config-prettier`
is applied last so the two never argue.

Two rules in the backend block are worth knowing about before they surprise
you:

- `no-restricted-properties` forbids reading `process.env` directly. Import the
  validated `env` from `src/config/env.js`, which has been checked at boot.
- `no-restricted-imports` forbids importing frontend code from the API.

The repository has not been reformatted wholesale with Prettier. Doing so would
rewrite every file and bury the history, so it is a separate, deliberate
change; until then, run `npm run format` on the files you touch.

## Commits

Describe the change and why it was needed. The diff already says what moved.
