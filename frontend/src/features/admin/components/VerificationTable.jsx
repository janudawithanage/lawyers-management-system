/**
 * ══════════════════════════════════════════════════════════════
 * VERIFICATION TABLE — Lawyer Verification Queue
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise table for the admin dashboard's verification
 * section. Displays lawyers pending BASL verification with
 * approve / reject actions.
 *
 * Props:
 *   lawyers — Array of verification queue entries from mockAdminData
 *
 * Features:
 *  • Desktop table + mobile card layout
 *  • Status badges (pending, verified, rejected)
 *  • Action buttons with confirmation
 *  • Document list
 *  • Framer Motion row animations
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldX,
  Clock,
  User,
  FileText,
  Mail,
  MapPin,
  Scale,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  ChevronRight,
} from "lucide-react";
import { formatRelativeTime } from "../data/mockAdminData";

// ── Status config ────────────────────────────────────────────

const STATUS_CFG = {
  pending: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400 animate-pulse",
  },
  verified: {
    label: "Verified",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
};

function VerifStatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Detail Drawer ────────────────────────────────────────────

function DetailDrawer({ lawyer, onClose, onApprove, onReject }) {
  if (!lawyer) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex justify-end"
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-dark-900 border-l border-white/[0.08] shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-dark-900/95 backdrop-blur-sm border-b border-white/[0.06]">
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">
                Verification Details
              </h3>
              <p className="text-xs text-neutral-500 font-mono">{lawyer.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-700/60 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-100">
                  {lawyer.name}
                </h4>
                <p className="text-xs text-neutral-500">{lawyer.specialization}</p>
                <VerifStatusBadge status={lawyer.verificationStatus} />
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Scale, label: "Bar Registration", value: lawyer.barRegistrationNumber },
                { icon: MapPin, label: "District", value: lawyer.district },
                { icon: Mail, label: "Email", value: lawyer.email },
                { icon: Clock, label: "Submitted", value: formatRelativeTime(lawyer.submittedAt) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/[0.04]"
                >
                  <item.icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-neutral-600 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm text-neutral-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div>
              <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Submitted Documents
              </h5>
              <div className="space-y-1.5">
                {(lawyer.documents || []).map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-dark-800/40 border border-white/[0.04]"
                  >
                    <FileText className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-sm text-neutral-300">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Reason */}
            {lawyer.rejectionReason && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs font-semibold text-red-400">
                    Rejection Reason
                  </p>
                </div>
                <p className="text-sm text-neutral-300">
                  {lawyer.rejectionReason}
                </p>
              </div>
            )}

            {/* Actions */}
            {lawyer.verificationStatus === "pending" && (
              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => onApprove(lawyer.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-dark-950 hover:opacity-90 transition-opacity shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => onReject(lawyer.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function VerificationTable({ lawyers }) {
  const [queue, setQueue] = useState(lawyers);
  const [selected, setSelected] = useState(null);

  const handleApprove = (id) => {
    setQueue((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, verificationStatus: "verified" } : l
      )
    );
    setSelected(null);
  };

  const handleReject = (id) => {
    setQueue((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, verificationStatus: "rejected", rejectionReason: "Rejected by admin" }
          : l
      )
    );
    setSelected(null);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-2xl bg-dark-800/30 border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Lawyer", "Registration", "District", "Specialization", "Status", "Submitted", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className="py-3 px-4 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {queue.map((lawyer, i) => (
                <motion.tr
                  key={lawyer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="group border-b border-white/[0.04] last:border-0 hover:bg-dark-700/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-gold-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-200">
                          {lawyer.name}
                        </p>
                        <p className="text-[10px] text-neutral-500">
                          {lawyer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-neutral-400">
                    {lawyer.barRegistrationNumber}
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-400">
                    {lawyer.district}
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-300">
                    {lawyer.specialization}
                  </td>
                  <td className="py-3 px-4">
                    <VerifStatusBadge status={lawyer.verificationStatus} />
                  </td>
                  <td className="py-3 px-4 text-xs text-neutral-500">
                    {formatRelativeTime(lawyer.submittedAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelected(lawyer)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {lawyer.verificationStatus === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(lawyer.id)}
                            className="p-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReject(lawyer.id)}
                            className="p-1.5 rounded-lg text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {queue.map((lawyer, i) => (
          <motion.div
            key={lawyer.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-200">
                    {lawyer.name}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {lawyer.specialization} • {lawyer.district}
                  </p>
                </div>
              </div>
              <VerifStatusBadge status={lawyer.verificationStatus} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
              <span className="text-[10px] font-mono text-neutral-600">
                {lawyer.barRegistrationNumber}
              </span>
              <div className="flex items-center gap-1.5">
                {lawyer.verificationStatus === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(lawyer.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(lawyer.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelected(lawyer)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-gold-400 hover:bg-gold-500/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <DetailDrawer
          lawyer={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
}
