/**
 * ══════════════════════════════════════════════════════════════
 * APPOINTMENT PIPELINE — Visual Step-by-Step Status Tracker
 * ══════════════════════════════════════════════════════════════
 *
 * Shows the appointment lifecycle as a horizontal pipeline:
 * Request → Approved → Paid → Confirmed → Completed
 */

import { motion } from "framer-motion";
import {
  Send,
  CheckCircle,
  CreditCard,
  CalendarCheck,
  Star,
  XCircle,
  Clock,
} from "lucide-react";

const PIPELINE_STEPS = [
  { key: "requested", label: "Requested", icon: Send },
  { key: "approved", label: "Approved", icon: CheckCircle },
  { key: "paid", label: "Paid", icon: CreditCard },
  { key: "confirmed", label: "Confirmed", icon: CalendarCheck },
  { key: "completed", label: "Completed", icon: Star },
];

const STATUS_TO_STEP = {
  PENDING_LAWYER_APPROVAL: 0,
  APPROVED_AWAITING_PAYMENT: 1,
  PAYMENT_EXPIRED: 1,
  CONFIRMED: 3,
  CANCELLED_BY_CLIENT: -1,
  DECLINED_BY_LAWYER: -1,
  COMPLETED: 4,
  EXPIRED: -1,
};

export default function AppointmentPipeline({ status, className = "" }) {
  const currentStep = STATUS_TO_STEP[status] ?? -1;
  const isFailed = currentStep === -1;

  const failedLabel =
    status === "CANCELLED_BY_CLIENT"
      ? "Cancelled"
      : status === "DECLINED_BY_LAWYER"
        ? "Declined"
        : status === "PAYMENT_EXPIRED"
          ? "Payment Expired"
          : status === "EXPIRED"
            ? "Expired"
            : "Failed";

  return (
    <div className={`w-full ${className}`}>
      {/* Pipeline Steps */}
      <div className="flex items-center justify-between relative">
        {PIPELINE_STEPS.map((step, index) => {
          const isActive = !isFailed && index <= currentStep;
          const isCurrent = !isFailed && index === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              {/* Connector line (before each step except first) */}
              {index > 0 && (
                <div className="absolute top-5 right-1/2 left-[-50%] h-px">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isActive
                        ? "bg-gradient-to-r from-gold-500/60 to-gold-400/80"
                        : "bg-neutral-800"
                    }`}
                  />
                </div>
              )}

              {/* Step circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  borderColor: isActive
                    ? "rgba(212, 168, 74, 0.5)"
                    : "rgba(64, 64, 64, 0.3)",
                }}
                className={`relative flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all duration-500 ${
                  isActive
                    ? "bg-gold-500/10 border-gold-500/50"
                    : "bg-neutral-900/60 border-neutral-700/30"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors duration-500 ${
                    isActive ? "text-gold-400" : "text-neutral-600"
                  }`}
                />
                {isCurrent && (
                  <motion.div
                    layoutId="pipeline-active"
                    className="absolute -inset-1 rounded-xl border border-gold-400/30"
                    initial={false}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`mt-2 text-[10px] font-medium tracking-wide uppercase transition-colors duration-500 ${
                  isActive ? "text-gold-400" : "text-neutral-600"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Failed state overlay */}
      {isFailed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-red-500/8 border border-red-500/15"
        >
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-red-400">{failedLabel}</span>
        </motion.div>
      )}
    </div>
  );
}
