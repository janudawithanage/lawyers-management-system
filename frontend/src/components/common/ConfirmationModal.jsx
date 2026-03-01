/**
 * ══════════════════════════════════════════════════════════════
 * CONFIRMATION MODAL — Premium Modal with Glassmorphism
 * ══════════════════════════════════════════════════════════════
 *
 * Reusable confirmation/action modal with backdrop blur,
 * animated entry, and configurable action buttons.
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useEffect } from "react";

const VARIANT_STYLES = {
  danger: {
    icon: AlertTriangle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10",
    buttonBg: "bg-red-500 hover:bg-red-600",
    borderColor: "border-red-500/20",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    buttonBg: "gradient-gold-btn hover:opacity-90",
    borderColor: "border-emerald-500/20",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10",
    buttonBg: "bg-blue-500 hover:bg-blue-600",
    borderColor: "border-blue-500/20",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    buttonBg: "bg-amber-500 hover:bg-amber-600",
    borderColor: "border-amber-500/20",
  },
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
  children,
}) {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const Icon = style.icon;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-md bg-dark-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-px ${style.borderColor}`} />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>

            <div className="p-6">
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${style.iconBg} mb-4`}
              >
                <Icon className={`w-6 h-6 ${style.iconColor}`} />
              </div>

              {/* Title & Message */}
              <h3 className="text-lg font-bold text-neutral-100 mb-2">{title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{message}</p>

              {/* Custom content slot */}
              {children && <div className="mt-4">{children}</div>}

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white ${style.buttonBg} transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {loading && (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  )}
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
