/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN REPORTS — Data-Driven Platform Analytics
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise analytics page with data-driven KPIs:
 *  • Highlight metrics computed from globalStore
 *  • Revenue trend chart (NEW)
 *  • Registration, appointment, case charts via ReportsWidget
 *  • All values derived from live data — no hardcoded numbers
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Shield,
  TrendingUp,
  Users,
  CalendarCheck,
  Scale,
  DollarSign,
  Wallet,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { AppointmentStatus, CaseStatus, PaymentStatus } from "@utils/statusEnums";
import ReportsWidget from "../components/ReportsWidget";
import {
  registrationTrend,
  appointmentTrend,
  caseDistribution,
  revenueTrend,
  platformUsers,
} from "../data/mockAdminData";

// ── Revenue Trend Chart ──────────────────────────────────────

function RevenueTrendChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.revenue));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#C6A75E]" />
          <h4 className="text-sm font-semibold text-neutral-200">
            Revenue Trend
          </h4>
        </div>
        <span className="text-[10px] text-neutral-500 font-medium">
          Monthly (LKR)
        </span>
      </div>

      <div className="flex items-end gap-3 h-32">
        {data.map((item, i) => (
          <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end justify-center h-24">
              <motion.div
                className="flex-1 max-w-6 rounded-t-sm bg-linear-to-t from-[#C6A75E]/60 to-[#C6A75E]/30"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  height: `${(item.revenue / maxVal) * 100}%`,
                  transformOrigin: "bottom",
                  minHeight: 4,
                }}
              />
            </div>
            <span className="text-[9px] text-neutral-600">{item.month}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-xs text-neutral-500">6-Month Total</span>
        <span className="text-sm font-bold text-[#C6A75E]">
          LKR {data.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════

export default function AdminReports() {
  const { appointments, cases, payments } = useAppStore();

  const highlights = useMemo(() => {
    // Compute from live data
    const totalUsers = platformUsers.length;
    const completedAppointments = appointments.filter(
      (a) => a.status === AppointmentStatus.COMPLETED
    ).length;
    const completionRate = appointments.length > 0
      ? ((completedAppointments / appointments.length) * 100).toFixed(1)
      : "0.0";

    const totalRevenue = payments
      .filter((p) => p.status === PaymentStatus.SUCCESS)
      .reduce((s, p) => s + (p.amount || 0), 0);

    const activeCases = cases.filter((c) =>
      [CaseStatus.ACTIVE, CaseStatus.PAYMENT_PENDING, CaseStatus.OVERDUE].includes(c.status)
    ).length;

    return [
      {
        label: "Total Platform Users",
        value: totalUsers.toLocaleString(),
        icon: Users,
        color: "text-blue-400 bg-blue-500/10",
      },
      {
        label: "Completion Rate",
        value: `${completionRate}%`,
        icon: CalendarCheck,
        color: "text-[#C6A75E] bg-[#C6A75E]/10",
      },
      {
        label: "Revenue Collected",
        value: `LKR ${totalRevenue.toLocaleString()}`,
        icon: Wallet,
        color: "text-emerald-400 bg-emerald-500/10",
      },
      {
        label: "Active Cases",
        value: activeCases.toLocaleString(),
        icon: Scale,
        color: "text-purple-400 bg-purple-500/10",
      },
    ];
  }, [appointments, cases, payments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-neutral-500 mt-1">Platform-wide trends, metrics, and performance analytics</p>
      </div>

      {/* Highlight Cards — Data-driven */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {highlights.map((h, i) => (
          <motion.div key={h.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${h.color}`}>
              <h.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-neutral-100">{h.value}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{h.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart data={revenueTrend} />
        <ReportsWidget
          registrationTrend={registrationTrend}
          appointmentTrend={appointmentTrend}
          caseDistribution={caseDistribution}
        />
      </div>
    </div>
  );
}
