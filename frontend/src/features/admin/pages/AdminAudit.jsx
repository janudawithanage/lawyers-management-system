/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN AUDIT LOG — System Activity & Audit Trail
 * ══════════════════════════════════════════════════════════════
 *
 * Full-page audit log view with filtering by type and severity.
 * Uses existing ActivityLogItem component.
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ScrollText,
  Shield,
  Search,
  Filter,
  ShieldCheck,
  Ban,
  LogIn,
  Settings,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import ActivityLogItem from "../components/ActivityLogItem";
import { activityLog, formatRelativeTime } from "../data/mockAdminData";

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "verification", label: "Verification" },
  { id: "suspension", label: "Suspension" },
  { id: "activation", label: "Activation" },
  { id: "login", label: "Login" },
  { id: "system", label: "System" },
];

const SEVERITY_FILTERS = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "warning", label: "Warning" },
  { id: "info", label: "Info" },
];

export default function AdminAudit() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedLog = useMemo(() => {
    return [...activityLog].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, []);

  const filtered = useMemo(() => {
    let result = sortedLog;
    if (typeFilter !== "all") result = result.filter((l) => l.type === typeFilter);
    if (severityFilter !== "all") result = result.filter((l) => l.severity === severityFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) =>
        l.action.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.adminName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [sortedLog, typeFilter, severityFilter, searchQuery]);

  const stats = useMemo(() => [
    { label: "Total Events", value: activityLog.length, icon: ScrollText, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
    { label: "Critical", value: activityLog.filter((l) => l.severity === "critical").length, icon: AlertCircle, color: "text-red-400 bg-red-500/10" },
    { label: "Warnings", value: activityLog.filter((l) => l.severity === "warning").length, icon: AlertTriangle, color: "text-amber-400 bg-amber-500/10" },
    { label: "Info", value: activityLog.filter((l) => l.severity === "info").length, icon: Info, color: "text-blue-400 bg-blue-500/10" },
  ], []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">System Logs</h1>
        <p className="text-sm text-neutral-500 mt-1">Complete audit trail of all administrative actions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-neutral-100">{s.value}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity log…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {TYPE_FILTERS.map((f) => (
              <button key={f.id} onClick={() => setTypeFilter(f.id)}
                className={`px-2.5 py-1.5 text-[10px] font-medium transition-colors ${typeFilter === f.id ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {SEVERITY_FILTERS.map((f) => (
              <button key={f.id} onClick={() => setSeverityFilter(f.id)}
                className={`px-2.5 py-1.5 text-[10px] font-medium transition-colors ${severityFilter === f.id ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Log Items */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <ScrollText className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No log entries match your criteria</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-dark-800/30 border border-white/[0.04] p-5">
          {filtered.map((log, i) => (
            <ActivityLogItem key={log.id} log={log} index={i} isLast={i === filtered.length - 1} />
          ))}
        </div>
      )}

      <p className="text-[11px] text-neutral-600 text-center">
        Showing {filtered.length} of {activityLog.length} log entries
      </p>
    </div>
  );
}
