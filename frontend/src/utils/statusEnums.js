/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS STATUS ENUMS — Single Source of Truth
 * ══════════════════════════════════════════════════════════════
 *
 * All status constants for the appointment, case, and payment
 * lifecycle. Used by globalStore, components, and badges.
 */

// ── Appointment Status ───────────────────────────────────────

export const AppointmentStatus = Object.freeze({
  PENDING_APPROVAL: "PENDING_LAWYER_APPROVAL",
  APPROVED_AWAITING_PAYMENT: "APPROVED_AWAITING_PAYMENT",
  PAYMENT_EXPIRED: "PAYMENT_EXPIRED",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED_BY_CLIENT",
  DECLINED: "DECLINED_BY_LAWYER",
  COMPLETED: "COMPLETED",
  EXPIRED: "EXPIRED",
});

// ── Case Status ──────────────────────────────────────────────

export const CaseStatus = Object.freeze({
  ACTIVE: "ACTIVE",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  OVERDUE: "PAYMENT_OVERDUE",
  CLOSED: "CLOSED_BY_LAWYER",
  ENDED: "ENDED_BY_CLIENT",
  TERMINATED: "TERMINATED",
});

// ── Payment Status ───────────────────────────────────────────

export const PaymentStatus = Object.freeze({
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
  REFUNDED: "REFUNDED",
});

// ── Display Config ───────────────────────────────────────────

export const APPOINTMENT_STATUS_CONFIG = Object.freeze({
  [AppointmentStatus.PENDING_APPROVAL]: {
    label: "Pending Approval",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
    icon: "clock",
  },
  [AppointmentStatus.APPROVED_AWAITING_PAYMENT]: {
    label: "Awaiting Payment",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
    icon: "credit-card",
  },
  [AppointmentStatus.PAYMENT_EXPIRED]: {
    label: "Payment Expired",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
    icon: "x-circle",
  },
  [AppointmentStatus.CONFIRMED]: {
    label: "Confirmed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    icon: "check-circle",
  },
  [AppointmentStatus.CANCELLED]: {
    label: "Cancelled",
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
    dot: "bg-neutral-400",
    icon: "x",
  },
  [AppointmentStatus.DECLINED]: {
    label: "Declined",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
    icon: "slash",
  },
  [AppointmentStatus.COMPLETED]: {
    label: "Completed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    icon: "check",
  },
  [AppointmentStatus.EXPIRED]: {
    label: "Expired",
    color: "text-neutral-500",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
    dot: "bg-neutral-500",
    icon: "timer-off",
  },
});

export const CASE_STATUS_CONFIG = Object.freeze({
  [CaseStatus.ACTIVE]: {
    label: "Active",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  [CaseStatus.PAYMENT_PENDING]: {
    label: "Payment Pending",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  [CaseStatus.OVERDUE]: {
    label: "Payment Overdue",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
  [CaseStatus.CLOSED]: {
    label: "Closed",
    color: "text-neutral-400",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
    dot: "bg-neutral-400",
  },
  [CaseStatus.ENDED]: {
    label: "Ended by Client",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-400",
  },
  [CaseStatus.TERMINATED]: {
    label: "Terminated",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500",
  },
});

export const PAYMENT_STATUS_CONFIG = Object.freeze({
  [PaymentStatus.PENDING]: {
    label: "Pending",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  [PaymentStatus.SUCCESS]: {
    label: "Paid",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  [PaymentStatus.FAILED]: {
    label: "Failed",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
  [PaymentStatus.EXPIRED]: {
    label: "Expired",
    color: "text-neutral-500",
    bg: "bg-neutral-500/10",
    border: "border-neutral-500/20",
    dot: "bg-neutral-500",
  },
  [PaymentStatus.REFUNDED]: {
    label: "Refunded",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
});
