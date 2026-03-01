/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS PAYMENT MODAL — Premium Payment Confirmation Flow
 * ══════════════════════════════════════════════════════════════
 *
 * Full-screen modal with:
 *  • Countdown timer for payment window
 *  • Mock payment form (Visa/Master styled)
 *  • Animated success/failure states
 *  • Receipt view on success
 *  • Auto-cancel on expiry
 */

import { useState, useCallback } from "react";
import {
  X,
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  XCircle,
  Receipt,
  ArrowRight,
} from "lucide-react";
import CountdownTimer from "@components/common/CountdownTimer";

const STEPS = { CONFIRM: "confirm", PROCESSING: "processing", SUCCESS: "success", EXPIRED: "expired" };

export default function PaymentModal({
  isOpen,
  onClose,
  payment,
  onConfirmPayment,
  appointment,
}) {
  const [step, setStep] = useState(STEPS.CONFIRM);

  const handlePay = useCallback(() => {
    setStep(STEPS.PROCESSING);
    // Simulate processing delay
    setTimeout(() => {
      if (onConfirmPayment) onConfirmPayment(payment.id);
      setStep(STEPS.SUCCESS);
    }, 2500);
  }, [payment, onConfirmPayment]);

  const handleExpire = useCallback(() => {
    setStep(STEPS.EXPIRED);
  }, []);

  const handleClose = useCallback(() => {
    setStep(STEPS.CONFIRM);
    onClose();
  }, [onClose]);

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-dark-800 border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">Payment Confirmation</h3>
              <p className="text-xs text-neutral-500">Secure payment processing</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ── Confirm Step ── */}
          {step === STEPS.CONFIRM && (
            <div className="space-y-6">
              {/* Timer */}
              {payment.deadline && (
                <CountdownTimer
                  deadline={payment.deadline}
                  totalDuration={payment.deadline - payment.createdAt}
                  onExpire={handleExpire}
                  label="Payment Window"
                  variant="display"
                />
              )}

              {/* Payment Details */}
              <div className="space-y-3 p-4 rounded-xl bg-dark-900/60 border border-white/[0.06]">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Description</span>
                  <span className="text-neutral-200 text-right max-w-[200px]">{payment.description}</span>
                </div>
                {appointment && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Lawyer</span>
                      <span className="text-neutral-200">{appointment.lawyerName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Date & Time</span>
                      <span className="text-neutral-200">{appointment.selectedDate} • {appointment.selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Type</span>
                      <span className="text-neutral-200 capitalize">{appointment.consultationType}</span>
                    </div>
                  </>
                )}
                <div className="border-t border-white/[0.06] pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-400">Total Amount</span>
                    <span className="text-2xl font-bold text-gold-400">
                      LKR {payment.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mock Card Display */}
              <div className="p-4 rounded-xl bg-linear-to-br from-dark-700 to-dark-800 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Payment Method</span>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">VISA</div>
                    <div className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold">MC</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-300 font-mono">•••• •••• •••• 4242</p>
                    <p className="text-[11px] text-neutral-600 mt-1">Expires 12/27</p>
                  </div>
                  <Shield className="w-5 h-5 text-emerald-400/60" />
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-600">
                <Lock className="w-3.5 h-3.5" />
                <span>256-bit SSL encryption • PCI DSS compliant • Your data is secure</span>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-gold-btn text-dark-950 font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
              >
                <Lock className="w-4 h-4" />
                Confirm Payment — LKR {payment.amount?.toLocaleString()}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── Processing Step ── */}
          {step === STEPS.PROCESSING && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-gold-500/20 border-t-gold-400 animate-spin" />
                <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-gold-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-neutral-100">Processing Payment</p>
                <p className="text-sm text-neutral-500 mt-1">Please wait while we verify your transaction…</p>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gold-400 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Success Step ── */}
          {step === STEPS.SUCCESS && (
            <div className="flex flex-col items-center py-8 space-y-6">
              {/* Animated Check */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping" />
              </div>

              <div className="text-center">
                <p className="text-xl font-bold text-emerald-400">Payment Successful!</p>
                <p className="text-sm text-neutral-400 mt-2">Your appointment has been confirmed</p>
              </div>

              {/* Receipt Card */}
              <div className="w-full p-4 rounded-xl bg-dark-900/60 border border-white/[0.06] space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="w-4 h-4 text-gold-400" />
                  <span className="text-sm font-semibold text-neutral-200">Payment Receipt</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Transaction ID</span>
                  <span className="text-neutral-300 font-mono">{payment.id?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Amount</span>
                  <span className="text-emerald-400 font-semibold">LKR {payment.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Date</span>
                  <span className="text-neutral-300">{new Date().toLocaleString("en-LK")}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500">Status</span>
                  <span className="text-emerald-400 font-semibold">✓ Confirmed</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-6 py-3 rounded-xl bg-dark-700 text-neutral-200 font-medium text-sm hover:bg-dark-600 transition-colors border border-white/[0.06]"
              >
                Close
              </button>
            </div>
          )}

          {/* ── Expired Step ── */}
          {step === STEPS.EXPIRED && (
            <div className="flex flex-col items-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-red-400">Payment Window Expired</p>
                <p className="text-sm text-neutral-400 mt-2">
                  The payment deadline has passed. The appointment slot has been released.
                </p>
                <p className="text-xs text-neutral-600 mt-3">
                  You can book a new appointment with this lawyer.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full px-6 py-3 rounded-xl bg-dark-700 text-neutral-200 font-medium text-sm hover:bg-dark-600 transition-colors border border-white/[0.06]"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
