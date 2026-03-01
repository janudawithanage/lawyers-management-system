/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS NOTIFICATION BANNER — System-Wide Alerts
 * ══════════════════════════════════════════════════════════════
 *
 * Renders floating notification toasts from the global store.
 * Auto-dismisses after 6 seconds. Premium dark-theme styling.
 */

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";

// We use a simple event-based system so this works even without store
const listeners = new Set();
let notifications = [];

export function pushNotification(notification) {
  const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
  const entry = { id, ...notification, timestamp: Date.now() };
  notifications = [entry, ...notifications].slice(0, 10);
  listeners.forEach((fn) => fn([...notifications]));
}

export function dismissNotification(id) {
  notifications = notifications.filter((n) => n.id !== id);
  listeners.forEach((fn) => fn([...notifications]));
}

const TYPE_CONFIG = {
  success: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

function NotificationToast({ notification, onDismiss }) {
  const [exiting, setExiting] = useState(false);
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(notification.id), 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg transition-all duration-300 ${config.bg} ${config.border} ${
        exiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`} />
      <div className="flex-1 min-w-0">
        {notification.title && (
          <p className="text-sm font-semibold text-neutral-100">{notification.title}</p>
        )}
        {notification.message && (
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(notification.id), 300);
        }}
        className="flex-shrink-0 p-1 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.06] transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function NotificationBanner() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    listeners.add(setItems);
    return () => listeners.delete(setItems);
  }, []);

  const handleDismiss = useCallback((id) => {
    dismissNotification(id);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {items.slice(0, 5).map((notif) => (
        <div key={notif.id} className="pointer-events-auto">
          <NotificationToast notification={notif} onDismiss={handleDismiss} />
        </div>
      ))}
    </div>
  );
}
