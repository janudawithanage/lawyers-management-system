/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS — Lawyer Cases Management
 * ══════════════════════════════════════════════════════════════
 *
 * Full case listing page for the lawyer role:
 *   • Tab-based status filtering (Active / Payment Pending / Closed / All)
 *   • Progress bars, financial summaries, timeline info
 *   • Click-to-navigate to case detail
 *   • Quick actions (request payment, close case)
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Scale, FolderOpen, Plus, Search,
  DollarSign, Clock, TrendingUp, FileText,
  ChevronRight, AlertTriangle, CheckCircle,
  XCircle, User, Calendar,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { MOCK_LAWYER_ID } from "../data/mockLawyerData";
import { CaseStatus, CASE_STATUS_CONFIG } from "@utils/statusEnums";
import StatusBadge from "@components/common/StatusBadge";
import CountdownTimer from "@components/common/CountdownTimer";

const TABS = [
  { id: "active", label: "Active", statuses: [CaseStatus.ACTIVE] },
  { id: "payment", label: "Payment Pending", statuses: [CaseStatus.PAYMENT_PENDING, CaseStatus.OVERDUE] },
  { id: "closed", label: "Closed", statuses: [CaseStatus.CLOSED, CaseStatus.ENDED, CaseStatus.TERMINATED] },
  { id: "all", label: "All Cases", statuses: null },
];

export default function LawyerCases() {
  const { cases, payments } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Filter cases for this lawyer ───────────────────────────
  const myCases = useMemo(() => {
    return cases.filter((c) => c.lawyerId === MOCK_LAWYER_ID);
  }, [cases]);

  const filteredCases = useMemo(() => {
    const tab = TABS.find((t) => t.id === activeTab);
    let filtered = myCases;
    if (tab?.statuses) {
      filtered = filtered.filter((c) => tab.statuses.includes(c.status));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.clientName?.toLowerCase().includes(q) ||
          c.caseType?.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [myCases, activeTab, searchQuery]);

  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach((tab) => {
      counts[tab.id] = tab.statuses
        ? myCases.filter((c) => tab.statuses.includes(c.status)).length
        : myCases.length;
    });
    return counts;
  }, [myCases]);

  // ── Financial Summary ──────────────────────────────────────
  const financials = useMemo(() => {
    const total = myCases.reduce((sum, c) => sum + (c.totalFees || 0), 0);
    const collected = myCases.reduce((sum, c) => sum + (c.paidAmount || 0), 0);
    const pending = total - collected;
    return { total, collected, pending };
  }, [myCases]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Case Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage ongoing legal cases and client matters
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800/60 border border-white/[0.06]">
            <Search className="w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 outline-none w-40"
            />
          </div>
          <button
            onClick={() => navigate("/dashboard/lawyer/cases/new")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Case
          </button>
        </div>
      </div>

      {/* ── Financial Summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SummaryTile label="Total Cases" value={myCases.length} icon={Briefcase} color="text-[#C6A75E]" bg="bg-[#C6A75E]/10" />
        <SummaryTile label="Total Fees" value={`LKR ${financials.total.toLocaleString()}`} icon={DollarSign} color="text-emerald-400" bg="bg-emerald-500/10" />
        <SummaryTile label="Collected" value={`LKR ${financials.collected.toLocaleString()}`} icon={TrendingUp} color="text-blue-400" bg="bg-blue-500/10" />
        <SummaryTile label="Outstanding" value={`LKR ${financials.pending.toLocaleString()}`} icon={AlertTriangle} color="text-amber-400" bg="bg-amber-500/10" />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-[#C6A75E]/15 text-[#C6A75E] border border-[#C6A75E]/25"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-dark-800/40 border border-transparent"
            }`}
          >
            {tab.label}
            {tabCounts[tab.id] > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? "bg-[#C6A75E]/20 text-[#C6A75E]" : "bg-neutral-700/50 text-neutral-400"
              }`}>
                {tabCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Case Cards ── */}
      <AnimatePresence mode="popLayout">
        {filteredCases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]"
          >
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-4">
              <Scale className="w-7 h-7 text-neutral-600" />
            </div>
            <p className="text-neutral-400 font-medium">No cases found</p>
            <p className="text-sm text-neutral-600 mt-1">
              {activeTab === "active" ? "No active cases at the moment" : "Try adjusting your filters"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredCases.map((caseItem, idx) => (
              <CaseCard
                key={caseItem.id}
                caseItem={caseItem}
                index={idx}
                onClick={() => navigate(`/dashboard/lawyer/cases/${caseItem.id}`)}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Case Card ────────────────────────────────────────────────

function CaseCard({ caseItem, index, onClick }) {
  const c = caseItem;
  const isPaymentPending = c.status === CaseStatus.PAYMENT_PENDING || c.status === CaseStatus.OVERDUE;
  const isClosed = c.status === CaseStatus.CLOSED || c.status === CaseStatus.TERMINATED || c.status === CaseStatus.ENDED;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className={`group rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
        isPaymentPending
          ? "bg-dark-800/60 border-amber-500/15 hover:border-amber-500/30"
          : "bg-dark-800/40 border-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isClosed ? "bg-neutral-500/10" : "bg-gradient-to-br from-[#C6A75E]/20 to-[#C6A75E]/5 border border-[#C6A75E]/10"
        }`}>
          <Briefcase className={`w-5 h-5 ${isClosed ? "text-neutral-500" : "text-[#C6A75E]"}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-[#C6A75E] transition-colors truncate">
              {c.title}
            </h3>
            <StatusBadge status={c.status} type="case" size="xs" />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{c.description}</p>

          {/* Meta Row */}
          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {c.clientName}
            </span>
            <span className="flex items-center gap-1">
              <Scale className="w-3 h-3" />
              {c.caseType}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {(c.documents || []).length} docs
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(c.createdAt).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-dark-900/80 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  c.progress >= 100
                    ? "bg-emerald-400"
                    : c.progress >= 50
                      ? "bg-[#C6A75E]"
                      : "bg-blue-400"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${c.progress || 0}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-[10px] font-semibold text-neutral-400 w-8 text-right">
              {c.progress || 0}%
            </span>
          </div>

          {/* Financial Row */}
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className="text-neutral-500">
              Fees: <span className="text-neutral-300 font-medium">LKR {(c.totalFees || 0).toLocaleString()}</span>
            </span>
            <span className="text-neutral-500">
              Paid: <span className="text-emerald-400 font-medium">LKR {(c.paidAmount || 0).toLocaleString()}</span>
            </span>
            {isPaymentPending && c.nextPaymentDeadline && (
              <CountdownTimer
                deadline={c.nextPaymentDeadline}
                variant="inline"
                showLabel={false}
              />
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-[#C6A75E] transition-colors flex-shrink-0 mt-1" />
      </div>
    </motion.div>
  );
}

// ── Summary Tile ─────────────────────────────────────────────

function SummaryTile({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-4">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`w-4.5 h-4.5 ${color}`} />
        </div>
        <div>
          <p className="text-lg font-bold text-neutral-100">{value}</p>
          <p className="text-[11px] text-neutral-500 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}
