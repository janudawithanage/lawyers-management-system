/**
 * DashboardLayout — Wrapper for authenticated dashboard pages.
 *
 * Future: Sidebar navigation, top bar, breadcrumbs, role-based menus.
 * Currently a placeholder for architecture readiness.
 */

import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@context";

export default function DashboardLayout({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Role-based access control
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 flex">
      {/* Future: <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        {/* Future: <DashboardTopBar /> */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
