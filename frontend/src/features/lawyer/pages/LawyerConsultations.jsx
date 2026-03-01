/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS — Lawyer Consultations Management
 * ══════════════════════════════════════════════════════════════
 *
 * Manages CONFIRMED and COMPLETED consultations:
 *   • Upcoming consultations — view details, mark complete
 *   • Completed consultations — start a case from them
 *   • Timeline/schedule-style layout
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Building2, Phone, CalendarDays, Clock,
  CheckCircle, ArrowRight, User, Briefcase,
  PlayCircle, MessageSquare, FileText, Plus,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { MOCK_LAWYER_ID } from "../data/mockLawyerData";
import { AppointmentStatus } from "@utils/statusEnums";
import StatusBadge from "@components/common/StatusBadge";

const MODE_ICONS = { video: Video, "in-office": Building2, phone: Phone };
const MODE_LABELS = { video: "Video Call", "in-office": "In-Office Visit", phone: "Phone Call" };

const TABS = [
  { id: "upcoming", label: "Upcoming", status: AppointmentStatus.CONFIRMED },
  { id: "completed", label: "Completed", status: AppointmentStatus.COMPLETED },
];

export default function LawyerConsultations() {
  const { appointments, cases, completeConsultation } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");

  // ── Filter confirmed/completed for this lawyer ─────────────
  const upcoming = useMemo(() => {
    return appointments
      .filter((a) => a.lawyerId === MOCK_LAWYER_ID && a.status === AppointmentStatus.CONFIRMED)
      .sort((a, b) => new Date(a.selectedDate) - new Date(b.selectedDate));
  }, [appointments]);

  const completed = useMemo(() => {
    return appointments
      .filter((a) => a.lawyerId === MOCK_LAWYER_ID && a.status === AppointmentStatus.COMPLETED)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  }, [appointments]);

  // ── Check which completed appointments already have cases ──
  const caseAppointmentIds = useMemo(() => {
    return new Set(cases.filter((c) => c.appointmentId).map((c) => c.appointmentId));
  }, [cases]);

  const list = activeTab === "upcoming" ? upcoming : completed;

  const handleComplete = (id) => completeConsultation(id);

  const handleStartCase = (aptId) => {
    navigate(`/dashboard/lawyer/cases/new?appointmentId=${aptId}`);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">
          Consultations
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage upcoming and completed client consultations
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatTile
          label="Upcoming"
          value={upcoming.length}
          icon={CalendarDays}
          color="text-blue-400"
          bg="bg-blue-500/10"
        />
        <StatTile
          label="Completed"
          value={completed.length}
          icon={CheckCircle}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <StatTile
          label="Ready for Case"
          value={completed.filter((a) => !caseAppointmentIds.has(a.id)).length}
          icon={Briefcase}
          color="text-[#C6A75E]"
          bg="bg-[#C6A75E]/10"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1">
        {TABS.map((tab) => {
          const count = tab.id === "upcoming" ? upcoming.length : completed.length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#C6A75E]/15 text-[#C6A75E] border border-[#C6A75E]/25"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-dark-800/40 border border-transparent"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.id ? "bg-[#C6A75E]/20 text-[#C6A75E]" : "bg-neutral-700/50 text-neutral-400"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Cards ── */}
      <AnimatePresence mode="popLayout">
        {list.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]"
          >
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-4">
              <CalendarDays className="w-7 h-7 text-neutral-600" />
            </div>
            <p className="text-neutral-400 font-medium">
              {activeTab === "upcoming" ? "No upcoming consultations" : "No completed consultations yet"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {list.map((apt, idx) => (
              <ConsultationCard
                key={apt.id}
                apt={apt}
                index={idx}
                isUpcoming={activeTab === "upcoming"}
                hasCase={caseAppointmentIds.has(apt.id)}
                onComplete={handleComplete}
                onStartCase={handleStartCase}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Consultation Card ────────────────────────────────────────

function ConsultationCard({ apt, index, isUpcoming, hasCase, onComplete, onStartCase }) {
  const ModeIcon = MODE_ICONS[apt.consultationType] || Phone;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-2xl bg-dark-800/40 border border-white/[0.06] hover:border-white/[0.10] p-5 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C6A75E]/20 to-[#C6A75E]/5 border border-[#C6A75E]/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-[#C6A75E]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-neutral-100">{apt.clientName}</h3>
            <StatusBadge status={apt.status} type="appointment" size="xs" />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{apt.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {apt.caseType}
            </span>
            <span className="flex items-center gap-1">
              <ModeIcon className="w-3 h-3" />
              {MODE_LABELS[apt.consultationType]}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {apt.selectedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {apt.selectedTime}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isUpcoming && (
            <button
              onClick={() => onComplete(apt.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark Complete
            </button>
          )}
          {!isUpcoming && !hasCase && (
            <button
              onClick={() => onStartCase(apt.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Start Case
            </button>
          )}
          {!isUpcoming && hasCase && (
            <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Briefcase className="w-3 h-3" />
              Case Created
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Stat Tile ────────────────────────────────────────────────

function StatTile({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-4">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`w-4.5 h-4.5 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-neutral-100">{value}</p>
          <p className="text-[11px] text-neutral-500 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}
