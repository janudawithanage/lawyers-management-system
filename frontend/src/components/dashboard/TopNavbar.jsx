/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS TOP NAVBAR — Dashboard Header Bar
 * ══════════════════════════════════════════════════════════════
 *
 * Features:
 *  • Sticky top bar with glass blur background
 *  • Mobile hamburger menu trigger
 *  • Global search input (placeholder — future)
 *  • Notification bell with badge
 *  • User profile dropdown
 *  • Breadcrumb zone
 *  • Responsive: collapses gracefully on mobile
 */

import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Search, Command } from "lucide-react";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "@context/AuthContext";
import { getNavigationForRole } from "@config/navigationConfig";
import { DASHBOARD_ROUTES } from "@/routes/routeConfig";

export default function TopNavbar({ onMobileMenuToggle }) {
  const { role } = useAuth();
  const location = useLocation();
  const basePath = DASHBOARD_ROUTES[role] || "/dashboard/client";

  // ── Derive current page title from nav config ──────────────
  const pageTitle = useMemo(() => {
    const navItems = getNavigationForRole(role);
    const currentPath = location.pathname.replace(basePath, "").replace(/^\//, "");

    const activeItem = navItems.find((item) => {
      if (item.path === "" && currentPath === "") return true;
      if (item.path && currentPath.startsWith(item.path)) return true;
      return false;
    });

    return activeItem?.label || "Dashboard";
  }, [role, location.pathname, basePath]);

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 lg:px-6 border-b border-white/[0.06] bg-dark-950/80 backdrop-blur-xl"
      role="banner"
    >
      {/* ── Left Section ──────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.06] transition-all duration-200"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-neutral-100 tracking-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* ── Right Section ─────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Search Bar (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800/60 border border-white/[0.06] text-neutral-500 hover:border-white/[0.1] transition-colors duration-200 cursor-pointer group w-56 lg:w-64">
          <Search className="w-4 h-4 flex-shrink-0 group-hover:text-neutral-400" />
          <span className="text-sm flex-1">Search…</span>
          <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-dark-700 border border-white/[0.08] text-[10px] font-medium text-neutral-600">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </div>

        {/* Mobile Search Icon */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04] transition-all duration-200"
          aria-label="Search"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-white/[0.06] mx-1" />

        {/* Notification Bell */}
        <NotificationBell />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
