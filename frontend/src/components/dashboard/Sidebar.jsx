/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS SIDEBAR — Premium Enterprise Navigation
 * ══════════════════════════════════════════════════════════════
 *
 * Features:
 *  • Role-based navigation (auto-adapts to user role)
 *  • Collapsible with hover-to-peek & keyboard shortcut (⌘B)
 *  • Grouped sections with dividers
 *  • Gold active states matching BASL brand
 *  • User info section with role badge
 *  • Smooth width transitions
 *  • Full accessibility (ARIA, keyboard nav)
 */

import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from "lucide-react";

import Logo from "@components/common/Logo";
import SidebarItem from "./SidebarItem";
import { getNavigationForRole, getRoleDisplay } from "@config/navigationConfig";
import { useAuth } from "@context/AuthContext";
import { DASHBOARD_ROUTES } from "@/routes/routeConfig";

export default function Sidebar({
  isCollapsed,
  isExpanded,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}) {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const navItems = useMemo(() => getNavigationForRole(role), [role]);
  const roleDisplay = useMemo(() => getRoleDisplay(role), [role]);
  const basePath = DASHBOARD_ROUTES[role] || "/dashboard/client";

  // Group navigation items by their `group` property
  const groupedItems = useMemo(() => {
    const groups = [];
    let currentGroup = null;

    navItems.forEach((item) => {
      if (item.group && item.group !== currentGroup) {
        currentGroup = item.group;
        groups.push({ type: "header", label: item.group, id: `group-${item.group}` });
      }
      groups.push({ type: "item", data: item, id: `nav-${item.id}` });
    });

    return groups;
  }, [navItems]);

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed top-0 left-0 z-30 h-screen flex flex-col border-r border-white/[0.06] bg-dark-900/95 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isCollapsed && !isExpanded ? "w-[72px]" : "w-[260px]"
      }`}
      role="navigation"
      aria-label="Main sidebar navigation"
    >
      {/* ── Header: Logo + Collapse Toggle ────────────────────── */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06] flex-shrink-0">
        <div className={`overflow-hidden transition-all duration-300 ${
          isCollapsed && !isExpanded ? "w-10" : "w-auto"
        }`}>
          <Logo variant={isCollapsed && !isExpanded ? "compact" : "default"} />
        </div>

        {isExpanded && (
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.06] transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={`${isCollapsed ? "Expand" : "Collapse"} sidebar (⌘B)`}
          >
            {isCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* ── Navigation Items ──────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 scrollbar-thin">
        {groupedItems.map((entry) => {
          if (entry.type === "header") {
            return isExpanded ? (
              <div
                key={entry.id}
                className="pt-4 pb-1 px-3 first:pt-0"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                  {entry.label}
                </p>
              </div>
            ) : (
              <div
                key={entry.id}
                className="pt-3 pb-1 px-3 first:pt-0"
              >
                <div className="h-px bg-white/[0.04]" />
              </div>
            );
          }

          return (
            <SidebarItem
              key={entry.id}
              item={entry.data}
              basePath={basePath}
              isExpanded={isExpanded}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </nav>

      {/* ── User Section (bottom) ─────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-3 space-y-2">
        {/* User Info */}
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${
          isExpanded ? "" : "justify-center"
        }`}>
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-gold-500/30 to-gold-700/30 flex items-center justify-center ring-1 ring-gold-500/20">
              <span className="text-sm font-semibold text-gold-300">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-dark-900" />
          </div>

          {isExpanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">
                {user?.fullName || "User"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${roleDisplay.dotColor}`} />
                <span className={`text-[11px] font-medium ${roleDisplay.color}`}>
                  {roleDisplay.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 group ${
            isExpanded ? "" : "justify-center"
          }`}
          title={isCollapsed && !isExpanded ? "Sign Out" : undefined}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {isExpanded && (
            <span className="text-sm font-medium">Sign Out</span>
          )}
        </button>
      </div>
    </aside>
  );
}
