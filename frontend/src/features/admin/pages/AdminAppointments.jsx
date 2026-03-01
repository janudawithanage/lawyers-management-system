/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN APPOINTMENTS MONITOR — System-Wide Oversight
 * ══════════════════════════════════════════════════════════════
 *
 * Full-page appointment monitoring for platform administrators:
 *  • KPI summary cards (total, pending, approved, completed, etc.)
 *  • Searchable, filterable appointment table
 *  • Desktop table + mobile card layout
 *  • Uses globalStore for live data
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  Eye,
  Shield,
  DollarSign,
  User,
  Scale,
  ArrowUpDown,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { AppointmentStatus } from "@utils/statusEnums";

// ── Status Configuration ─────────────────────────────────────

const STATUS_CONFIG = {
  [AppointmentStatus.PENDING_APPROVAL]: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400 animate-pulse" },
  [AppointmentStatus.APPROVED_AWAITING_PAYMENT]: { label: "Awaiting Payment", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
  [AppointmentStatus.PAYMENT_EXPIRED]: { label: "Payment Expired", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", dot: "bg-orange-400" },
  [AppointmentStatus.CONFIRMED]: { label: "Confirmed", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  [AppointmentStatus.COMPLETED]: { label: "Completed", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", dot: "bg-green-400" },
  [AppointmentStatus.DECLINED]: { label: "Declined", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400" },
  [AppointmentStatus.CANCELLED]: { label: "Cancelled", color: "text-neutral-400", bg: "bg-neutral-500/10", border: "border-neutral-500/20", dot: "bg-neutral-400" },
  [AppointmentStatus.EXPIRED]: { label: "Expired", color: "text-neutral-500", bg: "bg-neutral-500/10", border: "border-neutral-500/20", dot: "bg-neutral-500" },
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active", statuses: [AppointmentStatus.PENDING_APPROVAL, AppointmentStatus.APPROVED_AWAITING_PAYMENT, AppointmentStatus.CONFIRMED] },
  { id: "completed", label: "Completed", statuses: [AppointmentStatus.COMPLETED] },
  { id: "closed", label: "Closed", statuses: [AppointmentStatus.DECLINED, AppointmentStatus.CANCELLED, AppointmentStatus.EXPIRED] },
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

export default function AdminAppointments() {
  const { appointments } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    const tab = FILTER_TABS.find((t) => t.id === activeTab);
    let result = [...appointments];
    if (tab?.statuses) result = result.filter((a) => tab.statuses.includes(a.status));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) =>
        a.clientName?.toLowerCase().includes(q) ||
        a.lawyerName?.toLowerCase().includes(q) ||
        a.id?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortDir === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return result;
  }, [appointments, activeTab, searchQuery, sortField, sortDir]);

  const tabCounts = useMemo(() => {
    const counts = {};
    FILTER_TABS.forEach((tab) => {
      counts[tab.id] = tab.statuses
        ? appointments.filter((a) => tab.statuses.includes(a.status)).length
        : appointments.length;
    });
    return counts;
  }, [appointments]);

  const kpis = useMemo(() => [
    { label: "Total", value: appointments.length, icon: CalendarDays, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
    { label: "Pending", value: appointments.filter((a) => a.status === AppointmentStatus.PENDING_APPROVAL).length, icon: Clock, color: "text-amber-400 bg-amber-500/10" },
    { label: "Confirmed", value: appointments.filter((a) => a.status === AppointmentStatus.CONFIRMED).length, icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Completed", value: appointments.filter((a) => a.status === AppointmentStatus.COMPLETED).length, icon: CheckCircle2, color: "text-green-400 bg-green-500/10" },
    { label: "Declined", value: appointments.filter((a) => [AppointmentStatus.DECLINED, AppointmentStatus.CANCELLED].includes(a.status)).length, icon: XCircle, color: "text-red-400 bg-red-500/10" },
  ], [appointments]);

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
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Appointments Monitor</h1>
        <p className="text-sm text-neutral-500 mt-1">System-wide appointment oversight & management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
          <CalendarDays className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No appointments match your criteria</p>
          <p className="text-xs text-neutral-600 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[{ key: "id", label: "ID" }, { key: "clientName", label: "Client" }, { key: "lawyerName", label: "Lawyer" }, { key: "type", label: "Type" }, { key: "date", label: "Date" }, { key: "status", label: "Status" }].map((col) => (
                      <th key={col.key} onClick={() => toggleSort(col.key)}
                        className="py-3 px-4 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-neutral-300 transition-colors">
                        <span className="flex items-center gap-1">{col.label}{sortField === col.key && <ArrowUpDown className="w-3 h-3 text-[#C6A75E]" />}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt, i) => (
                    <motion.tr key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.02 }}
                      className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors">
                      <td className="py-3 px-4 text-xs font-mono text-neutral-400">{apt.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center"><User className="w-3.5 h-3.5 text-blue-400" /></div>
                          <span className="text-sm text-neutral-200">{apt.clientName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#C6A75E]/10 flex items-center justify-center"><Scale className="w-3.5 h-3.5 text-[#C6A75E]" /></div>
                          <span className="text-sm text-neutral-200">{apt.lawyerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-neutral-300 bg-dark-700/60 border border-white/[0.06]">{apt.type}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-neutral-400">
                        {apt.date ? new Date(apt.date).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        {apt.time && <span className="text-neutral-600 ml-1">• {apt.time}</span>}
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={apt.status} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map((apt, i) => (
              <motion.div key={apt.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">{apt.clientName}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">→ {apt.lawyerName}</p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-neutral-600">
                  <span className="font-mono">{apt.id}</span>
                  <span>{apt.type}</span>
                  <span>{apt.date ? new Date(apt.date).toLocaleDateString("en-LK", { month: "short", day: "numeric" }) : "—"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <p className="text-[11px] text-neutral-600 text-center">
        Showing {filtered.length} of {appointments.length} appointments • Data refreshes automatically
      </p>
    </div>
  );
}
