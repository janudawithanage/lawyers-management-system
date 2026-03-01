/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN VERIFICATION — Lawyer Verification Management
 * ══════════════════════════════════════════════════════════════
 *
 * Full-page lawyer verification with FUNCTIONAL actions:
 *  • KPI cards (total, pending, verified, rejected)
 *  • Searchable, filterable verification queue
 *  • Desktop table + mobile card layout
 *  • Detail drawer with documents & info
 *  • Approve/Reject with confirmation modal
 *  • Actions mutate local state (frontend-only)
 */

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Shield,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Scale,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FileText,
  ArrowUpDown,
  X,
  AlertTriangle,
} from "lucide-react";
import { verificationQueue as initialQueue, formatRelativeTime, formatFullDate } from "../data/mockAdminData";

// ── Status Config ────────────────────────────────────────────

const STATUS_CFG = {
  pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400 animate-pulse" },
  verified: { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400" },
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "verified", label: "Verified" },
  { id: "rejected", label: "Rejected" },
];

// ── Confirmation Modal ───────────────────────────────────────

function ConfirmModal({ isOpen, onClose, onConfirm, action, lawyerName }) {
  if (!isOpen) return null;
  const isApprove = action === "approve";
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.2 }}
            className="relative w-full max-w-md p-6 rounded-2xl bg-dark-800 border border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isApprove ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"}`}>
                {isApprove ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-100">{isApprove ? "Approve Verification" : "Reject Verification"}</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {isApprove
                    ? `Approve ${lawyerName}'s verification? They will gain full platform access.`
                    : `Reject ${lawyerName}'s application? They will be notified with the reason.`}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-neutral-600 mb-5">⚠ This action will be logged in the system audit trail.</p>
            <div className="flex items-center justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 bg-dark-700/60 border border-white/[0.06] hover:text-neutral-200 transition-colors">Cancel</button>
              <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isApprove ? "text-dark-950 bg-emerald-500 hover:bg-emerald-400" : "text-white bg-red-600 hover:bg-red-500"}`}>
                {isApprove ? "Approve" : "Reject"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Detail Drawer ────────────────────────────────────────────

function DetailDrawer({ lawyer, onClose, onApprove, onReject }) {
  if (!lawyer) return null;
  const cfg = STATUS_CFG[lawyer.verificationStatus] || STATUS_CFG.pending;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex justify-end" role="dialog">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-dark-900 border-l border-white/[0.08] shadow-2xl overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-dark-900/95 backdrop-blur-sm border-b border-white/[0.06]">
            <h3 className="text-lg font-semibold text-neutral-100">Application Details</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-dark-700/60 transition-colors"><X className="w-5 h-5 text-neutral-400" /></button>
          </div>

          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#C6A75E]/10 border border-[#C6A75E]/20 flex items-center justify-center"><Scale className="w-7 h-7 text-[#C6A75E]" /></div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-neutral-100">{lawyer.name}</h4>
                <p className="text-sm text-neutral-400 mt-0.5">{lawyer.specialization}</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-2 ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                  <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />{cfg.label}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Email", value: lawyer.email },
                { icon: Phone, label: "Phone", value: lawyer.phone },
                { icon: ShieldCheck, label: "Bar Number", value: lawyer.barNumber },
                { icon: GraduationCap, label: "University", value: lawyer.university },
                { icon: Briefcase, label: "Experience", value: lawyer.experience },
                { icon: Clock, label: "Submitted", value: formatFullDate(lawyer.submittedAt) },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/[0.04]">
                  <item.icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm text-neutral-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Submitted Documents</p>
              <div className="space-y-2">
                {lawyer.documents.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-800/40 border border-white/[0.04]">
                    <FileText className="w-3.5 h-3.5 text-[#C6A75E]" />
                    <span className="text-sm text-neutral-300">{doc}</span>
                    <span className="ml-auto text-[10px] text-emerald-400 font-medium">Uploaded</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Reason */}
            {lawyer.verificationStatus === "rejected" && lawyer.rejectionReason && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs font-semibold text-red-400">Rejection Reason</p>
                </div>
                <p className="text-sm text-neutral-400">{lawyer.rejectionReason}</p>
              </div>
            )}

            {/* Actions */}
            {lawyer.verificationStatus === "pending" && (
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <button onClick={() => onApprove(lawyer)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark-950 bg-emerald-500 hover:bg-emerald-400 transition-colors">
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => onReject(lawyer)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function AdminVerification() {
  const [queue, setQueue] = useState(initialQueue);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, action: null, lawyer: null });

  const filtered = useMemo(() => {
    let result = [...queue];
    if (activeTab !== "all") result = result.filter((l) => l.verificationStatus === activeTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.specialization.toLowerCase().includes(q) || l.barNumber.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return result;
  }, [queue, activeTab, searchQuery, sortField, sortDir]);

  const tabCounts = useMemo(() => {
    const c = { all: queue.length, pending: 0, verified: 0, rejected: 0 };
    queue.forEach((l) => { c[l.verificationStatus] = (c[l.verificationStatus] || 0) + 1; });
    return c;
  }, [queue]);

  const stats = useMemo(() => [
    { label: "Total Applications", value: queue.length, icon: ShieldCheck, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
    { label: "Pending Review", value: tabCounts.pending, icon: Clock, color: "text-amber-400 bg-amber-500/10" },
    { label: "Verified", value: tabCounts.verified, icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Rejected", value: tabCounts.rejected, icon: XCircle, color: "text-red-400 bg-red-500/10" },
  ], [queue, tabCounts]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const handleAction = useCallback((action, lawyer) => {
    if (action === "view") {
      setSelectedLawyer(lawyer);
    } else {
      setModal({ isOpen: true, action, lawyer });
    }
  }, []);

  const handleConfirm = useCallback(() => {
    const { action, lawyer } = modal;
    if (!lawyer) return;
    setQueue((prev) => prev.map((l) =>
      l.id === lawyer.id
        ? { ...l, verificationStatus: action === "approve" ? "verified" : "rejected" }
        : l
    ));
    setModal({ isOpen: false, action: null, lawyer: null });
    setSelectedLawyer(null);
  }, [modal]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Lawyer Verification</h1>
        <p className="text-sm text-neutral-500 mt-1">Review and manage lawyer registration applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, email, specialization…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {FILTER_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${activeTab === tab.id ? "bg-[#C6A75E]/10 text-[#C6A75E] border-r border-[#C6A75E]/20" : "text-neutral-500 hover:text-neutral-300 border-r border-white/[0.04] last:border-r-0"}`}>
                {tab.label} ({tabCounts[tab.id] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <ShieldCheck className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No applications match your criteria</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[{ key: "name", label: "Lawyer" }, { key: "specialization", label: "Specialization" }, { key: "barNumber", label: "Bar #" }, { key: "experience", label: "Experience" }, { key: "submittedAt", label: "Submitted" }, { key: "verificationStatus", label: "Status" }, { key: "actions", label: "Actions" }].map((col) => (
                      <th key={col.key} onClick={col.key !== "actions" ? () => toggleSort(col.key) : undefined}
                        className={`py-3 px-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap ${col.key !== "actions" ? "cursor-pointer hover:text-neutral-300" : ""} transition-colors`}>
                        <span className="flex items-center gap-1">{col.label}{sortField === col.key && <ArrowUpDown className="w-3 h-3 text-[#C6A75E]" />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lawyer, i) => {
                    const cfg = STATUS_CFG[lawyer.verificationStatus] || STATUS_CFG.pending;
                    return (
                      <motion.tr key={lawyer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.02 }}
                        className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#C6A75E]/10 flex items-center justify-center"><Scale className="w-3.5 h-3.5 text-[#C6A75E]" /></div>
                            <div>
                              <p className="text-sm font-medium text-neutral-200">{lawyer.name}</p>
                              <p className="text-[10px] text-neutral-600">{lawyer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-300 bg-dark-700/60 border border-white/[0.06]">{lawyer.specialization}</span></td>
                        <td className="py-3 px-4 text-xs font-mono text-neutral-400">{lawyer.barNumber}</td>
                        <td className="py-3 px-4 text-xs text-neutral-400">{lawyer.experience}</td>
                        <td className="py-3 px-4 text-xs text-neutral-500">{formatRelativeTime(lawyer.submittedAt)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                            <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />{cfg.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleAction("view", lawyer)} className="p-1.5 rounded-lg text-neutral-400 hover:text-[#C6A75E] hover:bg-[#C6A75E]/10 transition-colors" title="View Details"><Eye className="w-3.5 h-3.5" /></button>
                            {lawyer.verificationStatus === "pending" && (
                              <>
                                <button onClick={() => handleAction("approve", lawyer)} className="p-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors" title="Approve"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleAction("reject", lawyer)} className="p-1.5 rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors" title="Reject"><XCircle className="w-3.5 h-3.5" /></button>
                              </>
                            )}
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
            {filtered.map((lawyer, i) => {
              const cfg = STATUS_CFG[lawyer.verificationStatus] || STATUS_CFG.pending;
              return (
                <motion.div key={lawyer.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-200">{lawyer.name}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{lawyer.specialization} • {lawyer.experience}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-600 mb-3">
                    <span className="font-mono">{lawyer.barNumber}</span>
                    <span>{formatRelativeTime(lawyer.submittedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                    <button onClick={() => handleAction("view", lawyer)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-dark-700/60 border border-white/[0.06] hover:text-[#C6A75E] transition-colors">
                      <Eye className="w-3 h-3" /> View
                    </button>
                    {lawyer.verificationStatus === "pending" && (
                      <>
                        <button onClick={() => handleAction("approve", lawyer)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-dark-950 bg-emerald-500 hover:bg-emerald-400 transition-colors">
                          <CheckCircle2 className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => handleAction("reject", lawyer)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors ml-auto">
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-[11px] text-neutral-600 text-center">
        Showing {filtered.length} of {queue.length} applications
      </p>

      {/* Detail Drawer */}
      {selectedLawyer && (
        <DetailDrawer
          lawyer={selectedLawyer}
          onClose={() => setSelectedLawyer(null)}
          onApprove={(l) => { setSelectedLawyer(null); handleAction("approve", l); }}
          onReject={(l) => { setSelectedLawyer(null); handleAction("reject", l); }}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, action: null, lawyer: null })}
        onConfirm={handleConfirm}
        action={modal.action}
        lawyerName={modal.lawyer?.name}
      />
    </div>
  );
}
