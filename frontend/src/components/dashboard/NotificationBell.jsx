/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS NOTIFICATION BELL — Store-Connected
 * ══════════════════════════════════════════════════════════════
 *
 * Connected to globalStore. Shows real notifications with:
 *  • Live unread count badge
 *  • Mark individual / all as read
 *  • Dismiss notifications
 *  • Category-based icons
 *  • Relative timestamps
 *  • Role-filtered (via useAuth)
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  CreditCard,
  Briefcase,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { useAuth } from "@context/AuthContext";

// ── Icon mappings ────────────────────────────────────────────

const TYPE_ICONS = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const CATEGORY_ICONS = {
  appointment: Calendar,
  payment: CreditCard,
  case: Briefcase,
  system: Bell,
};

const TYPE_COLORS = {
  info: "text-blue-400 bg-blue-500/10",
  success: "text-emerald-400 bg-emerald-500/10",
  warning: "text-amber-400 bg-amber-500/10",
  error: "text-red-400 bg-red-500/10",
};

// ── Relative time formatter ──────────────────────────────────

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
  });
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const { user } = useAuth();

  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
  } = useAppStore();

  // Filter by role
  const role = user?.role || "client";
  const myNotifications = useMemo(
    () =>
      notifications.filter(
        (n) => !n.targetRole || n.targetRole === role || n.targetRole === "all"
      ),
    [notifications, role]
  );

  const unreadCount = useMemo(
    () => myNotifications.filter((n) => !n.read).length,
    [myNotifications]
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsRead(role);
  }, [markAllNotificationsRead, role]);

  const handleClick = useCallback(
    (notif) => {
      if (!notif.read) markNotificationRead(notif.id);
    },
    [markNotificationRead]
  );

  const handleDismiss = useCallback(
    (e, notifId) => {
      e.stopPropagation();
      dismissNotification(notifId);
    },
    [dismissNotification]
  );

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
          isOpen
            ? "bg-white/[0.08] text-neutral-200"
            : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04]"
        }`}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
      >
        <Bell className="w-[18px] h-[18px]" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold-500 text-dark-950 text-[10px] font-bold shadow-[0_0_8px_rgba(198,167,94,0.4)] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden="true" />

          <div
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 rounded-xl bg-dark-800 border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-down"
            role="dialog"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-neutral-100">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-gold-500/15 text-gold-400 text-[10px] font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {myNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 mx-auto text-neutral-600 mb-3" />
                  <p className="text-sm text-neutral-500">No notifications yet</p>
                </div>
              ) : (
                myNotifications.slice(0, 20).map((notif) => {
                  const CategoryIcon = CATEGORY_ICONS[notif.category] || TYPE_ICONS[notif.type] || Info;
                  const typeColor = TYPE_COLORS[notif.type] || TYPE_COLORS.info;

                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleClick(notif)}
                      className={`group flex items-start gap-3 w-full px-4 py-3 text-left transition-colors duration-150 hover:bg-white/[0.03] ${
                        !notif.read ? "bg-gold-500/[0.02]" : ""
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${typeColor}`}
                      >
                        <CategoryIcon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium truncate ${
                              notif.read ? "text-neutral-400" : "text-neutral-100"
                            }`}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold-500" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-neutral-600 mt-1">
                          {formatRelativeTime(notif.timestamp)}
                        </p>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={(e) => handleDismiss(e, notif.id)}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/[0.06] transition-all"
                        aria-label="Dismiss"
                      >
                        <X className="w-3 h-3 text-neutral-600" />
                      </button>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {myNotifications.length > 0 && (
              <div className="border-t border-white/[0.06] px-4 py-2.5">
                <p className="text-center text-[11px] text-neutral-600">
                  {myNotifications.length} notification{myNotifications.length !== 1 ? "s" : ""}
                  {unreadCount > 0 ? ` · ${unreadCount} unread` : ""}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
