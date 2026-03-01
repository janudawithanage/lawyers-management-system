/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS MOBILE DRAWER — Slide-Over Navigation
 * ══════════════════════════════════════════════════════════════
 *
 * Full-screen overlay sidebar for mobile/tablet devices.
 * Includes backdrop with blur, slide animation, and swipe-to-close.
 */

import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

import Logo from "@components/common/Logo";
import SidebarItem from "./SidebarItem";
import { getNavigationForRole, getRoleDisplay } from "@config/navigationConfig";
import { useAuth } from "@context/AuthContext";
import { DASHBOARD_ROUTES } from "@/routes/routeConfig";

export default function MobileDrawer({ isOpen, onClose }) {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const navItems = useMemo(() => getNavigationForRole(role), [role]);
  const roleDisplay = useMemo(() => getRoleDisplay(role), [role]);
  const basePath = DASHBOARD_ROUTES[role] || "/dashboard/client";

  // ── Close on route change ───────────────────────────────────
  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ── Lock body scroll when open ──────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Group items
  const groupedItems = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    navItems.forEach((item) => {
      if (item.group && item.group !== currentGroup) {
        currentGroup = item.group;
        groups.push({ type: "header", label: item.group, id: `mgroup-${item.group}` });
      }
      groups.push({ type: "item", data: item, id: `mnav-${item.id}` });
    });

    return groups;
  }, [navItems]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[280px] flex flex-col bg-dark-900 border-r border-white/[0.06] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06] flex-shrink-0">
          <Logo />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.06] transition-all duration-200"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── User Card ───────────────────────────────────────── */}
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-gold-500/30 to-gold-700/30 flex items-center justify-center ring-1 ring-gold-500/20">
                <span className="text-sm font-semibold text-gold-300">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-100 truncate">
                {user?.fullName || "User"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${roleDisplay.dotColor}`} />
                <span className={`text-[11px] font-medium ${roleDisplay.color}`}>
                  {roleDisplay.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation ──────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {groupedItems.map((entry) => {
            if (entry.type === "header") {
              return (
                <div key={entry.id} className="pt-4 pb-1 px-3 first:pt-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    {entry.label}
                  </p>
                </div>
              );
            }

            return (
              <SidebarItem
                key={entry.id}
                item={entry.data}
                basePath={basePath}
                isExpanded={true}
                isCollapsed={false}
              />
            );
          })}
        </nav>

        {/* ── Footer: Logout ──────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-white/[0.06] p-3">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
