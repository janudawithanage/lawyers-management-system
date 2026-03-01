/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN CASES MONITOR — System-Wide Case Oversight
 * ══════════════════════════════════════════════════════════════
 *
 * Full-page case monitoring for platform administrators:
 *  • KPI summary cards (total, active, closed, terminated)
 *  • Financial overview (total fees, collected, outstanding)
 *  • Searchable, filterable case table
 *  • Desktop table + mobile card layout
 *  • Uses globalStore for live data
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Shield,
  DollarSign,
  User,
  Briefcase,
  ArrowUpDown,
  FileText,
  TrendingUp,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { CaseStatus } from "@utils/statusEnums";

// ── Status Configuration ─────────────────────────────────────

const STATUS_CONFIG = {
  [CaseStatus.ACTIVE]: { label: "Active", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
  [CaseStatus.PAYMENT_PENDING]: { label: "Payment Pending", color: "text-[#C6A75E]", bg: "bg-[#C6A75E]/10", border: "border-[#C6A75E]/20", dot: "bg-[#C6A75E]" },
  [CaseStatus.OVERDUE]: { label: "Payment Overdue", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400 animate-pulse" },
  [CaseStatus.CLOSED]: { label: "Closed", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  [CaseStatus.ENDED]: { label: "Ended", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", dot: "bg-orange-400" },
  [CaseStatus.TERMINATED]: { label: "Terminated", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400" },
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active", statuses: [CaseStatus.ACTIVE, CaseStatus.PAYMENT_PENDING, CaseStatus.OVERDUE] },
  { id: "closed", label: "Closed", statuses: [CaseStatus.CLOSED] },
  { id: "terminated", label: "Terminated", statuses: [CaseStatus.TERMINATED] },
];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "text-neutral-400", bg: "bg-neutral-500/10", border: "border-neutral-500/20", dot: "bg-neutral-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
      <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════

export default function AdminCases() {
  const { cases, payments } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    const tab = FILTER_TABS.find((t) => t.id === activeTab);
    let result = [...cases];
    if (tab?.statuses) result = result.filter((c) => tab.statuses.includes(c.status));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) =>
        c.clientName?.toLowerCase().includes(q) ||
        c.lawyerName?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q) ||
        c.caseType?.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return result;
  }, [cases, activeTab, searchQuery, sortField, sortDir]);

  const tabCounts = useMemo(() => {
    const counts = {};
    FILTER_TABS.forEach((tab) => {
      counts[tab.id] = tab.statuses
        ? cases.filter((c) => tab.statuses.includes(c.status)).length
        : cases.length;
    });
    return counts;
  }, [cases]);

  // ── Financial KPIs ─────────────────────────────────────────

  const financials = useMemo(() => {
    const totalFees = cases.reduce((s, c) => s + (c.totalFees || 0), 0);
    const collected = cases.reduce((s, c) => s + (c.paidAmount || 0), 0);
    const outstanding = totalFees - collected;
    return { totalFees, collected, outstanding };
  }, [cases]);

  const kpis = useMemo(() => [
    { label: "Total Cases", value: cases.length, icon: Scale, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
    { label: "Active", value: cases.filter((c) => [CaseStatus.ACTIVE, CaseStatus.PAYMENT_PENDING, CaseStatus.OVERDUE].includes(c.status)).length, icon: Briefcase, color: "text-blue-400 bg-blue-500/10" },
    { label: "Closed", value: cases.filter((c) => c.status === CaseStatus.CLOSED).length, icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Terminated", value: cases.filter((c) => c.status === CaseStatus.TERMINATED).length, icon: XCircle, color: "text-red-400 bg-red-500/10" },
  ], [cases]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Cases Monitor</h1>
        <p className="text-sm text-neutral-500 mt-1">System-wide case oversight & financial tracking</p>
      </div>

      {/* KPI + Financial Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] hover:border-white/[0.10] transition-all">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${kpi.color}`}>
              <kpi.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-neutral-100">{kpi.value}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
        {/* Financial cards */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }}
          className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-[#C6A75E] bg-[#C6A75E]/10">
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-neutral-100">LKR {financials.totalFees.toLocaleString()}</p>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Total Fees</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.36 }}
          className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-emerald-400 bg-emerald-500/10">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-emerald-400">LKR {financials.collected.toLocaleString()}</p>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Collected</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.42 }}
          className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-amber-400 bg-amber-500/10">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-amber-400">LKR {financials.outstanding.toLocaleString()}</p>
          <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Outstanding</p>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, lawyer, case type…"
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

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <Scale className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No cases match your criteria</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[{ key: "id", label: "Case ID" }, { key: "title", label: "Title" }, { key: "clientName", label: "Client" }, { key: "lawyerName", label: "Lawyer" }, { key: "caseType", label: "Type" }, { key: "totalFees", label: "Fees" }, { key: "status", label: "Status" }].map((col) => (
                      <th key={col.key} onClick={() => toggleSort(col.key)}
                        className="py-3 px-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-neutral-300 transition-colors">
                        <span className="flex items-center gap-1">{col.label}{sortField === col.key && <ArrowUpDown className="w-3 h-3 text-[#C6A75E]" />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cs, i) => (
                    <motion.tr key={cs.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.02 }}
                      className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-neutral-400">{cs.id}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium text-neutral-200 truncate max-w-[200px]">{cs.title}</p>
                        <p className="text-[10px] text-neutral-600 mt-0.5">{(cs.documents || []).length} docs • {(cs.messages || []).length} msgs</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center"><User className="w-3.5 h-3.5 text-blue-400" /></div>
                          <span className="text-sm text-neutral-200">{cs.clientName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#C6A75E]/10 flex items-center justify-center"><Scale className="w-3.5 h-3.5 text-[#C6A75E]" /></div>
                          <span className="text-sm text-neutral-200">{cs.lawyerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-300 bg-dark-700/60 border border-white/[0.06]">{cs.caseType}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm font-semibold text-neutral-200">LKR {(cs.totalFees || 0).toLocaleString()}</p>
                        <p className="text-[10px] text-emerald-400">Paid: LKR {(cs.paidAmount || 0).toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={cs.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3">
            {filtered.map((cs, i) => (
              <motion.div key={cs.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">{cs.title}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{cs.clientName} → {cs.lawyerName}</p>
                  </div>
                  <StatusBadge status={cs.status} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-600 mt-2">
                  <span className="font-mono">{cs.id}</span>
                  <span className="text-neutral-200 font-semibold">LKR {(cs.totalFees || 0).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <p className="text-[11px] text-neutral-600 text-center">
        Showing {filtered.length} of {cases.length} cases • Data refreshes automatically
      </p>
    </div>
  );
}
