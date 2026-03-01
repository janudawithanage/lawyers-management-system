/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS NOTIFICATION BELL
 * Notification icon with badge count and dropdown panel.
 * ══════════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock, Info, AlertTriangle } from "lucide-react";

// ── Mock notifications (replace with real data hook later) ───
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "info",
    title: "Appointment Confirmed",
    message: "Your consultation with Atty. Perera is confirmed for tomorrow at 10 AM.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Document Uploaded",
    message: "Case #1024 documents have been successfully uploaded.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Payment Due",
    message: "Invoice #INV-2024-003 is due in 3 days.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "info",
    title: "System Update",
    message: "New features have been added to the dashboard.",
    time: "1 day ago",
    read: true,
  },
];

const TYPE_ICONS = {
  info: Info,
  success: Check,
  warning: AlertTriangle,
  pending: Clock,
};

const TYPE_COLORS = {
  info: "text-blue-400 bg-blue-500/10",
  success: "text-emerald-400 bg-emerald-500/10",
  warning: "text-amber-400 bg-amber-500/10",
  pending: "text-neutral-400 bg-neutral-500/10",
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Close on outside click ──────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

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

        {/* Badge */}
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
                  onClick={markAllRead}
                  className="text-xs text-gold-500 hover:text-gold-400 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-8 h-8 mx-auto text-neutral-600 mb-3" />
                  <p className="text-sm text-neutral-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const TypeIcon = TYPE_ICONS[notification.type] || Info;
                  const typeColor = TYPE_COLORS[notification.type] || TYPE_COLORS.info;

                  return (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`flex items-start gap-3 w-full px-4 py-3 text-left transition-colors duration-150 hover:bg-white/[0.03] ${
                        !notification.read ? "bg-gold-500/[0.02]" : ""
                      }`}
                    >
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${typeColor}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium truncate ${
                            notification.read ? "text-neutral-400" : "text-neutral-100"
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold-500" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-neutral-600 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] px-4 py-2.5">
              <button className="w-full text-center text-xs text-gold-500 hover:text-gold-400 font-medium transition-colors">
                View All Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
