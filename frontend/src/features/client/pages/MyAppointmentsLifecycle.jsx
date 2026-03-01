/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS MY APPOINTMENTS LIFECYCLE — Full Appointment Manager
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise appointment management page with:
 *  • Tab-based filtering (All, Pending, Active, Completed, Cancelled)
 *  • Live countdown timers for approval & payment windows
 *  • Status badges with color logic
 *  • Payment modal integration
 *  • Cancel appointment with reason
 *  • Status timeline visualization
 *  • Skeleton loading states
 *  • Empty states with CTAs
 *
 * Connected to: useAppStore() for state & actions
 */

import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Video,
  MapPin,
  Phone,
  User,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  CreditCard,
  CheckCircle,
  XCircle,
  Slash,
  TimerOff,
  ArrowRight,
  Scale,
  MessageSquare,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { AppointmentStatus } from "@utils/statusEnums";
import { APPOINTMENT_STATUS_CONFIG } from "@utils/statusEnums";
import StatusBadge from "@components/common/StatusBadge";
import CountdownTimer from "@components/common/CountdownTimer";
import PaymentModal from "../components/PaymentModal";

// ── Tab Configuration ────────────────────────────────────────

const TABS = [
  { id: "all", label: "All", count: null },
  { id: "active", label: "Active", statuses: [AppointmentStatus.PENDING_APPROVAL, AppointmentStatus.APPROVED_AWAITING_PAYMENT, AppointmentStatus.CONFIRMED] },
  { id: "completed", label: "Completed", statuses: [AppointmentStatus.COMPLETED] },
  { id: "cancelled", label: "Cancelled / Expired", statuses: [AppointmentStatus.CANCELLED, AppointmentStatus.DECLINED, AppointmentStatus.EXPIRED, AppointmentStatus.PAYMENT_EXPIRED] },
];

const CONSULTATION_ICONS = {
  video: Video,
  "in-office": MapPin,
  phone: Phone,
};

// ── Skeleton Loader ──────────────────────────────────────────

function AppointmentSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-dark-800/60 border border-white/[0.06] animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-dark-600" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 bg-dark-600 rounded" />
          <div className="h-3 w-32 bg-dark-700 rounded" />
          <div className="h-3 w-64 bg-dark-700 rounded" />
        </div>
        <div className="h-6 w-24 bg-dark-600 rounded-full" />
      </div>
    </div>
  );
}

// ── Appointment Card ─────────────────────────────────────────

function AppointmentLifecycleCard({ appointment, onCancel, onOpenPayment }) {
  const [expanded, setExpanded] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const TypeIcon = CONSULTATION_ICONS[appointment.consultationType] || CalendarDays;
  const isPending = appointment.status === AppointmentStatus.PENDING_APPROVAL;
  const isAwaitingPayment = appointment.status === AppointmentStatus.APPROVED_AWAITING_PAYMENT;
  const isConfirmed = appointment.status === AppointmentStatus.CONFIRMED;
  const isCompleted = appointment.status === AppointmentStatus.COMPLETED;
  const canCancel = isPending || isConfirmed;

  const handleCancel = () => {
    onCancel(appointment.id, cancelReason);
    setShowCancelForm(false);
    setCancelReason("");
  };

  return (
    <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${
      isPending || isAwaitingPayment
        ? "bg-dark-800/80 border-gold-500/15 shadow-[0_0_30px_rgba(198,167,94,0.05)]"
        : "bg-dark-800/60 border-white/[0.06]"
    }`}>
      {/* Main Content */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {appointment.lawyerAvatar ? (
              <img
                src={appointment.lawyerAvatar}
                alt={appointment.lawyerName}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/[0.08]"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center ring-1 ring-gold-500/20">
                <User className="w-5 h-5 text-gold-400" />
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center ${
              appointment.consultationType === "video" ? "bg-blue-500/20" :
              appointment.consultationType === "in-office" ? "bg-emerald-500/20" :
              "bg-purple-500/20"
            }`}>
              <TypeIcon className="w-3 h-3 text-neutral-300" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">{appointment.lawyerName}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{appointment.lawyerSpecialization}</p>
              </div>
              <StatusBadge status={appointment.status} type="appointment" size="xs" />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                <CalendarDays className="w-3.5 h-3.5" />
                {appointment.selectedDate} • {appointment.selectedTime}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Scale className="w-3.5 h-3.5" />
                {appointment.caseType}
              </span>
              <span className="text-xs text-gold-400 font-medium">
                LKR {appointment.consultationFee?.toLocaleString()}
              </span>
            </div>

            {/* Countdown Timers */}
            {isPending && appointment.approvalDeadline && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/10">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-400/80">Lawyer approval window:</span>
                <CountdownTimer
                  deadline={appointment.approvalDeadline}
                  totalDuration={appointment.approvalDuration}
                  variant="inline"
                  showLabel={false}
                />
              </div>
            )}

            {isAwaitingPayment && appointment.paymentDeadline && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/[0.06] border border-blue-500/10">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-blue-400/80">Payment deadline:</span>
                <CountdownTimer
                  deadline={appointment.paymentDeadline}
                  totalDuration={appointment.paymentDuration}
                  variant="inline"
                  showLabel={false}
                />
              </div>
            )}

            {/* Decline Reason */}
            {appointment.status === AppointmentStatus.DECLINED && appointment.declineReason && (
              <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-500/[0.06] border border-red-500/10">
                <Slash className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-400/80">Reason: {appointment.declineReason}</p>
              </div>
            )}

            {/* Cancel Reason */}
            {appointment.status === AppointmentStatus.CANCELLED && appointment.cancelReason && (
              <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-neutral-500/[0.06] border border-neutral-500/10">
                <X className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-400/80">Cancellation: {appointment.cancelReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04] transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? "Less" : "Details"}
            </button>
            <span className="text-[10px] text-neutral-700">#{appointment.id.slice(-8)}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAwaitingPayment && (
              <button
                onClick={() => onOpenPayment(appointment)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-gold-btn text-dark-950 text-xs font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pay Now
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => setShowCancelForm(!showCancelForm)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors border border-red-500/10"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3 border-t border-white/[0.04]">
          <div className="pt-3">
            <p className="text-xs text-neutral-500 mb-1">Description</p>
            <p className="text-sm text-neutral-300">{appointment.description || "No description provided"}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-neutral-500">Consultation Type</p>
              <p className="text-neutral-300 capitalize mt-0.5">{appointment.consultationType}</p>
            </div>
            <div>
              <p className="text-neutral-500">Urgency</p>
              <p className={`capitalize mt-0.5 ${
                appointment.urgency === "high" ? "text-red-400" :
                appointment.urgency === "medium" ? "text-amber-400" :
                "text-emerald-400"
              }`}>{appointment.urgency || "Normal"}</p>
            </div>
            <div>
              <p className="text-neutral-500">Created</p>
              <p className="text-neutral-300 mt-0.5">{new Date(appointment.createdAt).toLocaleString("en-LK")}</p>
            </div>
            {appointment.completedAt && (
              <div>
                <p className="text-neutral-500">Completed</p>
                <p className="text-neutral-300 mt-0.5">{new Date(appointment.completedAt).toLocaleString("en-LK")}</p>
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="pt-2">
            <p className="text-xs text-neutral-500 mb-2">Status Timeline</p>
            <div className="space-y-2">
              <TimelineStep label="Booked" time={appointment.createdAt} done />
              <TimelineStep
                label="Lawyer Review"
                time={appointment.approvedAt || appointment.declinedAt}
                done={!!appointment.approvedAt || !!appointment.declinedAt}
                active={isPending}
              />
              {appointment.status !== AppointmentStatus.DECLINED && (
                <>
                  <TimelineStep
                    label="Payment"
                    time={appointment.paidAt}
                    done={!!appointment.paidAt}
                    active={isAwaitingPayment}
                  />
                  <TimelineStep
                    label="Confirmed"
                    time={appointment.paidAt}
                    done={isConfirmed || isCompleted}
                    active={isConfirmed}
                  />
                  <TimelineStep
                    label="Completed"
                    time={appointment.completedAt}
                    done={isCompleted}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Form */}
      {showCancelForm && (
        <div className="px-5 pb-5 space-y-3 border-t border-red-500/10">
          <div className="pt-3">
            <p className="text-xs text-neutral-400 mb-2">Are you sure you want to cancel this appointment?</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)…"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-dark-900/60 border border-white/[0.08] text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-red-500/30 resize-none"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
              >
                Confirm Cancel
              </button>
              <button
                onClick={() => setShowCancelForm(false)}
                className="px-4 py-2 rounded-lg text-neutral-500 text-xs hover:bg-white/[0.04] transition-colors"
              >
                Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Timeline Step ────────────────────────────────────────────

function TimelineStep({ label, time, done, active }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
        done ? "bg-emerald-400" :
        active ? "bg-gold-400 animate-pulse" :
        "bg-dark-500"
      }`} />
      <div className="flex items-center gap-2 flex-1">
        <span className={`text-xs ${done ? "text-neutral-300" : active ? "text-gold-400" : "text-neutral-600"}`}>
          {label}
        </span>
        {time && (
          <span className="text-[10px] text-neutral-600">
            {new Date(time).toLocaleString("en-LK", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MyAppointmentsLifecycle() {
  const { appointments, payments, cancelAppointment, confirmPayment } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentModal, setPaymentModal] = useState({ open: false, appointment: null });

  // ── Filter appointments ────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...appointments];

    // Tab filter
    const tab = TABS.find((t) => t.id === activeTab);
    if (tab?.statuses) {
      result = result.filter((a) => tab.statuses.includes(a.status));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.lawyerName?.toLowerCase().includes(q) ||
          a.caseType?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.id?.toLowerCase().includes(q)
      );
    }

    // Sort: active first, then by date descending
    return result.sort((a, b) => {
      const priority = {
        [AppointmentStatus.APPROVED_AWAITING_PAYMENT]: 0,
        [AppointmentStatus.PENDING_APPROVAL]: 1,
        [AppointmentStatus.CONFIRMED]: 2,
      };
      const pa = priority[a.status] ?? 10;
      const pb = priority[b.status] ?? 10;
      if (pa !== pb) return pa - pb;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [appointments, activeTab, searchQuery]);

  // ── Tab counts ─────────────────────────────────────────────
  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach((tab) => {
      if (tab.statuses) {
        counts[tab.id] = appointments.filter((a) => tab.statuses.includes(a.status)).length;
      } else {
        counts[tab.id] = appointments.length;
      }
    });
    return counts;
  }, [appointments]);

  // ── Payment modal ──────────────────────────────────────────
  const handleOpenPayment = useCallback((appointment) => {
    const payment = payments.find(
      (p) => p.appointmentId === appointment.id && p.status === "PENDING"
    );
    if (payment) {
      setPaymentModal({ open: true, appointment, payment });
    }
  }, [payments]);

  const handleConfirmPayment = useCallback((paymentId) => {
    confirmPayment(paymentId);
  }, [confirmPayment]);

  // ── Loading state (simulated) ──────────────────────────────
  const [loading] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">My Appointments</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your consultation bookings and track their progress
          </p>
        </div>
        <Link
          to="/dashboard/client/find-lawyer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-gold-btn text-dark-950 text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
        >
          <CalendarDays className="w-4 h-4" />
          Book New
        </Link>
      </div>

      {/* ── Tabs & Search ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Tabs */}
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

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search appointments…"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-800/40 border border-white/[0.06] text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/20 transition-colors"
          />
        </div>
      </div>

      {/* ── Appointment List ────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <AppointmentSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-4">
            <CalendarDays className="w-7 h-7 text-neutral-600" />
          </div>
          <p className="text-neutral-400 font-medium">No appointments found</p>
          <p className="text-sm text-neutral-600 mt-1 max-w-xs">
            {searchQuery ? "Try adjusting your search terms" : "Book a consultation with a lawyer to get started"}
          </p>
          {!searchQuery && (
            <Link
              to="/dashboard/client/find-lawyer"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl gradient-gold-btn text-dark-950 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Find a Lawyer <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <AppointmentLifecycleCard
              key={apt.id}
              appointment={apt}
              onCancel={cancelAppointment}
              onOpenPayment={handleOpenPayment}
            />
          ))}
        </div>
      )}

      {/* ── Payment Modal ───────────────────────────────────── */}
      <PaymentModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, appointment: null })}
        payment={paymentModal.payment}
        appointment={paymentModal.appointment}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
}
