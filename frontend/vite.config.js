import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { collectFrontendEnvProblems, formatFrontendEnvProblems } from "./env.schema.js";

/** One `.env` at the repository root serves both packages. */
const envDir = path.resolve(import.meta.dirname, "..");

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Fail the dev server or build at boot rather than shipping a bundle with a
  // missing or malformed VITE_ value inlined into it.
  const problems = collectFrontendEnvProblems(loadEnv(mode, envDir, "VITE_"));
  if (problems.length > 0) {
    throw new Error(`\n${formatFrontendEnvProblems(problems)}\n`);
  }

  return {
    envDir,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@components": path.resolve(import.meta.dirname, "./src/components"),
        "@ui": path.resolve(import.meta.dirname, "./src/components/ui"),
        "@layouts": path.resolve(import.meta.dirname, "./src/layouts"),
        "@pages": path.resolve(import.meta.dirname, "./src/pages"),
        "@hooks": path.resolve(import.meta.dirname, "./src/hooks"),
        "@context": path.resolve(import.meta.dirname, "./src/context"),
        "@utils": path.resolve(import.meta.dirname, "./src/utils"),
        "@config": path.resolve(import.meta.dirname, "./src/config"),
        "@constants": path.resolve(import.meta.dirname, "./src/constants"),
        "@services": path.resolve(import.meta.dirname, "./src/services"),
        "@theme": path.resolve(import.meta.dirname, "./src/theme"),
        "@assets": path.resolve(import.meta.dirname, "./src/assets"),
        "@features": path.resolve(import.meta.dirname, "./src/features"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            animations: ["framer-motion"],
            icons: ["lucide-react"],
          },
        },
      },
      sourcemap: false,
      minify: "esbuild",
    },
  };
});
