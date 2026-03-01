/**
 * ══════════════════════════════════════════════════════════════
 * FOLLOW-UP BOOKING MODAL — Book Consultation Within a Case
 * ══════════════════════════════════════════════════════════════
 *
 * Allows client to book a follow-up consultation linked to
 * an existing case, showing adjusted fees and payment breakdown.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Video,
  Building2,
  Phone,
  CreditCard,
  CheckCircle,
  Sparkles,
  Timer,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { useAuth } from "@context/AuthContext";
import { timeSlots } from "../data/mockClientData";

const CONSULTATION_TYPES = [
  { id: "video", label: "Video Call", icon: Video },
  { id: "in-office", label: "Office Visit", icon: Building2 },
  { id: "phone", label: "Phone Call", icon: Phone },
];

export default function FollowUpBookingModal({ isOpen, onClose, caseData }) {
  const { bookAppointment, config } = useAppStore();
  const { user } = useAuth();
  const [step, setStep] = useState(0); // 0 = form, 1 = confirm, 2 = success
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    consultationType: "video",
    description: "",
    selectedDate: "",
    selectedTime: "",
  });

  const followUpFee = useMemo(() => {
    // Follow-up consultations are typically discounted
    const baseFee = 5000;
    return Math.round(baseFee * 0.8); // 20% discount for follow-up
  }, []);

  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      if (d.getDay() !== 0) dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }, []);

  const canSubmit = form.consultationType && form.selectedDate && form.selectedTime;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    bookAppointment({
      clientId: user?.id || "USR-2026-0001",
      clientName: user?.fullName || "Ashan Bandara",
      lawyerId: caseData.lawyerId,
      lawyerName: caseData.lawyerName,
      lawyerSpecialization: caseData.caseType,
      consultationType: form.consultationType,
      caseType: caseData.caseType,
      description: form.description || `Follow-up consultation for case: ${caseData.title}`,
      urgency: "medium",
      selectedDate: form.selectedDate,
      selectedTime: form.selectedTime,
      consultationFee: followUpFee,
      linkedCaseId: caseData.id,
    });

    setIsSubmitting(false);
    setStep(2);
  };

  const handleClose = () => {
    setStep(0);
    setForm({ consultationType: "video", description: "", selectedDate: "", selectedTime: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div onClick={handleClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-dark-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

          {/* Close */}
          <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.06] z-10">
            <X className="w-4 h-4 text-neutral-500" />
          </button>

          <div className="p-6">
            {/* ── STEP 0: Form ── */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100 mb-1">Follow-Up Consultation</h3>
                  <p className="text-xs text-neutral-500">
                    Book another session for case: <span className="text-neutral-300">{caseData.title}</span>
                  </p>
                </div>

                {/* Lawyer info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-200">{caseData.lawyerName}</p>
                    <p className="text-xs text-neutral-500">{caseData.caseType}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-xs text-neutral-600">Follow-up fee</p>
                    <p className="text-sm font-bold text-gold-400">LKR {followUpFee.toLocaleString()}</p>
                  </div>
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-2">Type</label>
                  <div className="flex gap-2">
                    {CONSULTATION_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setForm((f) => ({ ...f, consultationType: t.id }))}
                        className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${
                          form.consultationType === t.id
                            ? "border-gold-500/40 bg-gold-500/10 text-gold-400"
                            : "border-white/[0.06] text-neutral-500 hover:border-white/[0.1]"
                        }`}
                      >
                        <t.icon className="w-3.5 h-3.5" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-2">Date</label>
                  <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto">
                    {availableDates.map((date) => {
                      const d = new Date(date);
                      const sel = form.selectedDate === date;
                      return (
                        <button
                          key={date}
                          onClick={() => setForm((f) => ({ ...f, selectedDate: date }))}
                          className={`flex flex-col items-center p-2 rounded-lg border text-center transition-all ${
                            sel ? "border-gold-500/40 bg-gold-500/10" : "border-white/[0.06] hover:border-white/[0.1]"
                          }`}
                        >
                          <span className={`text-[9px] uppercase ${sel ? "text-gold-400" : "text-neutral-600"}`}>
                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className={`text-sm font-bold ${sel ? "text-gold-400" : "text-neutral-400"}`}>
                            {d.getDate()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-2">Time</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {timeSlots.filter((s) => s.available).slice(0, 8).map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setForm((f) => ({ ...f, selectedTime: slot.time }))}
                        className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg border text-xs transition-all ${
                          form.selectedTime === slot.time
                            ? "border-gold-500/40 bg-gold-500/10 text-gold-400"
                            : "border-white/[0.06] text-neutral-500 hover:border-white/[0.1]"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-2">Notes (optional)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Any specific topics to discuss..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-dark-800/60 border border-white/[0.08] text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/30 resize-none"
                  />
                </div>

                {/* Payment breakdown */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-wider font-medium">Payment Breakdown</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Base consultation fee</span>
                    <span className="text-neutral-400 line-through">LKR 5,000</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Follow-up discount (20%)</span>
                    <span className="text-emerald-400">- LKR 1,000</span>
                  </div>
                  <div className="border-t border-white/[0.06] pt-2 flex justify-between text-xs">
                    <span className="text-neutral-300 font-medium">Total</span>
                    <span className="text-gold-400 font-bold">LKR {followUpFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/15">
                  <Timer className="w-3 h-3 text-amber-400 shrink-0" />
                  <p className="text-[10px] text-amber-300">
                    Payment deadline: {config.clientPaymentMinutes} minutes after approval
                  </p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!canSubmit}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  Review Booking
                </button>
              </div>
            )}

            {/* ── STEP 1: Confirm ── */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-neutral-100">Confirm Follow-Up</h3>
                <div className="space-y-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <Row label="Case" value={caseData.title} />
                  <Row label="Lawyer" value={caseData.lawyerName} />
                  <Row label="Type" value={CONSULTATION_TYPES.find((t) => t.id === form.consultationType)?.label} />
                  <Row label="Date" value={new Date(form.selectedDate).toLocaleDateString("en-LK", { weekday: "long", month: "long", day: "numeric" })} />
                  <Row label="Time" value={form.selectedTime} />
                  <div className="pt-2 border-t border-white/[0.06]">
                    <Row label="Fee" value={`LKR ${followUpFee.toLocaleString()}`} highlight />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="flex-1 px-4 py-2.5 rounded-xl text-sm text-neutral-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06]">
                    Back
                  </button>
                  <button onClick={handleConfirm} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white gradient-gold-btn disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Success ── */}
            {step === 2 && (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="w-16 h-16 rounded-2xl gradient-gold-btn flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-neutral-100 mb-1">Follow-Up Booked!</h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Waiting for {caseData.lawyerName} to approve ({config.lawyerApprovalHours}h window)
                </p>
                <button onClick={handleClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-white">
                  Done
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Row({ label, value, highlight = false }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-neutral-600">{label}</span>
      <span className={highlight ? "text-gold-400 font-bold" : "text-neutral-300"}>{value}</span>
    </div>
  );
}
