/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS DASHBOARD LAYOUT
 * Wrapper for all authenticated dashboard pages.
 *
 * Authentication and role checks are handled OUTSIDE this component
 * by ProtectedRoute and RoleRoute in the route tree.
 * This layout focuses purely on UI structure.
 *
 * Future: Sidebar navigation, top bar, breadcrumbs, role-based menus,
 *         notifications bell, command palette.
 * ══════════════════════════════════════════════════════════════
 */

import { Outlet } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 flex">
      {/* ── Sidebar (future) ── */}
      {/* <DashboardSidebar role={user?.role} /> */}

      <div className="flex-1 flex flex-col">
        {/* ── Top Bar (future) ── */}
        {/* <DashboardTopBar user={user} /> */}

        {/* ── Main Content ── */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>

        {/* ── Footer ── */}
        <footer className="px-6 py-4 border-t border-white/5">
          <p className="text-xs text-neutral-600 text-center">
            © 2026 SL-LMS • Logged in as{" "}
            <span className="text-neutral-400 capitalize">{user?.role}</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
