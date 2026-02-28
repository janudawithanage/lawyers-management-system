/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS ROLE ROUTE — Role-Based Access Guard
 * ══════════════════════════════════════════════════════════════
 *
 * Use INSIDE a <ProtectedRoute> (authentication is already checked).
 *
 * Props:
 *   allowedRoles: string[]  — roles permitted to access this route
 *
 * Behaviour:
 *   • User role is in allowedRoles → render children / <Outlet />
 *   • User role is NOT in allowedRoles → redirect to user's
 *     correct dashboard (not a generic 403 page)
 *
 * This ensures a client who manually types /dashboard/admin
 * is sent to /dashboard/client — not to a dead-end error page.
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { resolveDashboard } from "@/routes/routeConfig";

export default function RoleRoute({ allowedRoles = [], children }) {
  const { role } = useAuth();

  // If the user's role is not in the allowed list, redirect them
  // to their own dashboard — graceful, not punitive.
  if (!allowedRoles.includes(role)) {
    return <Navigate to={resolveDashboard(role)} replace />;
  }

  // Role matches — render the guarded content
  return children ?? <Outlet />;
}
