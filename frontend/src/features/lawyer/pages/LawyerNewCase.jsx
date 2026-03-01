/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS — Lawyer New Case Creation
 * ══════════════════════════════════════════════════════════════
 *
 * Create a new case from a completed consultation:
 *   • Select a completed appointment (or pre-selected via URL param)
 *   • Fill case details — title, description, estimated fees
 *   • Submit → startCase() in global store
 *   • Redirects to case detail on success
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Briefcase, Plus, User, Scale,
  DollarSign, FileText, CheckCircle, Calendar,
  Video, Building2, Phone, ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { MOCK_LAWYER_ID } from "../data/mockLawyerData";
import { AppointmentStatus } from "@utils/statusEnums";

const MODE_ICONS = { video: Video, "in-office": Building2, phone: Phone };

export default function LawyerNewCase() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { appointments, cases, startCase } = useAppStore();

  // ── Completed consultations without existing cases ─────────
  const caseAppointmentIds = useMemo(() => {
    return new Set(cases.filter((c) => c.appointmentId).map((c) => c.appointmentId));
  }, [cases]);

  const eligibleAppointments = useMemo(() => {
    return appointments.filter(
      (a) =>
        a.lawyerId === MOCK_LAWYER_ID &&
        a.status === AppointmentStatus.COMPLETED &&
        !caseAppointmentIds.has(a.id)
    );
  }, [appointments, caseAppointmentIds]);

  // ── Form State ─────────────────────────────────────────────
  const preselectedId = searchParams.get("appointmentId") || "";
  const [selectedAptId, setSelectedAptId] = useState(preselectedId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [caseType, setCaseType] = useState("");
  const [estimatedFees, setEstimatedFees] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ── Auto-fill from selected appointment ────────────────────
  const selectedApt = useMemo(() => {
    return appointments.find((a) => a.id === selectedAptId);
  }, [appointments, selectedAptId]);

  useEffect(() => {
    if (selectedApt) {
      if (!caseType) setCaseType(selectedApt.caseType || "");
      if (!description) setDescription(selectedApt.description || "");
    }
  }, [selectedAptId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAptId || !title.trim()) return;

    const newCase = startCase(selectedAptId, {
      title: title.trim(),
      description: description.trim(),
      caseType: caseType.trim(),
      estimatedFees: parseInt(estimatedFees, 10) || 0,
    });

    if (newCase) {
      setSubmitted(true);
      setTimeout(() => {
        navigate(`/dashboard/lawyer/cases/${newCase.id}`);
      }, 1200);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </motion.div>
        <h2 className="text-xl font-bold text-neutral-100">Case Created Successfully</h2>
        <p className="text-sm text-neutral-500 mt-2">Redirecting to case details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-[#C6A75E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C6A75E]/20 to-[#C6A75E]/5 border border-[#C6A75E]/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#C6A75E]" />
          </div>
          Create New Case
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
          Open a legal case from a completed consultation
        </p>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Select Consultation */}
        <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-5 space-y-3">
          <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C6A75E]" /> Select Completed Consultation
          </h3>
          {eligibleAppointments.length === 0 ? (
            <div className="rounded-lg bg-dark-900/60 border border-white/[0.04] p-4 text-center">
              <p className="text-sm text-neutral-400">No eligible consultations available</p>
              <p className="text-xs text-neutral-600 mt-1">Complete a consultation first to create a case</p>
            </div>
          ) : (
            <div className="space-y-2">
              {eligibleAppointments.map((apt) => {
                const ModeIcon = MODE_ICONS[apt.consultationType] || Phone;
                const selected = selectedAptId === apt.id;
                return (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => setSelectedAptId(apt.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      selected
                        ? "bg-[#C6A75E]/10 border-[#C6A75E]/25"
                        : "bg-dark-900/40 border-white/[0.04] hover:border-white/[0.08]"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selected ? "border-[#C6A75E] bg-[#C6A75E]" : "border-neutral-600"
                    }`}>
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-dark-950" />}
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-dark-800 border border-white/[0.06] flex items-center justify-center">
                      <User className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-200">{apt.clientName}</p>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
                        <span className="flex items-center gap-1"><Scale className="w-3 h-3" />{apt.caseType}</span>
                        <span className="flex items-center gap-1"><ModeIcon className="w-3 h-3" />{apt.selectedDate}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Case Details */}
        <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#C6A75E]" /> Case Details
          </h3>

          <div>
            <label className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Case Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Property Dispute — Land Partition in Galle"
              required
              className="mt-1 w-full rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-[#C6A75E]/30"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Case Type</label>
            <input
              type="text"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              placeholder="E.g., Property Law, Labour Law, Civil Law"
              className="mt-1 w-full rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-[#C6A75E]/30"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the case scope, objectives, and key details..."
              rows={4}
              className="mt-1 w-full rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-[#C6A75E]/30 resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Estimated Total Fees (LKR)</label>
            <input
              type="number"
              value={estimatedFees}
              onChange={(e) => setEstimatedFees(e.target.value)}
              placeholder="E.g., 50000"
              className="mt-1 w-full rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-[#C6A75E]/30"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl text-sm font-medium text-neutral-400 bg-dark-800 border border-white/[0.06] hover:text-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedAptId || !title.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all"
          >
            <Briefcase className="w-4 h-4" />
            Create Case
          </button>
        </div>
      </form>
    </div>
  );
}
