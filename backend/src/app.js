/**
 * SL-LMS — Express application
 *
 * Phase P0 scaffold. The layered module structure (route → controller →
 * service → repository), Zod validation at every route boundary, the
 * centralised error handler and the domain routers arrive in P2; the
 * directories under `src/modules/` are their places.
 */

import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env, isProduction } from "./config/env.js";

export function createApp() {
  const app = express();

  if (env.TRUST_PROXY) app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      environment: env.NODE_ENV,
      uptime: Math.round(process.uptime()),
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: { code: "not_found", message: "No such endpoint" } });
  });

  // Placeholder error handler; P2 replaces it with the shared error shape.
  app.use((error, _req, res, _next) => {
    const status = error.status ?? 500;
    res.status(status).json({
      error: {
        code: error.code ?? "internal_error",
        message: status === 500 && isProduction ? "Internal server error" : error.message,
      },
    });
  });

  return app;
}

export default createApp;
