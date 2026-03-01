/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN NOTIFICATIONS — System Notification Center
 * ══════════════════════════════════════════════════════════════
 *
 * Full-page notification management for administrators.
 * Displays system alerts, verification notices, and security events.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Shield,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  Trash2,
  Clock,
  Ban,
  RefreshCw,
  Settings,
} from "lucide-react";

// Mock notification data
const mockNotifications = [
  {
    id: "NOTIF-001",
    type: "verification",
    title: "New Verification Request",
    message: "Atty. A.B. Jayasuriya submitted verification documents for review.",
    severity: "info",
    timestamp: "2026-02-28T07:30:00",
    read: false,
  },
  {
    id: "NOTIF-002",
    type: "security",
    title: "Suspicious Login Attempt",
    message: "Multiple failed login attempts detected from IP 203.94.12.45 for account USR-007.",
    severity: "critical",
    timestamp: "2026-02-28T06:15:00",
    read: false,
  },
  {
    id: "NOTIF-003",
    type: "system",
    title: "Database Backup Complete",
    message: "Automated daily backup completed successfully. 2.4 GB archived.",
    severity: "info",
    timestamp: "2026-02-28T03:00:00",
    read: true,
  },
  {
    id: "NOTIF-004",
    type: "complaint",
    title: "New Client Complaint",
    message: "Complaint #CMP-2026-0019 filed against Atty. K. Perera — delayed response.",
    severity: "warning",
    timestamp: "2026-02-27T16:45:00",
    read: false,
  },
  {
    id: "NOTIF-005",
    type: "verification",
    title: "Verification Approved",
    message: "Atty. D.P. Karunaratne verification was approved by System Admin.",
    severity: "info",
    timestamp: "2026-02-27T14:30:00",
    read: true,
  },
  {
    id: "NOTIF-006",
    type: "system",
    title: "Service Degradation Detected",
    message: "Email Service performance degraded to 98.2% uptime. Monitoring in progress.",
    severity: "warning",
    timestamp: "2026-02-27T12:00:00",
    read: true,
  },
  {
    id: "NOTIF-007",
    type: "security",
    title: "Account Suspended",
    message: "Atty. Nimalka Fernando (USR-004) suspended due to complaint investigation.",
    severity: "critical",
    timestamp: "2026-02-27T10:30:00",
    read: true,
  },
  {
    id: "NOTIF-008",
    type: "system",
    title: "SSL Certificate Renewal",
    message: "Platform SSL certificate renewed successfully. Valid until March 2027.",
    severity: "info",
    timestamp: "2026-02-26T09:00:00",
    read: true,
  },
];

const TYPE_CONFIG = {
  verification: { icon: ShieldCheck, color: "text-[#C6A75E]", bg: "bg-[#C6A75E]/10", border: "border-[#C6A75E]/15" },
  security: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/15" },
  system: { icon: Settings, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/15" },
  complaint: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/15" },
};

const SEVERITY_DOT = {
  info: "bg-blue-400",
  warning: "bg-amber-400",
  critical: "bg-red-400 animate-pulse",
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "verification", label: "Verification" },
  { id: "security", label: "Security" },
  { id: "system", label: "System" },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = [...notifications];
    if (activeTab === "unread") result = result.filter((n) => !n.read);
    else if (activeTab !== "all") result = result.filter((n) => n.type === activeTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((n) =>
        n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [notifications, activeTab, searchQuery]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffH = Math.floor((now - d) / 3600000);
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH}h ago`;
    return d.toLocaleDateString("en-LK", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#C6A75E]" />
            <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Notifications</h1>
          <p className="text-sm text-neutral-500 mt-1">System alerts, security events, and verification notices</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#C6A75E] bg-[#C6A75E]/10 border border-[#C6A75E]/20 hover:bg-[#C6A75E]/15 transition-colors">
            <Check className="w-3.5 h-3.5" /> Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {FILTER_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1.5 text-[10px] font-medium transition-colors ${activeTab === tab.id ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <Bell className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No notifications</p>
          <p className="text-xs text-neutral-600 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((notif, i) => {
              const typeConfig = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
              const TypeIcon = typeConfig.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`group relative p-4 rounded-xl border transition-all ${
                    notif.read
                      ? "bg-dark-800/30 border-white/[0.04]"
                      : `bg-dark-800/60 ${typeConfig.border} border-l-2`
                  } hover:bg-dark-700/40`}
                >
                  <div className="flex gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeConfig.bg}`}>
                      <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-semibold ${notif.read ? "text-neutral-400" : "text-neutral-200"}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[notif.severity] || SEVERITY_DOT.info}`} />
                          <span className="text-[10px] text-neutral-600">{formatTime(notif.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                          <button onClick={() => markAsRead(notif.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                            <Check className="w-3 h-3" /> Mark read
                          </button>
                        )}
                        <button onClick={() => dismiss(notif.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium text-neutral-500 bg-dark-700/60 border border-white/[0.06] hover:text-red-400 hover:border-red-500/20 transition-colors">
                          <Trash2 className="w-3 h-3" /> Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
