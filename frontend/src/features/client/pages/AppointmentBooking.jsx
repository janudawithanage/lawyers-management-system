/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS APPOINTMENT BOOKING — Full Lifecycle Booking Flow
 * ══════════════════════════════════════════════════════════════
 *
 * 4-step booking wizard connected to globalStore:
 *  Step 0: Consultation Details (type, case, urgency, description, files)
 *  Step 1: Select Date & Time
 *  Step 2: Confirmation Preview Modal → Persist via bookAppointment()
 *  Step 3: Success state with tracking info
 *
 * Connected to: useAppStore().bookAppointment
 */

import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Video,
  Building2,
  Phone,
  FileText,
  AlertTriangle,
  Upload,
  X,
  Check,
  CheckCircle,
  CreditCard,
  User,
  Scale,
  Timer,
  Sparkles,
  MapPin,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { useAppStore } from "@/store/globalStore";
import { lawyers, timeSlots } from "../data/mockClientData";
import Stepper from "../components/Stepper";

const STEPS = [
  { label: "Details", icon: FileText },
  { label: "Schedule", icon: Calendar },
  { label: "Review", icon: Check },
  { label: "Confirmed", icon: CheckCircle },
];

const CONSULTATION_TYPES = [
  { id: "video", label: "Video Call", icon: Video, description: "Meet via secure video conference", color: "blue" },
  { id: "in-office", label: "Office Visit", icon: Building2, description: "Visit the lawyer's office", color: "emerald" },
  { id: "phone", label: "Phone Call", icon: Phone, description: "Quick consultation by phone", color: "violet" },
];

const CASE_TYPES = [
  "Criminal Law", "Family Law", "Property Law", "Corporate Law",
  "Labour Law", "Tax Law", "Civil Litigation", "Immigration",
  "Intellectual Property", "Insurance Law", "Other",
];

const URGENCY_LEVELS = [
  { id: "low", label: "Low", description: "Within 2 weeks", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "medium", label: "Medium", description: "Within 1 week", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "high", label: "High", description: "Within 48 hours", color: "text-red-400 bg-red-500/10 border-red-500/20" },
];

export default function AppointmentBooking() {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookAppointment, config } = useAppStore();

  const lawyer = useMemo(() => lawyers.find((l) => l.lawyer_id === lawyerId), [lawyerId]);

  const [step, setStep] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  // ── Form State ──
  const [form, setForm] = useState({
    consultationType: "video",
    caseType: lawyer?.specialization || "",
    description: "",
    urgency: "medium",
    files: [],
    selectedDate: "",
    selectedTime: "",
  });

  const updateForm = useCallback((updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  // ── Derived ──
  const availableDates = useMemo(() => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      if (d.getDay() !== 0) {
        dates.push(d.toISOString().split("T")[0]);
      }
    }
    return dates;
  }, []);

  const canProceed = useMemo(() => {
    if (step === 0) return form.consultationType && form.caseType && form.description.trim().length >= 10;
    if (step === 1) return form.selectedDate && form.selectedTime;
    return true;
  }, [step, form]);

  // ── Handlers ──
  const handleNext = () => {
    if (step === 1) {
      setShowConfirmModal(true);
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    if (step === 0) {
      navigate(-1);
      return;
    }
    setStep((s) => s - 1);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200));

    const appointment = bookAppointment({
      clientId: user?.id || "USR-2026-0001",
      clientName: user?.fullName || "Ashan Bandara",
      lawyerId: lawyer.lawyer_id,
      lawyerName: lawyer.name,
      lawyerSpecialization: lawyer.specialization,
      lawyerAvatar: lawyer.avatar || lawyer.profile_picture,
      consultationType: form.consultationType,
      caseType: form.caseType,
      description: form.description,
      urgency: form.urgency,
      selectedDate: form.selectedDate,
      selectedTime: form.selectedTime,
      consultationFee: lawyer.consultationFee || 5000,
      attachments: form.files.map((f) => f.name),
    });

    setBookedAppointment(appointment);
    setShowConfirmModal(false);
    setIsSubmitting(false);
    setStep(3);
  };

  const handleFileAdd = (e) => {
    const newFiles = Array.from(e.target.files || []).slice(0, 3);
    updateForm({ files: [...form.files, ...newFiles].slice(0, 3) });
  };

  const handleFileRemove = (index) => {
    updateForm({ files: form.files.filter((_, i) => i !== index) });
  };

  // ── Lawyer not found ──
  if (!lawyer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <User className="w-12 h-12 text-neutral-600 mb-3" />
        <h2 className="text-lg font-semibold text-neutral-300 mb-1">Lawyer Not Found</h2>
        <p className="text-sm text-neutral-500 mb-4">The selected lawyer could not be located.</p>
        <button onClick={() => navigate("/dashboard/client/find-lawyer")} className="px-4 py-2 rounded-xl text-sm font-semibold gradient-gold-btn text-white">
          Browse Lawyers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button onClick={handleBack} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-gold-400 transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <h1 className="text-2xl font-bold text-neutral-100 mb-1">Book Consultation</h1>
        <p className="text-sm text-neutral-500">Schedule a consultation with {lawyer.name}</p>
      </motion.div>

      {/* Stepper */}
      <Stepper steps={STEPS} current={step} className="mb-8" />

      <AnimatePresence mode="wait">
        {/* ═══════════════════════════════════════════════════════
            STEP 0: CONSULTATION DETAILS
            ═══════════════════════════════════════════════════════ */}
        {step === 0 && (
          <motion.div key="step-0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
            {/* Lawyer Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <img src={lawyer.avatar} alt={lawyer.name} className="w-14 h-14 rounded-xl object-cover border border-white/[0.08]" />
              <div>
                <p className="text-sm font-semibold text-neutral-200">{lawyer.name}</p>
                <p className="text-xs text-neutral-500">{lawyer.specialization} • {lawyer.experience}</p>
                <p className="text-xs text-gold-400 font-semibold mt-0.5">LKR {(lawyer.consultationFee || 5000).toLocaleString()} / session</p>
              </div>
            </div>

            {/* Consultation Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">Consultation Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CONSULTATION_TYPES.map((type) => {
                  const selected = form.consultationType === type.id;
                  const colorMap = { blue: "border-blue-500/40 bg-blue-500/8", emerald: "border-emerald-500/40 bg-emerald-500/8", violet: "border-violet-500/40 bg-violet-500/8" };
                  return (
                    <button
                      key={type.id}
                      onClick={() => updateForm({ consultationType: type.id })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                        selected ? colorMap[type.color] : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
                      }`}
                    >
                      <type.icon className={`w-5 h-5 ${selected ? "text-gold-400" : "text-neutral-500"}`} />
                      <span className={`text-xs font-semibold ${selected ? "text-neutral-200" : "text-neutral-400"}`}>{type.label}</span>
                      <span className="text-[10px] text-neutral-600 text-center">{type.description}</span>
                    </button>
                  );
                })}
              </div>
              {form.consultationType === "in-office" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-300">{lawyer.officeAddress || "42 Galle Road, Colombo 03"}</span>
                </motion.div>
              )}
            </div>

            {/* Case Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Case Type</label>
              <select
                value={form.caseType}
                onChange={(e) => updateForm({ caseType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-800/60 border border-white/[0.08] text-sm text-neutral-200 focus:outline-none focus:border-gold-500/40 transition-colors"
              >
                <option value="">Select case type</option>
                {CASE_TYPES.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Case Description</label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Briefly describe your legal matter..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-dark-800/60 border border-white/[0.08] text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/40 transition-colors resize-none"
              />
              <p className="text-[10px] text-neutral-600 mt-1">{form.description.length}/500 characters • minimum 10</p>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">Urgency Level</label>
              <div className="flex gap-3">
                {URGENCY_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => updateForm({ urgency: level.id })}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                      form.urgency === level.id ? level.color : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    <span className={`text-xs font-semibold ${form.urgency === level.id ? "" : "text-neutral-400"}`}>{level.label}</span>
                    <span className="text-[10px] text-neutral-600">{level.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload (Optional) */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Attachments (optional)</label>
              <div className="border border-dashed border-white/[0.1] rounded-xl p-4 text-center">
                <Upload className="w-5 h-5 text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 mb-2">Drag & drop or click to upload (max 3 files, 10MB each)</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-400 cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <Upload className="w-3 h-3" /> Choose Files
                  <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleFileAdd} className="hidden" />
                </label>
              </div>
              {form.files.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {form.files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <FileText className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-xs text-neutral-400 flex-1 truncate">{f.name}</span>
                      <button onClick={() => handleFileRemove(i)} className="p-0.5 hover:bg-white/[0.06] rounded">
                        <X className="w-3 h-3 text-neutral-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STEP 1: SELECT DATE & TIME
            ═══════════════════════════════════════════════════════ */}
        {step === 1 && (
          <motion.div key="step-1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">Select Date</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {availableDates.map((date) => {
                  const d = new Date(date);
                  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                  const dayNum = d.getDate();
                  const month = d.toLocaleDateString("en-US", { month: "short" });
                  const selected = form.selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => updateForm({ selectedDate: date })}
                      className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                        selected
                          ? "border-gold-500/40 bg-gold-500/10 text-gold-400"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] text-neutral-400"
                      }`}
                    >
                      <span className="text-[10px] font-medium uppercase">{dayName}</span>
                      <span className="text-lg font-bold">{dayNum}</span>
                      <span className="text-[10px]">{month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">Select Time Slot</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot, idx) => {
                  const selected = form.selectedTime === slot.time;
                  return (
                    <button
                      key={idx}
                      onClick={() => updateForm({ selectedTime: slot.time })}
                      disabled={!slot.available}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                        selected
                          ? "border-gold-500/40 bg-gold-500/10 text-gold-400 font-semibold"
                          : slot.available
                            ? "border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:border-white/[0.1]"
                            : "border-white/[0.04] bg-white/[0.01] text-neutral-700 cursor-not-allowed"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STEP 3: SUCCESS
            ═══════════════════════════════════════════════════════ */}
        {step === 3 && (
          <motion.div key="step-3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, bounce: 0.4 }}
              className="flex items-center justify-center w-20 h-20 rounded-2xl gradient-gold-btn mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-neutral-100 mb-2">Booking Submitted!</h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
              Your consultation request has been sent to <strong className="text-neutral-200">{lawyer.name}</strong>.
              They have <strong className="text-gold-400">{config.lawyerApprovalHours} hours</strong> to respond.
            </p>

            {/* Appointment Summary Card */}
            <div className="max-w-sm mx-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Reference</span>
                <span className="text-xs font-mono text-gold-400">{bookedAppointment?.id?.slice(-8) || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Date & Time</span>
                <span className="text-xs text-neutral-300">{form.selectedDate} at {form.selectedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Type</span>
                <span className="text-xs text-neutral-300 capitalize">{form.consultationType.replace("-", " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">Fee</span>
                <span className="text-xs text-gold-400 font-semibold">LKR {(lawyer.consultationFee || 5000).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-amber-400">Awaiting lawyer approval ({config.lawyerApprovalHours}h window)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate("/dashboard/client/appointments")}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-white hover:opacity-90 transition-opacity"
              >
                Track Appointment
              </button>
              <button
                onClick={() => navigate("/dashboard/client/find-lawyer")}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-neutral-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
              >
                Browse More Lawyers
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
          NAVIGATION BUTTONS (Steps 0–1)
          ═══════════════════════════════════════════════════════ */}
      {step < 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
          <button onClick={handleBack} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-200 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 1 ? "Review & Confirm" : "Next"} <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════
          CONFIRMATION PREVIEW MODAL
          ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div onClick={() => setShowConfirmModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-dark-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">Confirm Booking</h3>
                    <p className="text-xs text-neutral-500">Please review your consultation details</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <SummaryRow label="Lawyer" value={lawyer.name} />
                  <SummaryRow label="Specialization" value={lawyer.specialization} />
                  <SummaryRow label="Type" value={CONSULTATION_TYPES.find((t) => t.id === form.consultationType)?.label} />
                  <SummaryRow label="Case Type" value={form.caseType} />
                  <SummaryRow label="Urgency" value={form.urgency.charAt(0).toUpperCase() + form.urgency.slice(1)} />
                  <SummaryRow label="Date" value={new Date(form.selectedDate).toLocaleDateString("en-LK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
                  <SummaryRow label="Time" value={form.selectedTime} />
                  <div className="pt-3 border-t border-white/[0.06]">
                    <SummaryRow label="Consultation Fee" value={`LKR ${(lawyer.consultationFee || 5000).toLocaleString()}`} highlight />
                  </div>
                </div>

                {form.description && (
                  <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[10px] text-neutral-600 uppercase mb-1">Description</p>
                    <p className="text-xs text-neutral-400 line-clamp-3">{form.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg bg-amber-500/8 border border-amber-500/15">
                  <Timer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <p className="text-[11px] text-amber-300">
                    The lawyer has {config.lawyerApprovalHours}h to approve. Once approved, you'll have {config.clientPaymentMinutes} minutes to pay.
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white gradient-gold-btn hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Helper: Summary Row ──

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-600">{label}</span>
      <span className={`text-xs font-medium ${highlight ? "text-gold-400 font-semibold" : "text-neutral-300"}`}>{value}</span>
    </div>
  );
}
