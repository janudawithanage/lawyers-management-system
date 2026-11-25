/**
 * SL-LMS Route Definitions — Barrel Export
 *
 * Re-exports the route tree and the route guard components. Components only,
 * so Vite can hot-update this module; path constants and role mappings are
 * imported straight from ./routeConfig.
 *
 * The actual route configuration lives in:
 *   • AppRoutes.jsx  — component tree
 *   • routeConfig.js — path constants & role mappings
 */

import AppRoutes from "./AppRoutes";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export { AppRoutes, ProtectedRoute, RoleRoute };
export default AppRoutes;
