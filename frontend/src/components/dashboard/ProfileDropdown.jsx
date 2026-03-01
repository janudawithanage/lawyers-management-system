/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS PROFILE DROPDOWN
 * User menu with role badge, quick links, and sign out.
 * ══════════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  UserCircle,
  Settings,
  LogOut,
  ChevronDown,
  HelpCircle,
  Shield,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { getRoleDisplay } from "@config/navigationConfig";
import { DASHBOARD_ROUTES } from "@/routes/routeConfig";

export default function ProfileDropdown() {
  const { user, role, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const roleDisplay = getRoleDisplay(role);
  const basePath = DASHBOARD_ROUTES[role] || "/dashboard/client";

  // ── Close on outside click ──────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ── Close on Escape ─────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleLogout = useCallback(() => {
    setIsOpen(false);
    logout();
  }, [logout]);

  const menuItems = [
    {
      label: "My Profile",
      icon: UserCircle,
      to: `${basePath}/profile`,
    },
    {
      label: "Settings",
      icon: Settings,
      to: `${basePath}/settings`,
    },
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            icon: Shield,
            to: `${basePath}`,
          },
        ]
      : []),
    {
      label: "Help & Support",
      icon: HelpCircle,
      to: `${basePath}/help`,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-200 ${
          isOpen
            ? "bg-white/[0.06] ring-1 ring-white/10"
            : "hover:bg-white/[0.04]"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-gold-500/30 to-gold-700/30 flex items-center justify-center ring-1 ring-gold-500/20">
          <span className="text-xs font-semibold text-gold-300">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>

        {/* Name + Role (hidden on small screens) */}
        <div className="hidden md:flex flex-col items-start leading-none">
          <span className="text-sm font-medium text-neutral-200 max-w-[120px] truncate">
            {user?.fullName || "User"}
          </span>
          <span className={`text-[10px] font-medium ${roleDisplay.color}`}>
            {roleDisplay.label}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 hidden md:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible backdrop */}
          <div className="fixed inset-0 z-40" aria-hidden="true" />

          <div
            className="absolute right-0 top-full mt-2 w-64 z-50 rounded-xl bg-dark-800 border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-down"
            role="menu"
          >
            {/* User Header */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-gold-500/30 to-gold-700/30 flex items-center justify-center ring-1 ring-gold-500/20">
                  <span className="text-sm font-semibold text-gold-300">
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-100 truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
              {/* Role Badge */}
              <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleDisplay.bgColor} ${roleDisplay.borderColor} ${roleDisplay.color} border`}>
                <span className={`w-1.5 h-1.5 rounded-full ${roleDisplay.dotColor}`} />
                {roleDisplay.label}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1.5">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:text-neutral-100 hover:bg-white/[0.04] transition-colors duration-150"
                  role="menuitem"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Divider + Logout */}
            <div className="border-t border-white/[0.06] py-1.5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/[0.04] transition-colors duration-150"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
