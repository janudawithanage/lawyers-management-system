/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS DASHBOARD LAYOUT — Enterprise Grade
 * ══════════════════════════════════════════════════════════════
 *
 * Full layout with:
 *  • Collapsible sidebar with hover-to-peek
 *  • Sticky top navbar with search & notifications
 *  • Mobile drawer navigation
 *  • Responsive content area with proper offsets
 */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { useSidebar } from "@hooks";
import Sidebar from "@components/dashboard/Sidebar";
import TopNavbar from "@components/dashboard/TopNavbar";
import MobileDrawer from "@components/dashboard/MobileDrawer";
import { ScrollToTop } from "@components/common";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    isCollapsed,
    isExpanded,
    toggle,
    handleMouseEnter,
    handleMouseLeave,
  } = useSidebar();

  const sidebarWidth = isCollapsed && !isExpanded ? "72px" : "260px";

  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100">
      <ScrollToTop />

      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isCollapsed}
          isExpanded={isExpanded}
          onToggle={toggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {/* ── Mobile Drawer ── */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* ── Main Content Area ── */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ marginLeft: `var(--sidebar-w, 0px)` }}
      >
        <style>{`:root { --sidebar-w: 0px; } @media (min-width: 1024px) { :root { --sidebar-w: ${sidebarWidth}; } }`}</style>

        {/* ── Top Navbar ── */}
        <TopNavbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {/* ── Page Content ── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>

        {/* ── Footer ── */}
        <footer className="px-6 py-4 border-t border-white/[0.04]">
          <p className="text-[11px] text-neutral-600 text-center">
            © 2026 Sri Lanka Lawyer Management System • Logged in as{" "}
            <span className="text-neutral-400 capitalize">{user?.role}</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
