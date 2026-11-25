/**
 * SL-LMS — shared ESLint configuration
 *
 * One flat config for the whole repository, so both packages are held to the
 * same rules and `npm run lint` at the root is the single answer to "does
 * this lint clean?". Package-specific concerns are expressed as `files`
 * blocks below rather than as separate configs that drift apart.
 *
 * Formatting is Prettier's job, not ESLint's: `eslint-config-prettier` is
 * applied last to switch off every rule the two would argue about.
 */

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default defineConfig([
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.vite/**",
  ]),

  // ─── Shared base — everything, both packages ─────────────────────────────
  {
    name: "sl-lms/base",
    files: ["**/*.{js,jsx,mjs,cjs}"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-implicit-coercion": "error",
      "object-shorthand": ["error", "properties"],
    },
  },

  // ─── Frontend — React running in the browser ─────────────────────────────
  {
    name: "sl-lms/frontend",
    files: ["frontend/**/*.{js,jsx}"],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },

  // ─── Backend — Node.js ───────────────────────────────────────────────────
  {
    name: "sl-lms/backend",
    files: ["backend/**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // The API logs through stdout/stderr at its entry points by design.
      "no-console": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/frontend/**"],
              message: "The API must not import frontend code.",
            },
          ],
        },
      ],
      // Everything must read configuration through src/config/env.js, which
      // validates it. Reaching for process.env directly bypasses that.
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Import the validated `env` from src/config/env.js instead.",
        },
      ],
    },
  },

  // ─── Config and tooling files — Node.js, outside either package's src ────
  {
    name: "sl-lms/tooling",
    files: [
      "*.{js,mjs,cjs}",
      "frontend/*.{js,mjs,cjs}",
      "backend/scripts/**/*.js",
      "backend/src/config/env.js",
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
      "no-restricted-properties": "off",
    },
  },

  // Must stay last.
  prettier,
]);
