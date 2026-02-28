/**
 * SL-LMS Route Definitions — Barrel Export
 *
 * Re-exports the centralised route tree and utilities.
 * The actual route configuration lives in:
 *   • AppRoutes.jsx  — component tree
 *   • routeConfig.js — path constants & role mappings
 */

export { default } from "./AppRoutes";
export { PATHS, DASHBOARD_ROUTES, resolveDashboard, ROUTE_TREE } from "./routeConfig";
export { default as ProtectedRoute } from "./ProtectedRoute";
export { default as RoleRoute } from "./RoleRoute";
