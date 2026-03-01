/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN PAYMENTS MONITOR — System-Wide Financial Oversight
 * ══════════════════════════════════════════════════════════════
 *
 * Full-page payment monitoring for platform administrators:
 *  • Revenue KPI cards (total, collected, pending, expired)
 *  • Searchable, filterable payment table
 *  • Desktop table + mobile card layout
 *  • Uses globalStore for live data
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  User,
  Scale,
  ArrowUpDown,
  TrendingUp,
  Wallet,
  CreditCard,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { PaymentStatus } from "@utils/statusEnums";

// ── Status Configuration ─────────────────────────────────────

const STATUS_CONFIG = {
  [PaymentStatus.PENDING]: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400 animate-pulse" },
  [PaymentStatus.SUCCESS]: { label: "Paid", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  [PaymentStatus.EXPIRED]: { label: "Expired", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400" },
  [PaymentStatus.REFUNDED]: { label: "Refunded", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending", statuses: [PaymentStatus.PENDING] },
  { id: "paid", label: "Paid", statuses: [PaymentStatus.SUCCESS] },
  { id: "expired", label: "Expired", statuses: [PaymentStatus.EXPIRED] },
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

export default function AdminPayments() {
  const { payments } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    const tab = FILTER_TABS.find((t) => t.id === activeTab);
    let result = [...payments];
    if (tab?.statuses) result = result.filter((p) => tab.statuses.includes(p.status));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.clientName?.toLowerCase().includes(q) ||
        p.lawyerName?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.appointmentId?.toLowerCase().includes(q) ||
        p.caseId?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return result;
  }, [payments, activeTab, searchQuery, sortField, sortDir]);

  const tabCounts = useMemo(() => {
    const counts = {};
    FILTER_TABS.forEach((tab) => {
      counts[tab.id] = tab.statuses
        ? payments.filter((p) => tab.statuses.includes(p.status)).length
        : payments.length;
    });
    return counts;
  }, [payments]);

  const kpis = useMemo(() => {
    const totalAmount = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const collected = payments.filter((p) => p.status === PaymentStatus.SUCCESS).reduce((s, p) => s + (p.amount || 0), 0);
    const pending = payments.filter((p) => p.status === PaymentStatus.PENDING).reduce((s, p) => s + (p.amount || 0), 0);
    const expired = payments.filter((p) => p.status === PaymentStatus.EXPIRED).reduce((s, p) => s + (p.amount || 0), 0);
    return [
      { label: "Total Transactions", value: payments.length, sub: `LKR ${totalAmount.toLocaleString()}`, icon: Wallet, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
      { label: "Collected", value: payments.filter((p) => p.status === PaymentStatus.SUCCESS).length, sub: `LKR ${collected.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10" },
      { label: "Pending", value: payments.filter((p) => p.status === PaymentStatus.PENDING).length, sub: `LKR ${pending.toLocaleString()}`, icon: Clock, color: "text-amber-400 bg-amber-500/10" },
      { label: "Expired/Lost", value: payments.filter((p) => p.status === PaymentStatus.EXPIRED).length, sub: `LKR ${expired.toLocaleString()}`, icon: XCircle, color: "text-red-400 bg-red-500/10" },
    ];
  }, [payments]);

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
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Payments Monitor</h1>
        <p className="text-sm text-neutral-500 mt-1">System-wide financial oversight & revenue tracking</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] hover:border-white/[0.10] transition-all">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${kpi.color}`}>
              <kpi.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-neutral-100">{kpi.value}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{kpi.label}</p>
            <p className="text-xs text-neutral-400 font-semibold mt-1">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, lawyer, ID…"
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
          <DollarSign className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No payments match your criteria</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[{ key: "id", label: "ID" }, { key: "description", label: "Description" }, { key: "clientName", label: "Client" }, { key: "lawyerName", label: "Lawyer" }, { key: "amount", label: "Amount" }, { key: "createdAt", label: "Date" }, { key: "status", label: "Status" }].map((col) => (
                      <th key={col.key} onClick={() => toggleSort(col.key)}
                        className="py-3 px-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-neutral-300 transition-colors">
                        <span className="flex items-center gap-1">{col.label}{sortField === col.key && <ArrowUpDown className="w-3 h-3 text-[#C6A75E]" />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((pay, i) => (
                    <motion.tr key={pay.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.02 }}
                      className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-neutral-400">{pay.id}</td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-neutral-200 truncate max-w-[180px]">{pay.description}</p>
                        <p className="text-[10px] text-neutral-600">{pay.appointmentId || pay.caseId || ""}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center"><User className="w-3.5 h-3.5 text-blue-400" /></div>
                          <span className="text-sm text-neutral-200">{pay.clientName || "—"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#C6A75E]/10 flex items-center justify-center"><Scale className="w-3.5 h-3.5 text-[#C6A75E]" /></div>
                          <span className="text-sm text-neutral-200">{pay.lawyerName || "—"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="text-sm font-bold text-neutral-200">LKR {(pay.amount || 0).toLocaleString()}</p>
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-400">
                        {pay.createdAt ? new Date(pay.createdAt).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={pay.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden space-y-3">
            {filtered.map((pay, i) => (
              <motion.div key={pay.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">{pay.description}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{pay.clientName} → {pay.lawyerName}</p>
                  </div>
                  <StatusBadge status={pay.status} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-600 mt-2">
                  <span className="font-mono">{pay.id}</span>
                  <span className="text-neutral-100 font-bold text-sm">LKR {(pay.amount || 0).toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <p className="text-[11px] text-neutral-600 text-center">
        Showing {filtered.length} of {payments.length} payments • Data refreshes automatically
      </p>
    </div>
  );
}
