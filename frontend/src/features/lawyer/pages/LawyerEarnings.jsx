/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER EARNINGS — Financial Overview & Payment History
 * ══════════════════════════════════════════════════════════════
 *
 *  • Revenue KPI cards (total earned, pending, cases with fees)
 *  • Payment history table with case-level breakdown
 *  • Monthly earnings trend (mock)
 *  • Filterable by status
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Search,
  Filter,
  Briefcase,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";

const MOCK_LAWYER_ID = "LWR-003";

const FMT = (n) => `LKR ${Number(n || 0).toLocaleString("en-LK")}`;

export default function LawyerEarnings() {
  const { cases, payments } = useAppStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const myCases = useMemo(() => cases.filter((c) => c.lawyerId === MOCK_LAWYER_ID), [cases]);

  // Build earning rows from cases + payments
  const earningsData = useMemo(() => {
    const rows = [];
    myCases.forEach((c) => {
      const casePayments = payments.filter((p) => p.caseId === c.id);
      if (casePayments.length > 0) {
        casePayments.forEach((p) => {
          rows.push({
            id: p.id,
            caseId: c.id,
            caseTitle: c.title,
            clientName: c.clientName || "Client",
            amount: p.amount,
            status: p.status,
            date: p.date || p.paidAt,
            method: p.method || "Bank Transfer",
          });
        });
      } else if (c.fees) {
        rows.push({
          id: `FEE-${c.id}`,
          caseId: c.id,
          caseTitle: c.title,
          clientName: c.clientName || "Client",
          amount: c.fees,
          status: c.status === "closed" ? "paid" : "pending",
          date: c.createdAt,
          method: "—",
        });
      }
    });
    return rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [myCases, payments]);

  const filtered = useMemo(() => {
    let result = earningsData;
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.caseTitle?.toLowerCase().includes(q) || r.clientName?.toLowerCase().includes(q));
    }
    return result;
  }, [earningsData, statusFilter, searchQuery]);

  const totalEarned = earningsData.filter((r) => r.status === "paid").reduce((s, r) => s + (r.amount || 0), 0);
  const totalPending = earningsData.filter((r) => r.status === "pending").reduce((s, r) => s + (r.amount || 0), 0);
  const totalAll = earningsData.reduce((s, r) => s + (r.amount || 0), 0);

  const statusColors = {
    paid: "text-emerald-400 bg-emerald-500/10",
    pending: "text-amber-400 bg-amber-500/10",
    overdue: "text-red-400 bg-red-500/10",
    requested: "text-blue-400 bg-blue-500/10",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#C6A75E]" />
            <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Practice</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Earnings</h1>
          <p className="text-sm text-neutral-500 mt-1">Financial overview & payment history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-400 border border-white/[0.06] hover:border-white/[0.12] transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Earned", value: FMT(totalEarned), icon: DollarSign, color: "text-emerald-400 bg-emerald-500/10" },
          { label: "Pending", value: FMT(totalPending), icon: Clock, color: "text-amber-400 bg-amber-500/10" },
          { label: "Total Billed", value: FMT(totalAll), icon: TrendingUp, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
          { label: "Active Cases", value: myCases.filter((c) => c.status === "active").length, icon: Briefcase, color: "text-blue-400 bg-blue-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <p className="text-lg font-bold text-neutral-100">{s.value}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case or client…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {["all", "paid", "pending", "overdue"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-[11px] font-medium capitalize transition-colors ${statusFilter === s ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table / Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl bg-dark-800/40 border border-white/[0.06] text-center">
          <DollarSign className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No earnings found</p>
          <p className="text-xs text-neutral-600 mt-1">Earnings will appear when case payments are made</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl overflow-hidden border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-800/80 text-neutral-500 text-[11px] uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-semibold">Case</th>
                  <th className="text-left py-3 px-4 font-semibold">Client</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-neutral-200 font-medium max-w-[200px] truncate">{row.caseTitle}</td>
                    <td className="py-3 px-4 text-neutral-400">{row.clientName}</td>
                    <td className="py-3 px-4 text-neutral-200 font-semibold">{FMT(row.amount)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${statusColors[row.status] || "text-neutral-400 bg-neutral-500/10"}`}>
                        {row.status === "paid" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">{row.date ? new Date(row.date).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">{row.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((row) => (
              <div key={row.id} className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-neutral-200 truncate flex-1 mr-2">{row.caseTitle}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusColors[row.status] || "text-neutral-400 bg-neutral-500/10"}`}>
                    {row.status}
                  </span>
                </div>
                <p className="text-lg font-bold text-neutral-100">{FMT(row.amount)}</p>
                <p className="text-[11px] text-neutral-500 mt-1">{row.clientName} • {row.date ? new Date(row.date).toLocaleDateString("en-LK", { month: "short", day: "numeric" }) : "—"}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
