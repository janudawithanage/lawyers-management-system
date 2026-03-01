/**
 * ══════════════════════════════════════════════════════════════
 * USER MANAGEMENT TABLE — Platform User Oversight
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise table for the admin dashboard's user management
 * section. Displays platform users with suspend / activate
 * actions and a detail drawer.
 *
 * Props:
 *   users — Array of platform user entries from mockAdminData
 *
 * Features:
 *  • Desktop table + mobile card layout
 *  • Role badges (client, lawyer, admin)
 *  • Status badges (active, suspended)
 *  • Suspend / activate toggle
 *  • Detail drawer
 *  • Framer Motion row animations
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Scale,
  Shield,
  Mail,
  Clock,
  LogIn,
  Eye,
  Ban,
  CheckCircle2,
  X,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { formatRelativeTime, formatDateTime } from "../data/mockAdminData";

// ── Role config ──────────────────────────────────────────────

const ROLE_CFG = {
  client: {
    label: "Client",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: User,
  },
  lawyer: {
    label: "Lawyer",
    color: "text-gold-400",
    bg: "bg-gold-500/10",
    border: "border-gold-500/20",
    icon: Scale,
  },
  admin: {
    label: "Admin",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: Shield,
  },
};

const STATUS_CFG = {
  active: {
    label: "Active",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  suspended: {
    label: "Suspended",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
};

function RoleBadge({ role }) {
  const cfg = ROLE_CFG[role] || ROLE_CFG.client;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <cfg.icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

function UserStatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.active;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Detail Drawer ────────────────────────────────────────────

function UserDrawer({ user, onClose, onToggle }) {
  if (!user) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex justify-end"
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-dark-900 border-l border-white/[0.08] shadow-2xl overflow-y-auto"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-dark-900/95 backdrop-blur-sm border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">
                User Details
              </h3>
              <p className="text-xs text-neutral-500 font-mono">{user.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-700/60 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-100">
                  {user.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <RoleBadge role={user.role} />
                  <UserStatusBadge status={user.status} />
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Mail, label: "Email", value: user.email },
                { icon: Clock, label: "Joined", value: formatDateTime(user.createdAt) },
                { icon: LogIn, label: "Last Login", value: formatRelativeTime(user.lastLogin) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/[0.04]"
                >
                  <item.icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm text-neutral-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Suspension Reason */}
            {user.suspensionReason && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs font-semibold text-red-400">
                    Suspension Reason
                  </p>
                </div>
                <p className="text-sm text-neutral-300">
                  {user.suspensionReason}
                </p>
              </div>
            )}

            {/* Action */}
            <div className="pt-3 border-t border-white/[0.06]">
              <button
                onClick={() => onToggle(user.id)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  user.status === "active"
                    ? "text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20"
                    : "gradient-gold-btn text-dark-950 hover:opacity-90 shadow-md"
                }`}
              >
                {user.status === "active" ? (
                  <>
                    <Ban className="w-4 h-4" />
                    Suspend Account
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Reactivate Account
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function UserManagementTable({ users }) {
  const [userList, setUserList] = useState(users);
  const [selected, setSelected] = useState(null);

  const handleToggle = (id) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "active" ? "suspended" : "active",
              suspensionReason:
                u.status === "active"
                  ? "Suspended by admin"
                  : undefined,
            }
          : u
      )
    );
    // Update drawer if viewing this user
    setSelected((prev) =>
      prev?.id === id
        ? {
            ...prev,
            status: prev.status === "active" ? "suspended" : "active",
            suspensionReason:
              prev.status === "active" ? "Suspended by admin" : undefined,
          }
        : prev
    );
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["User", "Email", "Role", "Status", "Last Login", "Joined", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className="py-3 px-4 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {userList.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-200">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-mono text-neutral-600">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-400">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="py-3 px-4">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-500">
                    {formatRelativeTime(user.lastLogin)}
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-500">
                    {formatRelativeTime(user.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelected(user)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggle(user.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          user.status === "active"
                            ? "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                            : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                        }`}
                        title={
                          user.status === "active" ? "Suspend" : "Reactivate"
                        }
                      >
                        {user.status === "active" ? (
                          <Ban className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {userList.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-200">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-neutral-500">{user.email}</p>
                </div>
              </div>
              <UserStatusBadge status={user.status} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-2">
                <RoleBadge role={user.role} />
                <span className="text-[10px] text-neutral-600">
                  {formatRelativeTime(user.lastLogin)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggle(user.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    user.status === "active"
                      ? "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20"
                      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20"
                  }`}
                >
                  {user.status === "active" ? "Suspend" : "Activate"}
                </button>
                <button
                  onClick={() => setSelected(user)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <UserDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onToggle={handleToggle}
        />
      )}
    </>
  );
}
