/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN USERS — User Management with Functional Actions
 * ══════════════════════════════════════════════════════════════
 *
 * Full-page user management with FUNCTIONAL suspend/activate:
 *  • KPI stats (total, clients, lawyers, active, suspended)
 *  • Searchable, filterable user table
 *  • Desktop table + mobile card layout
 *  • Suspend/Activate with confirmation modal — mutates state
 *  • User detail drawer
 */

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  Search,
  Filter,
  Scale,
  User,
  Mail,
  Clock,
  Ban,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Eye,
  X,
  AlertTriangle,
  CalendarDays,
  Briefcase,
  ArrowUpDown,
} from "lucide-react";
import { platformUsers as initialUsers, formatRelativeTime, formatFullDate } from "../data/mockAdminData";

// ── Config ───────────────────────────────────────────────────

const ROLE_CFG = {
  client: { label: "Client", icon: User, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  lawyer: { label: "Lawyer", icon: Scale, color: "text-[#C6A75E]", bg: "bg-[#C6A75E]/10", border: "border-[#C6A75E]/20" },
};

const STATUS_CFG = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  suspended: { label: "Suspended", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400" },
};

const ROLE_FILTERS = [
  { value: "all", label: "All Roles" },
  { value: "client", label: "Clients" },
  { value: "lawyer", label: "Lawyers" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

// ── Confirm Modal ────────────────────────────────────────────

function SuspendModal({ isOpen, onClose, onConfirm, action, userName }) {
  if (!isOpen) return null;
  const isSuspend = action === "suspend";
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
            className="relative w-full max-w-md p-6 rounded-2xl bg-dark-800 border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSuspend ? "bg-red-500/10 border border-red-500/20" : "bg-emerald-500/10 border border-emerald-500/20"}`}>
                {isSuspend ? <Ban className="w-5 h-5 text-red-400" /> : <RefreshCw className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-100">{isSuspend ? "Suspend Account" : "Reactivate Account"}</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {isSuspend
                    ? `Suspend ${userName}? They will lose access immediately.`
                    : `Reactivate ${userName}? They will regain full access.`}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-600 mb-5">⚠ This action will be logged in the system audit trail.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 bg-dark-700/60 border border-white/[0.06] hover:text-neutral-200 transition-colors">Cancel</button>
              <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isSuspend ? "text-white bg-red-600 hover:bg-red-500" : "text-dark-950 bg-emerald-500 hover:bg-emerald-400"}`}>
                {isSuspend ? "Suspend" : "Reactivate"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Detail Drawer ────────────────────────────────────────────

function UserDrawer({ user, onClose }) {
  if (!user) return null;
  const role = ROLE_CFG[user.role] || ROLE_CFG.client;
  const status = STATUS_CFG[user.status] || STATUS_CFG.active;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-dark-900 border-l border-white/[0.08] shadow-2xl overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-dark-900/95 backdrop-blur-sm border-b border-white/[0.06]">
            <h3 className="text-lg font-semibold text-neutral-100">User Profile</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark-700/60 transition-colors"><X className="w-5 h-5 text-neutral-400" /></button>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${role.bg} border ${role.border} flex items-center justify-center`}>
                <role.icon className={`w-7 h-7 ${role.color}`} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-neutral-100">{user.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${role.bg} ${role.border} ${role.color}`}>{role.label}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.border} ${status.color}`}>
                    <span className={`w-1 h-1 rounded-full ${status.dot}`} />{status.label}
                  </span>
                </div>
              </div>
            </div>
            {[
              { icon: Mail, label: "Email", value: user.email },
              { icon: Clock, label: "Registered", value: formatFullDate(user.createdAt) },
              { icon: Clock, label: "Last Login", value: formatRelativeTime(user.lastLogin) },
              { icon: CalendarDays, label: "Appointments", value: user.appointmentCount?.toString() || "0" },
              { icon: Briefcase, label: "Cases", value: user.caseCount?.toString() || "0" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/[0.04]">
                <item.icon className="w-4 h-4 text-neutral-500" />
                <div>
                  <p className="text-[10px] text-neutral-600 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm text-neutral-200">{item.value}</p>
                </div>
              </div>
            ))}
            {user.suspendedReason && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs font-semibold text-red-400">Suspension Reason</p>
                </div>
                <p className="text-sm text-neutral-400">{user.suspendedReason}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, action: null, user: null });

  const filtered = useMemo(() => {
    let result = [...users];
    if (roleFilter !== "all") result = result.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all") result = result.filter((u) => u.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return result;
  }, [users, roleFilter, statusFilter, searchQuery, sortField, sortDir]);

  const stats = useMemo(() => [
    { label: "Total Users", value: users.length, icon: Users, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
    { label: "Clients", value: users.filter((u) => u.role === "client").length, icon: User, color: "text-blue-400 bg-blue-500/10" },
    { label: "Lawyers", value: users.filter((u) => u.role === "lawyer").length, icon: Scale, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Active", value: users.filter((u) => u.status === "active").length, icon: CheckCircle2, color: "text-green-400 bg-green-500/10" },
    { label: "Suspended", value: users.filter((u) => u.status === "suspended").length, icon: Ban, color: "text-red-400 bg-red-500/10" },
  ], [users]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleAction = useCallback((action, user) => {
    if (action === "view") setSelectedUser(user);
    else setModal({ isOpen: true, action, user });
  }, []);

  const handleConfirm = useCallback(() => {
    const { action, user } = modal;
    if (!user) return;
    setUsers((prev) => prev.map((u) =>
      u.id === user.id
        ? { ...u, status: action === "suspend" ? "suspended" : "active" }
        : u
    ));
    setModal({ isOpen: false, action: null, user: null });
  }, [modal]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">User Management</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage platform users — clients and lawyers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <p className="text-2xl font-bold text-neutral-100">{s.value}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, email, ID…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {ROLE_FILTERS.map((opt) => (
              <button key={opt.value} onClick={() => setRoleFilter(opt.value)}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${roleFilter === opt.value ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {STATUS_FILTERS.map((opt) => (
              <button key={opt.value} onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${statusFilter === opt.value ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <Users className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No users match your criteria</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[{ key: "name", l: "Name" }, { key: "role", l: "Role" }, { key: "email", l: "Email" }, { key: "status", l: "Status" }, { key: "createdAt", l: "Registered" }, { key: "lastLogin", l: "Last Login" }, { key: "actions", l: "Actions" }].map((col) => (
                      <th key={col.key} onClick={col.key !== "actions" ? () => toggleSort(col.key) : undefined}
                        className={`py-3 px-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap ${col.key !== "actions" ? "cursor-pointer hover:text-neutral-300" : ""}`}>
                        <span className="flex items-center gap-1">{col.l}{sortField === col.key && <ArrowUpDown className="w-3 h-3 text-[#C6A75E]" />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => {
                    const role = ROLE_CFG[user.role] || ROLE_CFG.client;
                    const status = STATUS_CFG[user.status] || STATUS_CFG.active;
                    const RoleIcon = role.icon;
                    return (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.02 }}
                        className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-dark-700/60 border border-white/[0.06] flex items-center justify-center"><RoleIcon className="w-3.5 h-3.5 text-neutral-500" /></div>
                            <p className="text-sm font-medium text-neutral-200">{user.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${role.bg} ${role.border} ${role.color}`}>{role.label}</span></td>
                        <td className="py-3 px-4 text-xs text-neutral-400">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.border} ${status.color}`}>
                            <span className={`w-1 h-1 rounded-full ${status.dot}`} />{status.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-neutral-500">{formatRelativeTime(user.createdAt)}</td>
                        <td className="py-3 px-4 text-xs text-neutral-600">{formatRelativeTime(user.lastLogin)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {user.status === "active" ? (
                              <button onClick={() => handleAction("suspend", user)} className="p-1.5 rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors" title="Suspend"><Ban className="w-3.5 h-3.5" /></button>
                            ) : (
                              <button onClick={() => handleAction("activate", user)} className="p-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors" title="Activate"><RefreshCw className="w-3.5 h-3.5" /></button>
                            )}
                            <button onClick={() => handleAction("view", user)} className="p-1.5 rounded-lg text-neutral-400 hover:text-[#C6A75E] hover:bg-[#C6A75E]/10 transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3">
            {filtered.map((user, i) => {
              const role = ROLE_CFG[user.role] || ROLE_CFG.client;
              const status = STATUS_CFG[user.status] || STATUS_CFG.active;
              return (
                <motion.div key={user.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-200">{user.name}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${role.bg} ${role.border} ${role.color}`}>{role.label}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.border} ${status.color}`}>
                        <span className={`w-1 h-1 rounded-full ${status.dot}`} />{status.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                    {user.status === "active" ? (
                      <button onClick={() => handleAction("suspend", user)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"><Ban className="w-3 h-3" /> Suspend</button>
                    ) : (
                      <button onClick={() => handleAction("activate", user)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-dark-950 bg-emerald-500 hover:bg-emerald-400 transition-colors"><RefreshCw className="w-3 h-3" /> Activate</button>
                    )}
                    <button onClick={() => handleAction("view", user)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-dark-700/60 border border-white/[0.06] hover:text-[#C6A75E] transition-colors ml-auto"><Eye className="w-3 h-3" /> Profile</button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-[11px] text-neutral-600 text-center">Showing {filtered.length} of {users.length} users</p>

      {selectedUser && <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />}
      <SuspendModal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false, action: null, user: null })} onConfirm={handleConfirm} action={modal.action} userName={modal.user?.name} />
    </div>
  );
}
