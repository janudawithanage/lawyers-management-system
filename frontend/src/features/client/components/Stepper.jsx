/**
 * ══════════════════════════════════════════════════════════════
 * STEPPER — Multi-step Progress Indicator
 * ══════════════════════════════════════════════════════════════
 *
 * Premium stepper component for multi-step flows:
 *  • Step dots with active/completed/pending states
 *  • Animated connecting lines
 *  • Step labels with responsive layout
 *  • Gold accent for active state
 *  • Emerald for completed steps
 *  • Smooth transition animations
 */

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Stepper({ steps, currentStep, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={index} className="flex items-center">
            {/* Step Indicator */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "rgb(16, 185, 129)"
                    : isActive
                    ? "rgb(198, 167, 94)"
                    : "rgb(32, 32, 36)",
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? "border-emerald-500/40"
                    : isActive
                    ? "border-gold-500/40 shadow-[0_0_16px_rgba(198,167,94,0.2)]"
                    : "border-white/[0.08]"
                }`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2, type: "spring", stiffness: 500 }}
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <span
                    className={`text-sm font-bold ${
                      isActive ? "text-dark-950" : "text-neutral-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}

                {/* Active ring pulse */}
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-gold-400"
                  />
                )}
              </motion.div>

              {/* Label */}
              <motion.p
                animate={{
                  color: isActive
                    ? "rgb(198, 167, 94)"
                    : isCompleted
                    ? "rgb(16, 185, 129)"
                    : "rgb(115, 115, 115)",
                }}
                className="mt-2 text-[11px] font-medium text-center max-w-[80px] leading-tight hidden sm:block"
              >
                {step}
              </motion.p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="relative w-12 sm:w-20 h-0.5 mx-1 sm:mx-2">
                <div className="absolute inset-0 bg-white/[0.06] rounded-full" />
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: isCompleted ? "100%" : isActive ? "50%" : "0%",
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    isCompleted ? "bg-emerald-500" : "bg-gold-500"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
