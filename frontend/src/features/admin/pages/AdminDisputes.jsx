/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN DISPUTES — Platform Dispute Resolution Centre
 * ══════════════════════════════════════════════════════════════
 *
 * Full-page dispute management with FUNCTIONAL status changes:
 *  • KPI stats (open, under review, escalated, resolved, dismissed)
 *  • Searchable, filterable dispute table
 *  • Desktop table + mobile card layout
 *  • Detail drawer with full timeline
 *  • Status change actions (review, resolve, escalate, dismiss) mutate state
 *  • Confirmation modal
 */

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Search,
  Filter,
  AlertTriangle,
  Eye,
  Scale,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  X,
  MessageSquare,
  FileWarning,
  ShieldAlert,
  ChevronRight,
  ArrowUpCircle,
  Gavel,
  Ban,
  Mail,
  Briefcase,
  CalendarDays,
} from "lucide-react";
import {
  disputes as initialDisputes,
  DisputeStatus,
  DisputePriority,
  DisputeCategory,
  formatRelativeTime,
  formatFullDate,
  formatDateTime,
} from "../data/mockAdminData";

// ── Config ───────────────────────────────────────────────────

const STATUS_CFG = {
  [DisputeStatus.OPEN]: { label: "Open", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400 animate-pulse" },
  [DisputeStatus.UNDER_REVIEW]: { label: "Under Review", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
  [DisputeStatus.ESCALATED]: { label: "Escalated", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400 animate-pulse" },
  [DisputeStatus.RESOLVED]: { label: "Resolved", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  [DisputeStatus.DISMISSED]: { label: "Dismissed", color: "text-neutral-400", bg: "bg-neutral-500/10", border: "border-neutral-500/20", dot: "bg-neutral-400" },
};

const PRIORITY_CFG = {
  [DisputePriority.LOW]: { label: "Low", color: "text-neutral-400", bg: "bg-neutral-500/10", border: "border-neutral-500/20" },
  [DisputePriority.MEDIUM]: { label: "Medium", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  [DisputePriority.HIGH]: { label: "High", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  [DisputePriority.CRITICAL]: { label: "Critical", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: DisputeStatus.OPEN, label: "Open" },
  { value: DisputeStatus.UNDER_REVIEW, label: "Review" },
  { value: DisputeStatus.ESCALATED, label: "Escalated" },
  { value: DisputeStatus.RESOLVED, label: "Resolved" },
  { value: DisputeStatus.DISMISSED, label: "Dismissed" },
];

const PRIORITY_FILTERS = [
  { value: "all", label: "All" },
  { value: DisputePriority.CRITICAL, label: "Critical" },
  { value: DisputePriority.HIGH, label: "High" },
  { value: DisputePriority.MEDIUM, label: "Medium" },
  { value: DisputePriority.LOW, label: "Low" },
];

/** Available actions per status */
function getActions(status) {
  switch (status) {
    case DisputeStatus.OPEN:
      return [
        { action: DisputeStatus.UNDER_REVIEW, label: "Start Review", icon: Eye, color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20" },
        { action: DisputeStatus.DISMISSED, label: "Dismiss", icon: Ban, color: "text-neutral-400 bg-neutral-500/10 border-neutral-500/20 hover:bg-neutral-500/20" },
      ];
    case DisputeStatus.UNDER_REVIEW:
      return [
        { action: DisputeStatus.RESOLVED, label: "Resolve", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" },
        { action: DisputeStatus.ESCALATED, label: "Escalate", icon: ArrowUpCircle, color: "text-red-400 bg-red-500/10 border-red-500/20 hover:bg-red-500/20" },
      ];
    case DisputeStatus.ESCALATED:
      return [
        { action: DisputeStatus.RESOLVED, label: "Resolve", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" },
      ];
    default:
      return [];
  }
}

// ── Status Badge ─────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG[DisputeStatus.OPEN];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
      <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />{cfg.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CFG[priority] || PRIORITY_CFG[DisputePriority.LOW];
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}>{cfg.label}</span>
  );
}

// ── Confirm Modal ────────────────────────────────────────────

function ActionModal({ isOpen, onClose, onConfirm, targetStatus, disputeId }) {
  if (!isOpen) return null;
  const cfg = STATUS_CFG[targetStatus] || STATUS_CFG[DisputeStatus.OPEN];
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md p-6 rounded-2xl bg-dark-800 border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                <Gavel className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-100">Change Dispute Status</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  Mark <span className="font-mono text-neutral-300">{disputeId}</span> as <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>?
                </p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-600 mb-5">⚠ This action will be recorded in the dispute timeline.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 bg-dark-700/60 border border-white/[0.06] hover:text-neutral-200 transition-colors">Cancel</button>
              <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${cfg.bg} ${cfg.color} border ${cfg.border} hover:brightness-125`}>
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Detail Drawer ────────────────────────────────────────────

function DisputeDrawer({ dispute, onClose, onAction }) {
  if (!dispute) return null;
  const priorityCfg = PRIORITY_CFG[dispute.priority] || PRIORITY_CFG[DisputePriority.LOW];
  const actions = getActions(dispute.status);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-dark-900 border-l border-white/[0.08] shadow-2xl overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-dark-900/95 backdrop-blur-sm border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">Dispute Details</h3>
              <p className="text-xs text-neutral-500 font-mono">{dispute.id}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark-700/60 transition-colors"><X className="w-5 h-5 text-neutral-400" /></button>
          </div>

          <div className="p-6 space-y-5">
            {/* Subject + Status */}
            <div>
              <h4 className="text-base font-bold text-neutral-100 mb-2">{dispute.subject}</h4>
              <div className="flex items-center gap-2">
                <StatusBadge status={dispute.status} />
                <PriorityBadge priority={dispute.priority} />
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-300 bg-dark-700/60 border border-white/[0.06]">{dispute.category}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.04]">
              <p className="text-sm text-neutral-300 leading-relaxed">{dispute.description}</p>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-dark-800/40 border border-white/[0.04]">
                <p className="text-[10px] text-neutral-600 uppercase tracking-wide mb-1">Filed By</p>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <div>
                    <p className="text-sm text-neutral-200">{dispute.filedBy}</p>
                    <p className="text-[10px] text-neutral-500 capitalize">{dispute.filedByRole}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-dark-800/40 border border-white/[0.04]">
                <p className="text-[10px] text-neutral-600 uppercase tracking-wide mb-1">Against</p>
                <div className="flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-[#C6A75E]" />
                  <div>
                    <p className="text-sm text-neutral-200">{dispute.against}</p>
                    <p className="text-[10px] text-neutral-500 capitalize">{dispute.againstRole}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: CalendarDays, label: "Filed", value: formatFullDate(dispute.filedAt) },
                { icon: Clock, label: "Last Updated", value: formatRelativeTime(dispute.lastUpdated) },
                ...(dispute.relatedCaseId ? [{ icon: Briefcase, label: "Related Case", value: dispute.relatedCaseId }] : []),
                ...(dispute.relatedAppointmentId ? [{ icon: CalendarDays, label: "Related Appt.", value: dispute.relatedAppointmentId }] : []),
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 p-3 rounded-xl bg-dark-800/40 border border-white/[0.04]">
                  <item.icon className="w-3.5 h-3.5 text-neutral-500" />
                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wide">{item.label}</p>
                    <p className="text-xs text-neutral-300">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resolution */}
            {dispute.resolution && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <p className="text-xs font-semibold text-emerald-400">Resolution</p>
                </div>
                <p className="text-sm text-neutral-300">{dispute.resolution}</p>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Timeline</h5>
              <div className="space-y-0">
                {dispute.timeline.map((entry, i) => (
                  <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < dispute.timeline.length - 1 && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-white/[0.06]" />}
                    <div className="relative w-4 h-4 mt-0.5 rounded-full bg-dark-700 border border-white/[0.10] flex-shrink-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C6A75E]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold text-neutral-200">{entry.action}</p>
                        <span className="text-[10px] text-neutral-600">by {entry.by}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{entry.note}</p>
                      <p className="text-[10px] text-neutral-600 mt-0.5">{formatDateTime(entry.at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                {actions.map((a) => (
                  <button key={a.action} onClick={() => onAction(a.action, dispute)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${a.color}`}>
                    <a.icon className="w-3.5 h-3.5" />{a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════

export default function AdminDisputes() {
  const [disputeList, setDisputeList] = useState(initialDisputes);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortField, setSortField] = useState("filedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, targetStatus: null, dispute: null });

  const filtered = useMemo(() => {
    let result = [...disputeList];
    if (statusFilter !== "all") result = result.filter((d) => d.status === statusFilter);
    if (priorityFilter !== "all") result = result.filter((d) => d.priority === priorityFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d) =>
        d.id.toLowerCase().includes(q) ||
        d.filedBy.toLowerCase().includes(q) ||
        d.against.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return result;
  }, [disputeList, statusFilter, priorityFilter, searchQuery, sortField, sortDir]);

  const stats = useMemo(() => [
    { label: "Total Disputes", value: disputeList.length, icon: FileWarning, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
    { label: "Open", value: disputeList.filter((d) => d.status === DisputeStatus.OPEN).length, icon: AlertTriangle, color: "text-amber-400 bg-amber-500/10" },
    { label: "Under Review", value: disputeList.filter((d) => d.status === DisputeStatus.UNDER_REVIEW).length, icon: Eye, color: "text-blue-400 bg-blue-500/10" },
    { label: "Escalated", value: disputeList.filter((d) => d.status === DisputeStatus.ESCALATED).length, icon: ShieldAlert, color: "text-red-400 bg-red-500/10" },
    { label: "Resolved", value: disputeList.filter((d) => d.status === DisputeStatus.RESOLVED).length, icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Dismissed", value: disputeList.filter((d) => d.status === DisputeStatus.DISMISSED).length, icon: XCircle, color: "text-neutral-400 bg-neutral-500/10" },
  ], [disputeList]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleAction = useCallback((targetStatus, dispute) => {
    setModal({ isOpen: true, targetStatus, dispute });
  }, []);

  const handleConfirm = useCallback(() => {
    const { targetStatus, dispute } = modal;
    if (!dispute || !targetStatus) return;
    const now = new Date().toISOString();
    setDisputeList((prev) => prev.map((d) =>
      d.id === dispute.id
        ? {
            ...d,
            status: targetStatus,
            lastUpdated: now,
            timeline: [
              ...d.timeline,
              {
                action: `Status changed to ${STATUS_CFG[targetStatus]?.label || targetStatus}`,
                by: "System Admin",
                at: now,
                note: `Dispute status updated via admin panel.`,
              },
            ],
            ...(targetStatus === DisputeStatus.RESOLVED ? { resolution: "Resolved by system admin." } : {}),
          }
        : d
    ));
    // Update drawer if viewing this dispute
    if (selectedDispute?.id === dispute.id) {
      setSelectedDispute((prev) => prev ? {
        ...prev,
        status: targetStatus,
        lastUpdated: now,
        timeline: [
          ...prev.timeline,
          { action: `Status changed to ${STATUS_CFG[targetStatus]?.label || targetStatus}`, by: "System Admin", at: now, note: "Dispute status updated via admin panel." },
        ],
        ...(targetStatus === DisputeStatus.RESOLVED ? { resolution: "Resolved by system admin." } : {}),
      } : prev);
    }
    setModal({ isOpen: false, targetStatus: null, dispute: null });
  }, [modal, selectedDispute]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Dispute Resolution Centre</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage and resolve platform disputes between users</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}
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
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search disputes…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {STATUS_FILTERS.map((opt) => (
              <button key={opt.value} onClick={() => setStatusFilter(opt.value)}
                className={`px-2.5 py-1.5 text-[10px] font-medium transition-colors ${statusFilter === opt.value ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {PRIORITY_FILTERS.map((opt) => (
              <button key={opt.value} onClick={() => setPriorityFilter(opt.value)}
                className={`px-2.5 py-1.5 text-[10px] font-medium transition-colors ${priorityFilter === opt.value ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <FileWarning className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No disputes match your criteria</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[
                      { key: "id", l: "ID" }, { key: "subject", l: "Subject" }, { key: "filedBy", l: "Filed By" },
                      { key: "against", l: "Against" }, { key: "category", l: "Category" },
                      { key: "priority", l: "Priority" }, { key: "status", l: "Status" },
                      { key: "filedAt", l: "Filed" }, { key: "actions", l: "Actions" },
                    ].map((col) => (
                      <th key={col.key} onClick={col.key !== "actions" ? () => toggleSort(col.key) : undefined}
                        className={`py-3 px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap ${col.key !== "actions" ? "cursor-pointer hover:text-neutral-300" : ""}`}>
                        <span className="flex items-center gap-1">{col.l}{sortField === col.key && <ArrowUpDown className="w-3 h-3 text-[#C6A75E]" />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, i) => {
                    const actions = getActions(d.status);
                    return (
                      <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.02 }}
                        className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors">
                        <td className="py-3 px-3 text-xs font-mono text-neutral-400">{d.id}</td>
                        <td className="py-3 px-3">
                          <p className="text-sm font-medium text-neutral-200 truncate max-w-[180px]">{d.subject}</p>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-neutral-300">{d.filedBy}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <Scale className="w-3 h-3 text-[#C6A75E]" />
                            <span className="text-xs text-neutral-300">{d.against}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-300 bg-dark-700/60 border border-white/[0.06]">{d.category}</span>
                        </td>
                        <td className="py-3 px-3"><PriorityBadge priority={d.priority} /></td>
                        <td className="py-3 px-3"><StatusBadge status={d.status} /></td>
                        <td className="py-3 px-3 text-xs text-neutral-500">{formatRelativeTime(d.filedAt)}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelectedDispute(d)} className="p-1.5 rounded-lg text-neutral-400 hover:text-[#C6A75E] hover:bg-[#C6A75E]/10 transition-colors" title="Details"><Eye className="w-3.5 h-3.5" /></button>
                            {actions.slice(0, 2).map((a) => (
                              <button key={a.action} onClick={() => handleAction(a.action, d)}
                                className={`p-1.5 rounded-lg border transition-colors ${a.color}`} title={a.label}>
                                <a.icon className="w-3.5 h-3.5" />
                              </button>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((d, i) => {
              const actions = getActions(d.status);
              return (
                <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-200 truncate">{d.subject}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{d.filedBy} → {d.against}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <PriorityBadge priority={d.priority} />
                      <StatusBadge status={d.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-600 mb-3">
                    <span className="font-mono">{d.id}</span>
                    <span>•</span>
                    <span>{d.category}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(d.filedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                    {actions.map((a) => (
                      <button key={a.action} onClick={() => handleAction(a.action, d)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${a.color}`}>
                        <a.icon className="w-3 h-3" />{a.label}
                      </button>
                    ))}
                    <button onClick={() => setSelectedDispute(d)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-dark-700/60 border border-white/[0.06] hover:text-[#C6A75E] transition-colors ml-auto">
                      <Eye className="w-3 h-3" /> Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-[11px] text-neutral-600 text-center">Showing {filtered.length} of {disputeList.length} disputes</p>

      <DisputeDrawer dispute={selectedDispute} onClose={() => setSelectedDispute(null)} onAction={handleAction} />
      <ActionModal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false, targetStatus: null, dispute: null })} onConfirm={handleConfirm} targetStatus={modal.targetStatus} disputeId={modal.dispute?.id} />
    </div>
  );
}
