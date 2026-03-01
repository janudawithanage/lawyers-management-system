/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER DASHBOARD — Store-Connected Professional Legal Workspace
 * ══════════════════════════════════════════════════════════════
 *
 * Fully connected to globalStore via useLawyerStore.
 * Live KPIs, pending-request approval, today's schedule,
 * active cases, and real-time activity feed.
 *
 *  1. Summary Header   — Greeting, live stats badges
 *  2. Alert Banner     — Urgent pending requests
 *  3. KPI Stat Cards   — From store derived stats
 *  4. Quick Actions    — Navigation shortcuts
 *  5. Pending Requests — Approve / Decline with countdown
 *  6. Today's Schedule — Confirmed appointments for today
 *  7. Active Cases     — Case table with StatusBadge
 *  8. Activity Feed    — From store notifications
 */

import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Scale,
  CalendarDays,
  UserPlus,
  ArrowRight,
  Inbox,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Video,
  Phone,
  Building2,
  AlertTriangle,
  FileText,
  TrendingUp,
  Bell,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import useLawyerStore from "../hooks/useLawyerStore";
import { StatusBadge, CountdownTimer, ActivityFeed } from "@components/common";
import { AppointmentStatus, CaseStatus } from "@utils/statusEnums";

// ══════════════════════════════════════════════════════════════
// SECTION WRAPPER — Reusable animated section container
// ══════════════════════════════════════════════════════════════

function Section({ title, icon: Icon, action, onAction, delay = 0, className = "", children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4 text-gold-400" />}
              <h3 className="text-sm font-semibold text-neutral-300 tracking-wide">
                {title}
              </h3>
            </div>
          )}
          {action && (
            <button
              onClick={onAction}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-gold-400 transition-colors duration-200 group/action"
            >
              {action}
              <ArrowRight className="w-3 h-3 group-hover/action:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}
      {children}
    </motion.section>
  );
}

// ══════════════════════════════════════════════════════════════
// STAT CARD — Individual KPI card
// ══════════════════════════════════════════════════════════════

function StatCard({ icon: Icon, label, value, color = "gold", delay = 0 }) {
  const colors = {
    gold: "text-gold-400 bg-gold-500/10 border-gold-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl bg-dark-800/40 border border-white/[0.06] p-5 hover:border-white/[0.1] transition-colors duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// PENDING REQUEST CARD — Approve / Decline with countdown
// ══════════════════════════════════════════════════════════════

const CONSULT_ICONS = {
  video: Video,
  phone: Phone,
  "in-office": Building2,
};

function PendingRequestCard({ appointment, onApprove, onDecline }) {
  const ConsultIcon = CONSULT_ICONS[appointment.consultationType] || CalendarDays;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl bg-dark-800/40 border border-amber-500/15 p-5 space-y-4"
    >
      {/* Client info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center text-gold-400 font-bold text-sm">
            {appointment.clientName?.charAt(0) || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{appointment.clientName}</p>
            <p className="text-xs text-neutral-500">{appointment.caseType || appointment.lawyerSpecialization}</p>
          </div>
        </div>
        <StatusBadge status={appointment.status} type="appointment" size="xs" />
      </div>

      {/* Details row */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <ConsultIcon className="w-3.5 h-3.5" />
          {appointment.consultationType}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="w-3.5 h-3.5" />
          {appointment.selectedDate}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {appointment.selectedTime}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5" />
          Rs. {appointment.consultationFee?.toLocaleString()}
        </span>
      </div>

      {/* Description */}
      {appointment.description && (
        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
          {appointment.description}
        </p>
      )}

      {/* Countdown */}
      {appointment.approvalDeadline && (
        <CountdownTimer
          deadline={appointment.approvalDeadline}
          totalDuration={appointment.approvalDuration}
          label="Approval window"
          variant="inline"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => onApprove(appointment.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-xs font-semibold hover:bg-emerald-500/25 transition-all duration-200"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Approve
        </button>
        <button
          onClick={() => onDecline(appointment.id, "Declined by lawyer")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-all duration-200"
        >
          <XCircle className="w-3.5 h-3.5" />
          Decline
        </button>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
// QUICK ACTION — Shortcut card
// ══════════════════════════════════════════════════════════════

const QUICK_ACTIONS = [
  { label: "Appointments", icon: CalendarDays, path: "/dashboard/lawyer/appointments", color: "gold" },
  { label: "My Cases", icon: Briefcase, path: "/dashboard/lawyer/cases", color: "blue" },
  { label: "Earnings", icon: DollarSign, path: "/dashboard/lawyer/earnings", color: "emerald" },
  { label: "Documents", icon: FileText, path: "/dashboard/lawyer/documents", color: "purple" },
];

function QuickAction({ action, navigate, delay = 0 }) {
  const colors = {
    gold: "text-gold-400 bg-gold-500/10 border-gold-500/20 hover:border-gold-500/30",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/30",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/30",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:border-purple-500/30",
  };
  const Icon = action.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      onClick={() => navigate(action.path)}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 ${colors[action.color]}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-xs font-semibold">{action.label}</span>
    </motion.button>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function LawyerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    myAppointments,
    myCases,
    myNotifications,
    todaysAppointments,
    pendingRequests,
    awaitingPayment,
    confirmedAppointments,
    completedAppointments,
    activeCases,
    totalEarned,
    approveAppointment,
    declineAppointment,
    dismissNotification,
  } = useLawyerStore();

  // ── Greeting ──
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const firstName = user?.fullName?.split(" ")[0] || user?.name?.split(" ")[0] || "Counselor";

  // ── Urgent count (pending requests that need immediate attention) ──
  const urgentCount = pendingRequests.length;

  // ── Handle approve / decline ──
  const handleApprove = useCallback(
    (aptId) => approveAppointment(aptId),
    [approveAppointment]
  );
  const handleDecline = useCallback(
    (aptId, reason) => declineAppointment(aptId, reason),
    [declineAppointment]
  );

  return (
    <div className="space-y-8 pb-4">
      {/* ═══════════════════════════════════════════════════════
          1. SUMMARY HEADER — Greeting + quick context
          ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {greeting},{" "}
          <span className="text-gold-400">{firstName}</span>
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {myAppointments.length} appointment{myAppointments.length !== 1 ? "s" : ""} ·{" "}
          {activeCases.length} active case{activeCases.length !== 1 ? "s" : ""} ·{" "}
          {todaysAppointments.length} today
        </p>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          2. ALERT BANNER — Urgent pending requests
          ═══════════════════════════════════════════════════════ */}
      {urgentCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            <span className="font-bold">{urgentCount}</span> consultation request
            {urgentCount !== 1 ? "s" : ""} awaiting your approval
          </p>
          <button
            onClick={() => {
              document.getElementById("pending-requests")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="ml-auto text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Review Now →
          </button>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════
          3. KPI STAT CARDS
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={UserPlus} label="Pending Requests" value={pendingRequests.length} color="amber" delay={0.1} />
        <StatCard icon={Clock} label="Awaiting Payment" value={awaitingPayment.length} color="blue" delay={0.15} />
        <StatCard icon={CalendarDays} label="Confirmed" value={confirmedAppointments.length} color="emerald" delay={0.2} />
        <StatCard icon={CheckCircle} label="Completed" value={completedAppointments.length} color="gold" delay={0.25} />
        <StatCard icon={Scale} label="Active Cases" value={activeCases.length} color="purple" delay={0.3} />
        <StatCard icon={DollarSign} label="Total Earned" value={`Rs.${(totalEarned / 1000).toFixed(0)}k`} color="emerald" delay={0.35} />
      </div>

      {/* ═══════════════════════════════════════════════════════
          4. QUICK ACTIONS
          ═══════════════════════════════════════════════════════ */}
      <Section delay={0.25}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action, i) => (
            <QuickAction
              key={action.label}
              action={action}
              navigate={navigate}
              delay={0.25 + i * 0.05}
            />
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          5. PENDING REQUESTS — Approve / Decline
          ═══════════════════════════════════════════════════════ */}
      <div id="pending-requests">
        <Section
          title="Pending Consultation Requests"
          icon={UserPlus}
          action="View All Appointments"
          onAction={() => navigate("/dashboard/lawyer/appointments")}
          delay={0.3}
        >
          {pendingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingRequests.map((apt) => (
                <PendingRequestCard
                  key={apt.id}
                  appointment={apt}
                  onApprove={handleApprove}
                  onDecline={handleDecline}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-dark-800/30 border border-white/[0.04]">
              <div className="w-12 h-12 rounded-2xl bg-dark-700/50 border border-white/[0.06] flex items-center justify-center mb-3">
                <UserPlus className="w-5 h-5 text-neutral-600" />
              </div>
              <p className="text-sm text-neutral-500 text-center">
                No pending requests. New consultation requests will appear here.
              </p>
            </div>
          )}
        </Section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          6 + 7. TODAY'S SCHEDULE & ACTIVE CASES — 2-column
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Today's Schedule ────────────────────────────── */}
        <Section
          title="Today's Schedule"
          icon={CalendarDays}
          action="Full Schedule"
          onAction={() => navigate("/dashboard/lawyer/schedule")}
          delay={0.35}
          className="min-w-0"
        >
          <div className="rounded-2xl bg-dark-800/30 border border-white/[0.04] divide-y divide-white/[0.04]">
            {todaysAppointments.length > 0 ? (
              todaysAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center text-gold-400 text-xs font-bold shrink-0">
                    {apt.clientName?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{apt.clientName}</p>
                    <p className="text-xs text-neutral-500">
                      {apt.selectedTime} · {apt.consultationType} · {apt.caseType || "Consultation"}
                    </p>
                  </div>
                  <StatusBadge status={apt.status} type="appointment" size="xs" />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <CalendarDays className="w-8 h-8 text-neutral-700 mb-2" />
                <p className="text-sm text-neutral-500">No appointments today</p>
              </div>
            )}
          </div>
        </Section>

        {/* ── Active Cases ────────────────────────────────── */}
        <Section
          title="Active Cases"
          icon={Scale}
          action="View All Cases"
          onAction={() => navigate("/dashboard/lawyer/cases")}
          delay={0.4}
          className="min-w-0"
        >
          <div className="rounded-2xl bg-dark-800/30 border border-white/[0.04] divide-y divide-white/[0.04]">
            {activeCases.length > 0 ? (
              activeCases.map((cs) => (
                <div
                  key={cs.id}
                  onClick={() => navigate(`/dashboard/lawyer/cases/${cs.id}`)}
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{cs.title || cs.caseType}</p>
                    <p className="text-xs text-neutral-500">
                      {cs.clientName} · {cs.caseType}
                    </p>
                  </div>
                  <StatusBadge status={cs.status} type="case" size="xs" />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Scale className="w-8 h-8 text-neutral-700 mb-2" />
                <p className="text-sm text-neutral-500">No active cases yet</p>
              </div>
            )}
          </div>
        </Section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          8. ACTIVITY FEED — Real-time notifications
          ═══════════════════════════════════════════════════════ */}
      <Section
        title="Recent Activity"
        icon={Bell}
        action="View All"
        onAction={() => navigate("/dashboard/lawyer/notifications")}
        delay={0.45}
      >
        <div className="rounded-2xl bg-dark-800/30 border border-white/[0.04] p-4">
          <ActivityFeed
            notifications={myNotifications}
            onDismiss={dismissNotification}
            maxItems={8}
            emptyMessage="No recent activity"
          />
        </div>
      </Section>
    </div>
  );
}
