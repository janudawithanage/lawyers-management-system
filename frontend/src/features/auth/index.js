/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS AUTH FEATURE MODULE
 * Centralized authentication exports
 * ══════════════════════════════════════════════════════════════
 */

export { default as LoginPage } from "./pages/LoginPage";
export { default as RegisterPage } from "./pages/RegisterPage";
export { Input } from "./components/Input";
export { Select } from "./components/Select";
export * from "./validation/authValidation";
export * from "./services/authService";

export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  BASL_VERIFY: "/auth/basl-verify",
};

