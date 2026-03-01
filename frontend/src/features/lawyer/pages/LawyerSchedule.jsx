/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER SCHEDULE — Availability & Calendar Management
 * ══════════════════════════════════════════════════════════════
 *
 *  • Weekly availability grid (configurable time slots)
 *  • Quick toggle days on/off
 *  • Upcoming appointments preview
 *  • Mock save functionality
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";

const MOCK_LAWYER_ID = "LWR-003";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DEFAULT_SLOTS = {
  Monday:    { enabled: true,  start: "09:00", end: "17:00" },
  Tuesday:   { enabled: true,  start: "09:00", end: "17:00" },
  Wednesday: { enabled: true,  start: "09:00", end: "17:00" },
  Thursday:  { enabled: true,  start: "09:00", end: "17:00" },
  Friday:    { enabled: true,  start: "09:00", end: "15:00" },
  Saturday:  { enabled: false, start: "10:00", end: "13:00" },
  Sunday:    { enabled: false, start: "10:00", end: "13:00" },
};

export default function LawyerSchedule() {
  const { appointments } = useAppStore();
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [saved, setSaved] = useState(false);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => a.lawyerId === MOCK_LAWYER_ID && ["confirmed", "pending"].includes(a.status) && new Date(a.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  }, [appointments]);

  const activeDays = Object.values(slots).filter((s) => s.enabled).length;
  const totalHours = Object.values(slots).reduce((sum, s) => {
    if (!s.enabled) return sum;
    const [sh, sm] = s.start.split(":").map(Number);
    const [eh, em] = s.end.split(":").map(Number);
    return sum + (eh + em / 60) - (sh + sm / 60);
  }, 0);

  const toggleDay = (day) => {
    setSlots((p) => ({ ...p, [day]: { ...p[day], enabled: !p[day].enabled } }));
    setSaved(false);
  };

  const updateTime = (day, field, value) => {
    setSlots((p) => ({ ...p, [day]: { ...p[day], [field]: value } }));
    setSaved(false);
  };

  const handleSave = () => setSaved(true);
  const handleReset = () => { setSlots(DEFAULT_SLOTS); setSaved(false); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#C6A75E]" />
            <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Practice</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Schedule</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your weekly availability</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-400 border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all">
            <Save className="w-4 h-4" /> Save Schedule
          </button>
        </div>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4" /> Schedule saved successfully
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Days", value: activeDays, icon: Calendar, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
          { label: "Weekly Hours", value: `${totalHours.toFixed(1)}h`, icon: Clock, color: "text-blue-400 bg-blue-500/10" },
          { label: "Upcoming Appts", value: upcomingAppointments.length, icon: Users, color: "text-emerald-400 bg-emerald-500/10" },
          { label: "Off Days", value: 7 - activeDays, icon: AlertCircle, color: "text-neutral-400 bg-neutral-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <p className="text-xl font-bold text-neutral-100">{s.value}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Grid */}
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-lg font-semibold text-neutral-200 mb-3">Weekly Availability</h2>
          {DAYS.map((day, i) => {
            const slot = slots[day];
            return (
              <motion.div key={day} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${slot.enabled ? "bg-dark-800/40 border-white/[0.06]" : "bg-dark-900/40 border-white/[0.03] opacity-60"}`}>
                {/* Toggle */}
                <button onClick={() => toggleDay(day)}
                  className={`w-10 h-6 rounded-full flex items-center transition-colors ${slot.enabled ? "bg-[#C6A75E]" : "bg-neutral-700"}`}>
                  <motion.div animate={{ x: slot.enabled ? 18 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
                {/* Day Name */}
                <span className={`w-24 text-sm font-medium ${slot.enabled ? "text-neutral-200" : "text-neutral-500"}`}>
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{SHORT[i]}</span>
                </span>
                {/* Time Pickers */}
                {slot.enabled ? (
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <input type="time" value={slot.start} onChange={(e) => updateTime(day, "start", e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-sm text-neutral-200 bg-dark-700/60 border border-white/[0.06] focus:outline-none focus:border-[#C6A75E]/30" />
                    <span className="text-neutral-600 text-xs">to</span>
                    <input type="time" value={slot.end} onChange={(e) => updateTime(day, "end", e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-sm text-neutral-200 bg-dark-700/60 border border-white/[0.06] focus:outline-none focus:border-[#C6A75E]/30" />
                  </div>
                ) : (
                  <span className="text-xs text-neutral-600 ml-auto">Unavailable</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Upcoming Sidebar */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-200 mb-3">Upcoming Appointments</h2>
          <div className="space-y-2">
            {upcomingAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-dark-800/40 border border-white/[0.06] text-center">
                <Calendar className="w-8 h-8 text-neutral-600 mb-2" />
                <p className="text-sm text-neutral-400">No upcoming appointments</p>
              </div>
            ) : (
              upcomingAppointments.map((appt) => (
                <div key={appt.id} className="p-3 rounded-xl bg-dark-800/40 border border-white/[0.06]">
                  <p className="text-sm font-medium text-neutral-200 truncate">{appt.clientName || "Client"}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {new Date(appt.date).toLocaleDateString("en-LK", { month: "short", day: "numeric" })} • {appt.time} • <span className={`capitalize ${appt.status === "confirmed" ? "text-emerald-400" : "text-amber-400"}`}>{appt.status}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
