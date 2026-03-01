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
      { path: "", meta: { title: "Client Dashboard", breadcrumb: "Dashboard" } },
      { path: "find-lawyer", meta: { title: "Find a Lawyer", breadcrumb: "Find Lawyer" } },
      { path: "find-lawyer/:lawyerId", meta: { title: "Lawyer Profile", breadcrumb: "Lawyer Details" } },
      { path: "find-lawyer/:lawyerId/book", meta: { title: "Book Consultation", breadcrumb: "Book" } },
      { path: "appointments", meta: { title: "My Appointments", breadcrumb: "Appointments" } },
      { path: "cases", meta: { title: "My Cases", breadcrumb: "Cases" } },
      { path: "cases/:caseId", meta: { title: "Case Details", breadcrumb: "Case" } },
      { path: "payments", meta: { title: "Payments", breadcrumb: "Payments" } },
      { path: "messages", meta: { title: "Messages", breadcrumb: "Messages" } },
      { path: "documents", meta: { title: "Documents", breadcrumb: "Documents" } },
      { path: "profile", meta: { title: "My Profile", breadcrumb: "Profile" } },
      { path: "settings", meta: { title: "Settings", breadcrumb: "Settings" } },
      { path: "help", meta: { title: "Help & Support", breadcrumb: "Help" } },
    ],
  },

  // ── Lawyer Dashboard ──
  lawyerDashboard: {
    basePath: PATHS.DASHBOARD_LAWYER,
    requireAuth: true,
    allowedRoles: [roles.LAWYER],
    children: [
      { path: "", meta: { title: "Lawyer Dashboard", breadcrumb: "Dashboard" } },
      { path: "appointments", meta: { title: "Appointments", breadcrumb: "Appointments" } },
      { path: "consultations", meta: { title: "Consultations", breadcrumb: "Consultations" } },
      { path: "cases", meta: { title: "Cases", breadcrumb: "Cases" } },
      { path: "cases/new", meta: { title: "New Case", breadcrumb: "New Case" } },
      { path: "cases/:caseId", meta: { title: "Case Details", breadcrumb: "Case" } },
      { path: "documents", meta: { title: "Documents", breadcrumb: "Documents" } },
      { path: "schedule", meta: { title: "Schedule", breadcrumb: "Schedule" } },
      { path: "earnings", meta: { title: "Earnings", breadcrumb: "Earnings" } },
      { path: "profile", meta: { title: "Public Profile", breadcrumb: "Profile" } },
      { path: "settings", meta: { title: "Settings", breadcrumb: "Settings" } },
      { path: "help", meta: { title: "Help & Support", breadcrumb: "Help" } },
    ],
  },

  // ── Admin Dashboard ──
  adminDashboard: {
    basePath: PATHS.DASHBOARD_ADMIN,
    requireAuth: true,
    allowedRoles: [roles.ADMIN, roles.SUPER_ADMIN],
    children: [
      { path: "", meta: { title: "Admin Dashboard", breadcrumb: "Dashboard" } },
      { path: "verification", meta: { title: "Lawyer Verification", breadcrumb: "Verification" } },
      { path: "users", meta: { title: "User Management", breadcrumb: "Users" } },
      { path: "appointments", meta: { title: "Appointments Monitor", breadcrumb: "Appointments" } },
      { path: "cases", meta: { title: "Cases Monitor", breadcrumb: "Cases" } },
      { path: "payments", meta: { title: "Payments Monitor", breadcrumb: "Payments" } },
      { path: "disputes", meta: { title: "Dispute Resolution", breadcrumb: "Disputes" } },
      { path: "config", meta: { title: "System Configuration", breadcrumb: "Config" } },
      { path: "reports", meta: { title: "Reports & Analytics", breadcrumb: "Reports" } },
      { path: "notifications", meta: { title: "Notifications", breadcrumb: "Notifications" } },
      { path: "audit", meta: { title: "System Logs", breadcrumb: "Audit" } },
      { path: "settings", meta: { title: "Platform Settings", breadcrumb: "Settings" } },
      { path: "profile", meta: { title: "Admin Profile", breadcrumb: "Profile" } },
      { path: "help", meta: { title: "Help & Support", breadcrumb: "Help" } },
    ],
  },
});

export default ROUTE_TREE;
