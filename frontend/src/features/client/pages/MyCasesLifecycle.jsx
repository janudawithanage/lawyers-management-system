/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS MY CASES — Case Listing Page
 * ══════════════════════════════════════════════════════════════
 *
 * Case listing page — each card is clickable and navigates to
 * the dedicated case detail page (/dashboard/client/cases/:caseId)
 *
 * Features:
 *  • Tab-based filtering (All, Active, Payment, Closed)
 *  • Clickable case cards with hover effect
 *  • Live payment countdown for pending fees
 *  • Search by title, lawyer, type
 *  • Skeleton loaders
 *  • Empty states
 *
 * Connected to: useAppStore() for state
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Search,
  FileText,
  Scale,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { CaseStatus, PaymentStatus } from "@utils/statusEnums";
import StatusBadge from "@components/common/StatusBadge";
import CountdownTimer from "@components/common/CountdownTimer";

// ── Tab Configuration ────────────────────────────────────────

const TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active", statuses: [CaseStatus.ACTIVE] },
  { id: "payment", label: "Payment", statuses: [CaseStatus.PAYMENT_PENDING, CaseStatus.OVERDUE] },
  { id: "closed", label: "Closed", statuses: [CaseStatus.CLOSED, CaseStatus.ENDED, CaseStatus.TERMINATED] },
];

// ── Skeleton ─────────────────────────────────────────────────

function CaseSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-dark-800/60 border border-white/[0.06] animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-dark-600" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-56 bg-dark-600 rounded" />
          <div className="h-3 w-40 bg-dark-700 rounded" />
        </div>
        <div className="h-6 w-20 bg-dark-600 rounded-full" />
      </div>
      <div className="mt-4 h-2 w-full bg-dark-700 rounded-full" />
    </div>
  );
}

// ── Clickable Case Card ──────────────────────────────────────

function CaseCard({ caseData, payments: allPayments }) {
  const navigate = useNavigate();

  const isPending = caseData.status === CaseStatus.PAYMENT_PENDING;
  const isOverdue = caseData.status === CaseStatus.OVERDUE;

  const pendingPayment = useMemo(
    () => allPayments.find((p) => p.caseId === caseData.id && p.status === PaymentStatus.PENDING),
    [allPayments, caseData.id]
  );

  const dueAmount = (caseData.totalFees || 0) - (caseData.paidAmount || 0);

  return (
    <button
      onClick={() => navigate(`/dashboard/client/cases/${caseData.id}`)}
      className={`w-full text-left rounded-xl border transition-all duration-300 overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-black/10 ${
        isPending || isOverdue
          ? `bg-dark-800/80 ${isOverdue ? "border-red-500/20 hover:border-red-500/30" : "border-amber-500/15 hover:border-amber-500/25"}`
          : "bg-dark-800/60 border-white/[0.06] hover:border-gold-500/15"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Lawyer Avatar */}
          <div className="relative flex-shrink-0">
            {caseData.lawyerAvatar ? (
              <img
                src={caseData.lawyerAvatar}
                alt={caseData.lawyerName}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/[0.08]"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center ring-1 ring-gold-500/20">
                <Scale className="w-5 h-5 text-gold-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-gold-400 transition-colors">
                  {caseData.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{caseData.lawyerName} • {caseData.caseType}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={caseData.status} type="case" size="xs" />
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Progress</span>
                <span className="text-[10px] text-neutral-400 font-mono">{caseData.progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-dark-600 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    caseData.progress === 100 ? "bg-emerald-400" :
                    caseData.progress > 60 ? "bg-gold-400" :
                    "bg-blue-400"
                  }`}
                  style={{ width: `${caseData.progress}%` }}
                />
              </div>
            </div>

            {/* Payment Warning */}
            {isPending && caseData.nextPaymentDeadline && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/10">
                <CreditCard className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-xs text-amber-400/80">Payment due:</span>
                <CountdownTimer
                  deadline={caseData.nextPaymentDeadline}
                  totalDuration={7 * 24 * 3600000}
                  variant="inline"
                  showLabel={false}
                />
                {pendingPayment && (
                  <span className="text-xs text-amber-400 font-semibold ml-auto">
                    LKR {pendingPayment.amount?.toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {isOverdue && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse flex-shrink-0" />
                <span className="text-xs text-red-400 font-medium">
                  Payment is overdue — case may be suspended
                </span>
              </div>
            )}

            {/* Quick Info Row */}
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="text-neutral-500">
                Fees: <span className="text-neutral-300 font-medium">LKR {caseData.totalFees?.toLocaleString()}</span>
              </span>
              <span className="text-neutral-500">
                Paid: <span className="text-emerald-400 font-medium">LKR {caseData.paidAmount?.toLocaleString()}</span>
              </span>
              {dueAmount > 0 && (
                <span className="text-neutral-500">
                  Due: <span className="text-amber-400 font-medium">LKR {dueAmount.toLocaleString()}</span>
                </span>
              )}
              <span className="text-neutral-500 ml-auto flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {caseData.documents?.length || 0} docs
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MyCasesLifecycle() {
  const { cases, payments } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Filter cases ───────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...cases];

    const tab = TABS.find((t) => t.id === activeTab);
    if (tab?.statuses) {
      result = result.filter((c) => tab.statuses.includes(c.status));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.lawyerName?.toLowerCase().includes(q) ||
          c.caseType?.toLowerCase().includes(q) ||
          c.id?.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      const priority = { [CaseStatus.OVERDUE]: 0, [CaseStatus.PAYMENT_PENDING]: 1, [CaseStatus.ACTIVE]: 2 };
      const pa = priority[a.status] ?? 10;
      const pb = priority[b.status] ?? 10;
      if (pa !== pb) return pa - pb;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [cases, activeTab, searchQuery]);

  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach((tab) => {
      counts[tab.id] = tab.statuses
        ? cases.filter((c) => tab.statuses.includes(c.status)).length
        : cases.length;
    });
    return counts;
  }, [cases]);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">My Cases</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Track your legal cases — click a case for full details
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">
              {cases.filter((c) => c.status === CaseStatus.ACTIVE).length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 p-1 rounded-xl bg-dark-800/40 border border-white/[0.04]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-dark-700 text-gold-400 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
              }`}
            >
              {tab.label}
              {tabCounts[tab.id] > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  activeTab === tab.id ? "bg-gold-500/15 text-gold-400" : "bg-dark-600 text-neutral-500"
                }`}>
                  {tabCounts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases…"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-800/40 border border-white/[0.06] text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Case List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-4">
            <FolderOpen className="w-7 h-7 text-neutral-600" />
          </div>
          <p className="text-neutral-400 font-medium">No cases found</p>
          <p className="text-sm text-neutral-600 mt-1 max-w-xs">
            {searchQuery ? "Try adjusting your search" : "Cases are created after a completed consultation"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <CaseCard
              key={c.id}
              caseData={c}
              payments={payments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
