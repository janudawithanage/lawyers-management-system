/**
 * SL-LMS — environment schema
 *
 * The single declaration of every variable the API needs, what shape it must
 * have, and what it is for. `.env.example` at the repository root is the
 * tracked template for this schema and must stay in step with it.
 *
 * Deliberately there are no defaults. A variable that is absent is an error,
 * not an invitation to guess: a silent fallback turns a misconfigured
 * deployment into a working-looking one that talks to the wrong database.
 * The only exception is NODE_ENV, where "development" is the honest default
 * for a developer who has not set it.
 */

import { z } from "zod";

/** Values shipped in `.env.example` that must never reach production. */
export const PLACEHOLDER_PATTERN = /^(change-?me|replace-?me|example|todo|xxx+)/i;

const commaSeparatedOrigins = z
  .string()
  .min(1, "must list at least one allowed origin")
  .transform((value, ctx) => {
    const origins = value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    if (origins.length === 0) {
      ctx.addIssue({ code: "custom", message: "must list at least one allowed origin" });
      return z.NEVER;
    }

    for (const origin of origins) {
      let parsed;
      try {
        parsed = new URL(origin);
      } catch {
        ctx.addIssue({
          code: "custom",
          message: `"${origin}" is not an absolute URL (expected e.g. https://app.sl-lms.lk)`,
        });
        return z.NEVER;
      }
      if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
        ctx.addIssue({
          code: "custom",
          message: `"${origin}" must be a bare origin with no path, query or fragment`,
        });
        return z.NEVER;
      }
    }

    return origins;
  });

const port = z.coerce
  .number()
  .int("must be a whole number")
  .min(1, "must be between 1 and 65535")
  .max(65535, "must be between 1 and 65535");

const secret = () =>
  z.string().min(32, "must be at least 32 characters of high-entropy random data");

export const envSchema = z.object({
  // ─── Runtime ─────────────────────────────────────────────────────────────
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: port,
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),

  // ─── Database (MySQL 8, InnoDB) ──────────────────────────────────────────
  DB_HOST: z.string().min(1, "must name the database host"),
  DB_PORT: port,
  DB_NAME: z.string().min(1, "must name the database"),
  DB_USER: z.string().min(1, "must name the database user"),
  DB_PASSWORD: z
    .string()
    .min(1, "must be set; an empty database password is not accepted"),
  DB_POOL_SIZE: z.coerce.number().int().min(1).max(100),

  // ─── Identity ────────────────────────────────────────────────────────────
  JWT_ACCESS_SECRET: secret(),
  JWT_REFRESH_SECRET: secret(),
  JWT_ACCESS_TTL: z.string().regex(/^\d+[smhd]$/, 'must be a duration such as "15m"'),
  JWT_REFRESH_TTL: z.string().regex(/^\d+[smhd]$/, 'must be a duration such as "30d"'),
  BCRYPT_COST: z.coerce
    .number()
    .int()
    .min(12, "must be at least 12; the security model specifies cost 12")
    .max(15, "above 15 the hash is slow enough to be a denial-of-service vector"),

  // ─── HTTP ────────────────────────────────────────────────────────────────
  CORS_ORIGINS: commaSeparatedOrigins,
  COOKIE_SECRET: secret(),
  TRUST_PROXY: z.enum(["true", "false"]).transform((value) => value === "true"),

  // ─── Document storage (S3-compatible, private bucket) ────────────────────
  STORAGE_ENDPOINT: z.string().url("must be an absolute URL"),
  STORAGE_REGION: z.string().min(1, "must name the storage region"),
  STORAGE_BUCKET: z.string().min(1, "must name the bucket"),
  STORAGE_ACCESS_KEY_ID: z.string().min(1, "must be set"),
  STORAGE_SECRET_ACCESS_KEY: secret(),
  STORAGE_SIGNED_URL_TTL: z.coerce
    .number()
    .int()
    .min(30, "must be at least 30 seconds")
    .max(3600, "signed URLs must expire within the hour"),

  // ─── Transactional e-mail ────────────────────────────────────────────────
  SMTP_HOST: z.string().min(1, "must name the SMTP host"),
  SMTP_PORT: port,
  SMTP_USER: z.string().min(1, "must be set"),
  SMTP_PASSWORD: z.string().min(1, "must be set"),
  MAIL_FROM: z.string().email("must be a valid e-mail address"),
});

/**
 * Secrets that must not carry a placeholder value outside development.
 * Checked separately from the schema because what counts as acceptable
 * depends on NODE_ENV, which the schema itself produces.
 */
export const PRODUCTION_SECRETS = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "COOKIE_SECRET",
  "DB_PASSWORD",
  "STORAGE_ACCESS_KEY_ID",
  "STORAGE_SECRET_ACCESS_KEY",
  "SMTP_PASSWORD",
];
