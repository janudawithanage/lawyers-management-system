/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS — Lawyer Appointments Management
 * ══════════════════════════════════════════════════════════════
 *
 * Full appointment lifecycle page for the lawyer role.
 * Features:
 *   • Tab-based status filtering (All / Pending / Approved / Confirmed / Completed / History)
 *   • Approve / Decline actions with real global store integration
 *   • Countdown timers for pending approval deadlines
 *   • Decline reason modal
 *   • Premium dark luxury theme
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Clock, CheckCircle, XCircle, User,
  Video, Building2, Phone, AlertTriangle, Shield,
  ChevronDown, ChevronUp, MessageSquare, Briefcase,
  Timer, CreditCard, Search, Filter,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { MOCK_LAWYER_ID } from "../data/mockLawyerData";
import { AppointmentStatus, APPOINTMENT_STATUS_CONFIG } from "@utils/statusEnums";
import CountdownTimer from "@components/common/CountdownTimer";
import StatusBadge from "@components/common/StatusBadge";

// ── Tab Config ───────────────────────────────────────────────

const TABS = [
  { id: "pending", label: "Pending Requests", statuses: [AppointmentStatus.PENDING_APPROVAL] },
  { id: "approved", label: "Awaiting Payment", statuses: [AppointmentStatus.APPROVED_AWAITING_PAYMENT] },
  { id: "confirmed", label: "Confirmed", statuses: [AppointmentStatus.CONFIRMED] },
  { id: "completed", label: "Completed", statuses: [AppointmentStatus.COMPLETED] },
  { id: "history", label: "History", statuses: [AppointmentStatus.DECLINED, AppointmentStatus.CANCELLED, AppointmentStatus.EXPIRED, AppointmentStatus.PAYMENT_EXPIRED] },
  { id: "all", label: "All", statuses: null },
];

const MODE_ICONS = { video: Video, "in-office": Building2, phone: Phone };
const MODE_LABELS = { video: "Video Call", "in-office": "In-Office Visit", phone: "Phone Call" };
const URGENCY_STYLES = {
  urgent: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", label: "Urgent" },
  high: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "High Priority" },
  medium: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Medium" },
  low: { bg: "bg-neutral-500/10", text: "text-neutral-400", border: "border-neutral-500/20", label: "Normal" },
  normal: { bg: "bg-neutral-500/10", text: "text-neutral-400", border: "border-neutral-500/20", label: "Normal" },
};

// ══════════════════════════════════════════════════════════════

export default function LawyerAppointments() {
  const { appointments, approveAppointment, declineAppointment, completeConsultation } = useAppStore();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [declineModal, setDeclineModal] = useState({ open: false, appointmentId: null });
  const [declineReason, setDeclineReason] = useState("");

  // ── Filter appointments for this lawyer ────────────────────
  const myAppointments = useMemo(() => {
    return appointments.filter((a) => a.lawyerId === MOCK_LAWYER_ID);
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const tab = TABS.find((t) => t.id === activeTab);
    let filtered = myAppointments;
    if (tab?.statuses) {
      filtered = filtered.filter((a) => tab.statuses.includes(a.status));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.clientName?.toLowerCase().includes(q) ||
          a.caseType?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [myAppointments, activeTab, searchQuery]);

  // ── Tab badge counts ───────────────────────────────────────
  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach((tab) => {
      if (tab.statuses) {
        counts[tab.id] = myAppointments.filter((a) => tab.statuses.includes(a.status)).length;
      } else {
        counts[tab.id] = myAppointments.length;
      }
    });
    return counts;
  }, [myAppointments]);

  // ── Actions ────────────────────────────────────────────────
  const handleApprove = (id) => approveAppointment(id);

  const handleDeclineOpen = (id) => {
    setDeclineModal({ open: true, appointmentId: id });
    setDeclineReason("");
  };

  const handleDeclineConfirm = () => {
    if (declineModal.appointmentId) {
      declineAppointment(declineModal.appointmentId, declineReason || "No reason provided");
    }
    setDeclineModal({ open: false, appointmentId: null });
    setDeclineReason("");
  };

  const handleComplete = (id) => completeConsultation(id);

  // ══════════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
            Appointment Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review, approve, and manage client consultation requests
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-800/60 border border-white/[0.06]">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by client, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 outline-none w-48"
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#C6A75E]/15 text-[#C6A75E] border border-[#C6A75E]/25"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-dark-800/40 border border-transparent"
            }`}
          >
            {tab.label}
            {tabCounts[tab.id] > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id
                  ? "bg-[#C6A75E]/20 text-[#C6A75E]"
                  : "bg-neutral-700/50 text-neutral-400"
              }`}>
                {tabCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Appointment Cards ── */}
      <AnimatePresence mode="popLayout">
        {filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]"
          >
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-4">
              <CalendarDays className="w-7 h-7 text-neutral-600" />
            </div>
            <p className="text-neutral-400 font-medium">No appointments found</p>
            <p className="text-sm text-neutral-600 mt-1">
              {activeTab === "pending" ? "No pending requests at this time" : "Try adjusting your filters"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((apt, idx) => (
              <AppointmentCard
                key={apt.id}
                apt={apt}
                index={idx}
                expanded={expandedId === apt.id}
                onToggle={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
                onApprove={handleApprove}
                onDecline={handleDeclineOpen}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── Decline Reason Modal ── */}
      <AnimatePresence>
        {declineModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setDeclineModal({ open: false, appointmentId: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-dark-900 border border-white/[0.08] p-6 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-100">Decline Appointment</h3>
                  <p className="text-xs text-neutral-500">Provide a reason for the client</p>
                </div>
              </div>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="E.g., Scheduling conflict, outside area of specialization..."
                rows={4}
                className="w-full rounded-xl bg-dark-800 border border-white/[0.06] px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-[#C6A75E]/30 resize-none"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeclineModal({ open: false, appointmentId: null })}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-200 bg-dark-800 border border-white/[0.06] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeclineConfirm}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition-colors"
                >
                  Confirm Decline
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Individual Appointment Card ──────────────────────────────

function AppointmentCard({ apt, index, expanded, onToggle, onApprove, onDecline, onComplete }) {
  const ModeIcon = MODE_ICONS[apt.consultationType] || Phone;
  const urgency = URGENCY_STYLES[apt.urgency] || URGENCY_STYLES.normal;
  const isPending = apt.status === AppointmentStatus.PENDING_APPROVAL;
  const isConfirmed = apt.status === AppointmentStatus.CONFIRMED;
  const isApproved = apt.status === AppointmentStatus.APPROVED_AWAITING_PAYMENT;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isPending
          ? "bg-dark-800/60 border-[#C6A75E]/15 hover:border-[#C6A75E]/30"
          : "bg-dark-800/40 border-white/[0.06] hover:border-white/[0.10]"
      }`}
    >
      {/* ── Main Row ── */}
      <div
        className="flex items-center gap-4 p-4 sm:p-5 cursor-pointer"
        onClick={onToggle}
      >
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C6A75E]/20 to-[#C6A75E]/5 border border-[#C6A75E]/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-[#C6A75E]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-neutral-100 truncate">
              {apt.clientName}
            </h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${urgency.bg} ${urgency.text} border ${urgency.border}`}>
              {urgency.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {apt.caseType}
            </span>
            <span className="flex items-center gap-1">
              <ModeIcon className="w-3 h-3" />
              {MODE_LABELS[apt.consultationType] || apt.consultationType}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {apt.selectedDate} • {apt.selectedTime}
            </span>
          </div>
        </div>

        {/* Status + Timer */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isPending && apt.approvalDeadline && (
            <CountdownTimer
              deadline={apt.approvalDeadline}
              totalDuration={apt.approvalDuration}
              variant="inline"
              showLabel={false}
            />
          )}
          {isApproved && apt.paymentDeadline && (
            <div className="flex items-center gap-1 text-blue-400">
              <CreditCard className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Awaiting Payment</span>
            </div>
          )}
          <StatusBadge status={apt.status} type="appointment" size="sm" />
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </div>
      </div>

      {/* ── Expanded Detail ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-white/[0.04]">
              <div className="pt-4 space-y-4">
                {/* Description */}
                <div>
                  <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wide mb-1">Client Description</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">{apt.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <DetailTile label="Fee" value={`LKR ${(apt.consultationFee || 0).toLocaleString()}`} icon={CreditCard} />
                  <DetailTile label="Mode" value={MODE_LABELS[apt.consultationType] || apt.consultationType} icon={ModeIcon} />
                  <DetailTile label="Date" value={apt.selectedDate} icon={CalendarDays} />
                  <DetailTile label="Time" value={apt.selectedTime} icon={Clock} />
                </div>

                {/* Countdown Card (for pending) */}
                {isPending && apt.approvalDeadline && (
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-medium text-amber-400">Approval Deadline</span>
                      </div>
                      <CountdownTimer
                        deadline={apt.approvalDeadline}
                        totalDuration={apt.approvalDuration}
                        variant="inline"
                        showLabel={false}
                      />
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-2">
                      If you don't respond, the appointment will expire automatically.
                    </p>
                  </div>
                )}

                {/* Decline Reason */}
                {apt.declineReason && (
                  <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-4">
                    <p className="text-[11px] font-medium text-red-400 uppercase tracking-wide mb-1">Decline Reason</p>
                    <p className="text-sm text-neutral-300">{apt.declineReason}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {isPending && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); onApprove(apt.id); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve Request
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDecline(apt.id); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </button>
                    </>
                  )}
                  {isConfirmed && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onComplete(apt.id); }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Detail Tile ──────────────────────────────────────────────

function DetailTile({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl bg-dark-900/60 border border-white/[0.04] p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-neutral-600" />
        <span className="text-[10px] font-medium text-neutral-600 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-semibold text-neutral-200">{value}</p>
    </div>
  );
}
