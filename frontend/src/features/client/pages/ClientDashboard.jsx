/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS CLIENT DASHBOARD — Store-Connected Premium Dashboard
 * ══════════════════════════════════════════════════════════════
 *
 * Fully connected to globalStore via useClientStore hook.
 * Shows LIVE data: appointments, cases, payments, notifications.
 *
 * Sections:
 *  1. Welcome banner with personalized greeting
 *  2. Alert banners (payment due, pending approvals)
 *  3. Premium KPI stat cards (live from store)
 *  4. Quick Actions grid
 *  5. Upcoming Appointments (live with countdowns)
 *  6. Active Cases with progress
 *  7. Recent Notifications feed
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  CalendarDays,
  Scale,
  CreditCard,
  Bell,
  Search,
  MessageSquare,
  ArrowRight,
  AlertTriangle,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Timer,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import useClientStore from "../hooks/useClientStore";
import {
  APPOINTMENT_STATUS_CONFIG,
  CASE_STATUS_CONFIG,
} from "@utils/statusEnums";
import CountdownTimer from "@components/common/CountdownTimer";
import StatusBadge from "@components/common/StatusBadge";
import ActivityFeed from "@components/common/ActivityFeed";
import { getGreeting } from "../data/mockClientData";

// ── Animated Section Wrapper ─────────────────────────────────

function Section({ children, title, icon: Icon, actionLabel, onAction, delay = 0, className = "" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {title && (
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-gold-500/[0.08] border border-gold-500/[0.1] flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold-400" />
              </div>
            )}
            <h2 className="text-base font-semibold text-neutral-100 tracking-tight">{title}</h2>
          </div>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-gold-400 transition-colors duration-200 group/action"
            >
              {actionLabel}
              <ArrowRight className="w-3 h-3 group-hover/action:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}
      {children}
    </motion.section>
  );
}

// ── Stat Card ────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, subtext, color, delay = 0, onClick }) {
  const colorMap = {
    gold: { iconBg: "bg-gold-500/10", iconColor: "text-gold-400", border: "border-gold-500/10" },
    emerald: { iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400", border: "border-emerald-500/10" },
    blue: { iconBg: "bg-blue-500/10", iconColor: "text-blue-400", border: "border-blue-500/10" },
    amber: { iconBg: "bg-amber-500/10", iconColor: "text-amber-400", border: "border-amber-500/10" },
    red: { iconBg: "bg-red-500/10", iconColor: "text-red-400", border: "border-red-500/10" },
  };
  const c = colorMap[color] || colorMap.gold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={`relative group rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 hover:border-white/[0.1] hover:shadow-[0_0_30px_-8px_rgba(212,168,74,0.1)] transition-all duration-300 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.iconBg} ${c.border} border`}>
          <Icon className={`w-5 h-5 ${c.iconColor}`} />
        </div>
        <span className="text-2xl font-bold text-neutral-100 tabular-nums">{value}</span>
      </div>
      <p className="text-sm font-medium text-neutral-400">{label}</p>
      {subtext && <p className="text-[11px] text-neutral-600 mt-0.5">{subtext}</p>}
    </motion.div>
  );
}

// ── Quick Action ─────────────────────────────────────────────

function QuickAction({ icon: Icon, label, description, path, color = "gold", delay = 0 }) {
  const navigate = useNavigate();
  const colorMap = {
    gold: "text-gold-400 bg-gold-500/10 border-gold-500/10",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10",
    violet: "text-violet-400 bg-violet-500/10 border-violet-500/10",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      onClick={() => navigate(path)}
      className="group flex items-center gap-3.5 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03] transition-all text-left w-full"
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl border shrink-0 ${colorMap[color]}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-200 group-hover:text-gold-400 transition-colors">{label}</p>
        <p className="text-[11px] text-neutral-600 truncate">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-gold-500 transition-colors shrink-0" />
    </motion.button>
  );
}

// ── Alert Banner ─────────────────────────────────────────────

function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="space-y-2"
    >
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${alert.bg} ${alert.border}`}
        >
          <alert.icon className={`w-4 h-4 ${alert.iconColor} shrink-0`} />
          <p className="text-xs font-medium text-neutral-300 flex-1">{alert.message}</p>
          {alert.action && (
            <button
              onClick={alert.action.onClick}
              className={`text-xs font-semibold ${alert.iconColor} hover:underline shrink-0`}
            >
              {alert.action.label}
            </button>
          )}
        </div>
      ))}
    </motion.div>
  );
}

// ── Compact Appointment Row ──────────────────────────────────

function AppointmentRow({ appointment, onClick }) {
  const config = APPOINTMENT_STATUS_CONFIG[appointment.status];
  const showCountdown =
    appointment.status === "PENDING_LAWYER_APPROVAL" ||
    appointment.status === "APPROVED_AWAITING_PAYMENT";
  const deadline =
    appointment.status === "PENDING_LAWYER_APPROVAL"
      ? appointment.approvalDeadline
      : appointment.paymentDeadline;

  return (
    <motion.div
      whileHover={{ x: 2 }}
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
    >
      <div className="relative shrink-0">
        <img
          src={appointment.lawyerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.lawyerName)}&background=1a1a1d&color=d4a84a&size=40`}
          alt={appointment.lawyerName}
          className="w-10 h-10 rounded-xl object-cover border border-white/[0.06]"
        />
        {config && <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${config.dot} border-2 border-dark-900`} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-200 truncate">{appointment.lawyerName}</p>
          <StatusBadge status={appointment.status} type="appointment" size="xs" />
        </div>
        <p className="text-[11px] text-neutral-500 truncate">
          {appointment.caseType} • {appointment.selectedDate} at {appointment.selectedTime}
        </p>
      </div>
      {showCountdown && deadline ? (
        <CountdownTimer deadline={deadline} totalDuration={appointment.approvalDuration || appointment.paymentDuration} variant="inline" showLabel={false} />
      ) : (
        <ChevronRight className="w-4 h-4 text-neutral-700 shrink-0" />
      )}
    </motion.div>
  );
}

// ── Compact Case Row ─────────────────────────────────────────

function CaseRow({ caseData, onClick }) {
  const progress = caseData.progress || 0;

  return (
    <motion.div
      whileHover={{ x: 2 }}
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/8 border border-gold-500/10 shrink-0">
        <Briefcase className="w-4 h-4 text-gold-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-200 truncate">{caseData.title}</p>
          <StatusBadge status={caseData.status} type="case" size="xs" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden max-w-[120px]">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-500/70 to-gold-400 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] text-neutral-600">{progress}%</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-700 shrink-0" />
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN DASHBOARD COMPONENT
// ══════════════════════════════════════════════════════════════

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    myAppointments,
    myCases,
    myPayments,
    myNotifications,
    pendingApprovals,
    awaitingPayment,
    confirmedAppointments,
    activeCases,
    paymentDueCases,
    pendingPayments,
    totalSpent,
    dismissNotification,
  } = useClientStore();

  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user?.fullName?.split(" ")[0] || "there";

  // ── Build Alerts ──
  const alerts = useMemo(() => {
    const list = [];
    if (awaitingPayment.length > 0) {
      list.push({
        icon: CreditCard,
        iconColor: "text-amber-400",
        bg: "bg-amber-500/8",
        border: "border-amber-500/15",
        message: `${awaitingPayment.length} appointment${awaitingPayment.length > 1 ? "s" : ""} awaiting payment — complete before deadline.`,
        action: { label: "Pay Now →", onClick: () => navigate("/dashboard/client/appointments") },
      });
    }
    if (paymentDueCases.length > 0) {
      list.push({
        icon: AlertTriangle,
        iconColor: "text-red-400",
        bg: "bg-red-500/8",
        border: "border-red-500/15",
        message: `${paymentDueCases.length} case${paymentDueCases.length > 1 ? "s" : ""} with payment due. Avoid service disruption.`,
        action: { label: "View Cases →", onClick: () => navigate("/dashboard/client/cases") },
      });
    }
    if (pendingApprovals.length > 0) {
      list.push({
        icon: Timer,
        iconColor: "text-blue-400",
        bg: "bg-blue-500/8",
        border: "border-blue-500/15",
        message: `${pendingApprovals.length} appointment${pendingApprovals.length > 1 ? "s" : ""} pending lawyer approval.`,
        action: { label: "Track →", onClick: () => navigate("/dashboard/client/appointments") },
      });
    }
    return list;
  }, [awaitingPayment, paymentDueCases, pendingApprovals, navigate]);

  // ── Filter upcoming ──
  const upcomingAppointments = useMemo(() => {
    const active = myAppointments.filter(
      (a) => ["PENDING_LAWYER_APPROVAL", "APPROVED_AWAITING_PAYMENT", "CONFIRMED"].includes(a.status)
    );
    return active.sort((a, b) => {
      const priority = { APPROVED_AWAITING_PAYMENT: 0, PENDING_LAWYER_APPROVAL: 1, CONFIRMED: 2 };
      return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
    }).slice(0, 5);
  }, [myAppointments]);

  const displayCases = useMemo(() => {
    return myCases
      .filter((c) => !["CLOSED_BY_LAWYER", "ENDED_BY_CLIENT", "TERMINATED"].includes(c.status))
      .slice(0, 5);
  }, [myCases]);

  const quickActions = [
    { icon: Search, label: "Find a Lawyer", description: "Browse verified attorneys", path: "/dashboard/client/find-lawyer", color: "gold" },
    { icon: CalendarDays, label: "My Appointments", description: "Track consultations", path: "/dashboard/client/appointments", color: "blue" },
    { icon: Scale, label: "My Cases", description: "Active legal matters", path: "/dashboard/client/cases", color: "emerald" },
    { icon: MessageSquare, label: "Messages", description: "Chat with lawyers", path: "/dashboard/client/messages", color: "violet" },
  ];

  return (
    <div className="space-y-7 pb-6">
      {/* 1. WELCOME */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800/80 via-dark-800/40 to-dark-900/60 rounded-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(198,167,94,0.06)_0%,transparent_60%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-xs font-medium text-gold-400/80 tracking-wide uppercase">{greeting}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-50 tracking-tight mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-neutral-400 max-w-lg leading-relaxed">
            Your legal matters are in good hands. Here's a live overview of your cases, appointments, and activity.
          </p>
          <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold-500/50 to-transparent rounded-full" />
        </div>
      </motion.div>

      {/* 2. ALERTS */}
      <AlertBanner alerts={alerts} />

      {/* 3. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Appointments" value={myAppointments.length} subtext={`${confirmedAppointments.length} confirmed, ${pendingApprovals.length} pending`} color="blue" delay={0.1} onClick={() => navigate("/dashboard/client/appointments")} />
        <StatCard icon={Scale} label="Active Cases" value={activeCases.length} subtext={`${myCases.length} total`} color="emerald" delay={0.15} onClick={() => navigate("/dashboard/client/cases")} />
        <StatCard icon={CreditCard} label="Payments Due" value={pendingPayments.length} subtext={pendingPayments.length > 0 ? "Action required" : "All clear"} color={pendingPayments.length > 0 ? "amber" : "gold"} delay={0.2} onClick={() => navigate("/dashboard/client/payments")} />
        <StatCard icon={TrendingUp} label="Total Spent" value={`LKR ${totalSpent.toLocaleString()}`} subtext={`${myPayments.filter((p) => p.status === "SUCCESS").length} transactions`} color="gold" delay={0.25} />
      </div>

      {/* 4. QUICK ACTIONS */}
      <Section delay={0.25}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {quickActions.map((a, i) => (
            <QuickAction key={a.label} {...a} delay={0.25 + i * 0.05} />
          ))}
        </div>
      </Section>

      {/* 5 + 6. APPOINTMENTS & CASES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Upcoming Appointments" icon={CalendarDays} actionLabel="View All" onAction={() => navigate("/dashboard/client/appointments")} delay={0.35} className="min-w-0">
          <div className="rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
            {upcomingAppointments.length > 0 ? (
              <div className="divide-y divide-white/[0.04]">
                {upcomingAppointments.map((apt) => (
                  <AppointmentRow key={apt.id} appointment={apt} onClick={() => navigate("/dashboard/client/appointments")} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <CalendarDays className="w-8 h-8 text-neutral-700 mb-2" />
                <p className="text-sm text-neutral-500">No upcoming appointments</p>
                <button onClick={() => navigate("/dashboard/client/find-lawyer")} className="mt-3 text-xs font-semibold text-gold-400 hover:underline">
                  Book a Consultation →
                </button>
              </div>
            )}
          </div>
        </Section>

        <Section title="Active Cases" icon={Scale} actionLabel="View All" onAction={() => navigate("/dashboard/client/cases")} delay={0.4} className="min-w-0">
          <div className="rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
            {displayCases.length > 0 ? (
              <div className="divide-y divide-white/[0.04]">
                {displayCases.map((c) => (
                  <CaseRow key={c.id} caseData={c} onClick={() => navigate(`/dashboard/client/cases/${c.id}`)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Scale className="w-8 h-8 text-neutral-700 mb-2" />
                <p className="text-sm text-neutral-500">No active cases</p>
              </div>
            )}
          </div>
        </Section>
      </div>

      {/* 7. NOTIFICATIONS */}
      <Section title="Recent Notifications" icon={Bell} delay={0.5}>
        <div className="rounded-2xl bg-dark-800/20 border border-white/[0.04] p-4">
          <ActivityFeed
            notifications={myNotifications}
            onDismiss={dismissNotification}
            maxItems={8}
            emptyMessage="No notifications yet. Your activity will appear here."
          />
        </div>
      </Section>
    </div>
  );
}
