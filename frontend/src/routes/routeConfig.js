/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS ROUTE CONFIGURATION — Single Source of Truth
 * ══════════════════════════════════════════════════════════════
 *
 * Every route in the application is declared here.
 * Components consume this config — they never hard-code paths.
 *
 * Adding a new role or route:
 *   1. Add role constant to config/index.js → roles
 *   2. Add dashboard path to DASHBOARD_ROUTES below
 *   3. Add route entry to ROUTE_TREE
 *   4. Create the lazy-loaded page component
 *   Done — routing, protection, and redirects work automatically.
 *
 * Structure supports:
 *   • Multi-language prefixes  (/en/dashboard, /si/dashboard)
 *   • Feature-flag gating
 *   • Breadcrumb generation from meta
 *   • SSR data-loader hooks (future)
 */

import config from "@config";

const { roles } = config;

// ── Path Constants ───────────────────────────────────────────

export const PATHS = Object.freeze({
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Dashboard roots (role-specific)
  DASHBOARD_CLIENT: "/dashboard/client",
  DASHBOARD_LAWYER: "/dashboard/lawyer",
  DASHBOARD_ADMIN: "/dashboard/admin",

  // Catch-all
  NOT_FOUND: "*",
});

// ── Role → Dashboard Mapping ─────────────────────────────────

export const DASHBOARD_ROUTES = Object.freeze({
  [roles.CLIENT]: PATHS.DASHBOARD_CLIENT,
  [roles.LAWYER]: PATHS.DASHBOARD_LAWYER,
  [roles.ADMIN]: PATHS.DASHBOARD_ADMIN,
  [roles.SUPER_ADMIN]: PATHS.DASHBOARD_ADMIN,
});

/**
 * Resolve the correct dashboard path for a given role.
 * Falls back to client dashboard for unknown roles.
 */
export function resolveDashboard(role) {
  return DASHBOARD_ROUTES[role] || PATHS.DASHBOARD_CLIENT;
}

// ── Route Definitions ────────────────────────────────────────

/**
 * Centralised route tree consumed by AppRoutes.jsx.
 *
 * Each entry declares:
 *   path         — URL pattern
 *   allowedRoles — roles that may access (empty = public)
 *   requireAuth  — must be logged in
 *   meta         — title, breadcrumb, feature-flag info
 */
export const ROUTE_TREE = Object.freeze({
  // ── Public Routes ──
  public: [
    {
      path: PATHS.HOME,
      meta: { title: "Home", breadcrumb: "Home" },
    },
    {
      path: PATHS.LOGIN,
      meta: { title: "Sign In", breadcrumb: "Login" },
    },
    {
      path: PATHS.REGISTER,
      meta: { title: "Create Account", breadcrumb: "Register" },
    },
    {
      path: PATHS.FORGOT_PASSWORD,
      meta: { title: "Forgot Password", breadcrumb: "Forgot Password" },
    },
  ],

  // ── Client Dashboard ──
  clientDashboard: {
    basePath: PATHS.DASHBOARD_CLIENT,
    requireAuth: true,
    allowedRoles: [roles.CLIENT],
    children: [
      {
        path: "",
        meta: { title: "Client Dashboard", breadcrumb: "Dashboard" },
      },
      // Future: cases, appointments, documents, billing
      // { path: "cases",        meta: { title: "My Cases" } },
      // { path: "appointments", meta: { title: "Appointments" } },
      // { path: "documents",    meta: { title: "Documents" } },
    ],
  },

  // ── Lawyer Dashboard ──
  lawyerDashboard: {
    basePath: PATHS.DASHBOARD_LAWYER,
    requireAuth: true,
    allowedRoles: [roles.LAWYER],
    children: [
      {
        path: "",
        meta: { title: "Lawyer Dashboard", breadcrumb: "Dashboard" },
      },
      // Future: clients, schedule, earnings, profile management
      // { path: "clients",  meta: { title: "My Clients" } },
      // { path: "schedule", meta: { title: "Schedule" } },
      // { path: "earnings", meta: { title: "Earnings" } },
    ],
  },

  // ── Admin Dashboard ──
  adminDashboard: {
    basePath: PATHS.DASHBOARD_ADMIN,
    requireAuth: true,
    allowedRoles: [roles.ADMIN, roles.SUPER_ADMIN],
    children: [
      {
        path: "",
        meta: { title: "Admin Dashboard", breadcrumb: "Dashboard" },
      },
      // Future: user management, analytics, settings, audit logs
      // { path: "users",     meta: { title: "User Management" } },
      // { path: "analytics", meta: { title: "Analytics" } },
      // { path: "settings",  meta: { title: "Platform Settings" } },
      // { path: "audit",     meta: { title: "Audit Logs" } },
    ],
  },
});

export default ROUTE_TREE;
