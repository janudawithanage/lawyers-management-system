/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS GLOBAL STORE — Context + useReducer
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise state management for the full appointment,
 * case, and payment lifecycle. Uses React Context + useReducer
 * pattern for predictable state transitions.
 *
 * Domains:
 *  1. Appointments — Full lifecycle with time-bound logic
 *  2. Cases — Created from completed consultations
 *  3. Payments — Tracks all financial transactions
 *  4. Notifications — System-wide banners and alerts
 *  5. Config — Admin-configurable time windows
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { AppointmentStatus, CaseStatus, PaymentStatus } from "@utils/statusEnums";
import { createDeadline, DEFAULT_TIME_WINDOWS } from "@utils/timeHelpers";
import { seedAppointments, seedCases, seedPayments, seedNotifications } from "@services/mockSeedData";

// ── Valid Appointment State Transitions (strict state machine) ──

const VALID_TRANSITIONS = Object.freeze({
  [AppointmentStatus.PENDING_APPROVAL]: [
    AppointmentStatus.APPROVED_AWAITING_PAYMENT,
    AppointmentStatus.DECLINED,
    AppointmentStatus.EXPIRED,
    AppointmentStatus.CANCELLED,
  ],
  [AppointmentStatus.APPROVED_AWAITING_PAYMENT]: [
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.PAYMENT_EXPIRED,
    AppointmentStatus.CANCELLED,
  ],
  [AppointmentStatus.CONFIRMED]: [
    AppointmentStatus.COMPLETED,
    AppointmentStatus.CANCELLED,
  ],
  // Terminal states — no further transitions allowed
  [AppointmentStatus.COMPLETED]: [],
  [AppointmentStatus.CANCELLED]: [],
  [AppointmentStatus.DECLINED]: [],
  [AppointmentStatus.EXPIRED]: [],
  [AppointmentStatus.PAYMENT_EXPIRED]: [],
});

/**
 * Validate whether a status transition is legal.
 * Admin overrides bypass validation.
 */
function isValidTransition(currentStatus, nextStatus) {
  // Allow admin overrides
  if (!currentStatus) return true;
  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed) return true; // Unknown status → allow
  return allowed.includes(nextStatus);
}

// ── Action Types ─────────────────────────────────────────────

const ActionTypes = Object.freeze({
  // Appointments
  SET_APPOINTMENTS: "SET_APPOINTMENTS",
  ADD_APPOINTMENT: "ADD_APPOINTMENT",
  UPDATE_APPOINTMENT: "UPDATE_APPOINTMENT",
  REMOVE_APPOINTMENT: "REMOVE_APPOINTMENT",

  // Cases
  SET_CASES: "SET_CASES",
  ADD_CASE: "ADD_CASE",
  UPDATE_CASE: "UPDATE_CASE",
  ADD_DOCUMENT_TO_CASE: "ADD_DOCUMENT_TO_CASE",
  REMOVE_DOCUMENT_FROM_CASE: "REMOVE_DOCUMENT_FROM_CASE",
  ADD_MESSAGE_TO_CASE: "ADD_MESSAGE_TO_CASE",

  // Payments
  SET_PAYMENTS: "SET_PAYMENTS",
  ADD_PAYMENT: "ADD_PAYMENT",
  UPDATE_PAYMENT: "UPDATE_PAYMENT",

  // Notifications
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  DISMISS_NOTIFICATION: "DISMISS_NOTIFICATION",
  MARK_NOTIFICATION_READ: "MARK_NOTIFICATION_READ",
  MARK_ALL_NOTIFICATIONS_READ: "MARK_ALL_NOTIFICATIONS_READ",
  CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATIONS",

  // Config
  UPDATE_CONFIG: "UPDATE_CONFIG",
});

// ── Initial State ────────────────────────────────────────────

const initialState = {
  appointments: [],
  cases: [],
  payments: [],
  notifications: [],
  config: {
    lawyerApprovalHours: DEFAULT_TIME_WINDOWS.LAWYER_APPROVAL_HOURS,
    clientPaymentMinutes: DEFAULT_TIME_WINDOWS.CLIENT_PAYMENT_MINUTES,
    casePaymentDays: DEFAULT_TIME_WINDOWS.CASE_PAYMENT_DAYS,
  },
  initialized: false,
};

// ── Reducer ──────────────────────────────────────────────────

function appReducer(state, action) {
  switch (action.type) {
    // ── Appointments ──
    case ActionTypes.SET_APPOINTMENTS:
      return { ...state, appointments: action.payload, initialized: true };

    case ActionTypes.ADD_APPOINTMENT:
      return {
        ...state,
        appointments: [action.payload, ...state.appointments],
      };

    case ActionTypes.UPDATE_APPOINTMENT: {
      const { id, status: nextStatus, overriddenBy, ...rest } = action.payload;
      return {
        ...state,
        appointments: state.appointments.map((a) => {
          if (a.id !== id) return a;
          // Admin overrides bypass transition validation
          if (nextStatus && !overriddenBy && !isValidTransition(a.status, nextStatus)) {
            console.warn(
              `[AppointmentStore] Invalid transition: ${a.status} → ${nextStatus} for ${id}. Rejected.`
            );
            return a;
          }
          return { ...a, ...rest, ...(nextStatus ? { status: nextStatus } : {}), ...(overriddenBy ? { overriddenBy, overriddenAt: rest.overriddenAt } : {}) };
        }),
      };
    }

    case ActionTypes.REMOVE_APPOINTMENT:
      return {
        ...state,
        appointments: state.appointments.filter((a) => a.id !== action.payload),
      };

    // ── Cases ──
    case ActionTypes.SET_CASES:
      return { ...state, cases: action.payload };

    case ActionTypes.ADD_CASE:
      return { ...state, cases: [action.payload, ...state.cases] };

    case ActionTypes.UPDATE_CASE:
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };

    case ActionTypes.ADD_DOCUMENT_TO_CASE:
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? { ...c, documents: [...(c.documents || []), action.payload.document] }
            : c
        ),
      };

    case ActionTypes.REMOVE_DOCUMENT_FROM_CASE:
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? { ...c, documents: (c.documents || []).filter((d) => d.id !== action.payload.documentId) }
            : c
        ),
      };

    case ActionTypes.ADD_MESSAGE_TO_CASE:
      return {
        ...state,
        cases: state.cases.map((c) =>
          c.id === action.payload.caseId
            ? { ...c, messages: [...(c.messages || []), action.payload.message] }
            : c
        ),
      };

    // ── Payments ──
    case ActionTypes.SET_PAYMENTS:
      return { ...state, payments: action.payload };

    case ActionTypes.ADD_PAYMENT:
      return { ...state, payments: [action.payload, ...state.payments] };

    case ActionTypes.UPDATE_PAYMENT:
      return {
        ...state,
        payments: state.payments.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      };

    // ── Notifications ──
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          { id: `notif-${Date.now()}`, timestamp: Date.now(), read: false, ...action.payload },
          ...state.notifications,
        ].slice(0, 50), // Keep last 50
      };

    case ActionTypes.DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case ActionTypes.MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          action.payload ? (n.targetRole === action.payload ? { ...n, read: true } : n) : { ...n, read: true }
        ),
      };

    case ActionTypes.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };

    // ── Config ──
    case ActionTypes.UPDATE_CONFIG:
      return { ...state, config: { ...state.config, ...action.payload } };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────

const AppStoreContext = createContext(undefined);
AppStoreContext.displayName = "AppStoreContext";

// ── Provider ─────────────────────────────────────────────────

export function AppStoreProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ── Seed mock data on mount ────────────────────────────────
  useEffect(() => {
    if (!state.initialized) {
      const appointments = seedAppointments();
      const cases = seedCases();
      const payments = seedPayments();
      const notifications = seedNotifications();
      dispatch({ type: ActionTypes.SET_APPOINTMENTS, payload: appointments });
      dispatch({ type: ActionTypes.SET_CASES, payload: cases });
      dispatch({ type: ActionTypes.SET_PAYMENTS, payload: payments });
      // Dispatch in reverse so the first seed item ends up at the top (newest first)
      [...notifications].reverse().forEach((n) =>
        dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: n })
      );
    }
  }, [state.initialized]);

  // ── Expiration checker — runs every 5 seconds ──────────────
  useEffect(() => {
    const checkExpirations = () => {
      const now = Date.now();

      state.appointments.forEach((apt) => {
        // Check lawyer approval deadline
        if (
          apt.status === AppointmentStatus.PENDING_APPROVAL &&
          apt.approvalDeadline &&
          now >= apt.approvalDeadline
        ) {
          dispatch({
            type: ActionTypes.UPDATE_APPOINTMENT,
            payload: { id: apt.id, status: AppointmentStatus.EXPIRED },
          });
          dispatch({
            type: ActionTypes.ADD_NOTIFICATION,
            payload: {
              type: "warning",
              title: "Appointment Expired",
              message: `Appointment #${apt.id.slice(-6)} expired — lawyer did not respond in time.`,
              appointmentId: apt.id,
              targetRole: "client",
              category: "appointment",
            },
          });
        }

        // Check payment deadline
        if (
          apt.status === AppointmentStatus.APPROVED_AWAITING_PAYMENT &&
          apt.paymentDeadline &&
          now >= apt.paymentDeadline
        ) {
          dispatch({
            type: ActionTypes.UPDATE_APPOINTMENT,
            payload: { id: apt.id, status: AppointmentStatus.PAYMENT_EXPIRED },
          });
          dispatch({
            type: ActionTypes.ADD_NOTIFICATION,
            payload: {
              type: "warning",
              title: "Payment Window Expired",
              message: `Payment deadline passed for appointment #${apt.id.slice(-6)}. Slot released.`,
              appointmentId: apt.id,
              targetRole: "client",
              category: "payment",
            },
          });
          dispatch({
            type: ActionTypes.ADD_NOTIFICATION,
            payload: {
              type: "warning",
              title: "Payment Window Expired",
              message: `Client did not pay for appointment #${apt.id.slice(-6)}. Slot released.`,
              appointmentId: apt.id,
              targetRole: "lawyer",
              category: "payment",
            },
          });
          // Expire the associated payment
          const relatedPayment = state.payments.find(
            (p) => p.appointmentId === apt.id && p.status === PaymentStatus.PENDING
          );
          if (relatedPayment) {
            dispatch({
              type: ActionTypes.UPDATE_PAYMENT,
              payload: { id: relatedPayment.id, status: PaymentStatus.EXPIRED },
            });
          }
        }
      });

      // Check case payment deadlines
      state.cases.forEach((c) => {
        if (
          c.status === CaseStatus.PAYMENT_PENDING &&
          c.nextPaymentDeadline &&
          now >= c.nextPaymentDeadline
        ) {
          dispatch({
            type: ActionTypes.UPDATE_CASE,
            payload: { id: c.id, status: CaseStatus.OVERDUE },
          });
          dispatch({
            type: ActionTypes.ADD_NOTIFICATION,
            payload: {
              type: "error",
              title: "Case Payment Overdue",
              message: `Payment for case "${c.title}" is now overdue.`,
              caseId: c.id,
              targetRole: "client",
              category: "payment",
            },
          });
          dispatch({
            type: ActionTypes.ADD_NOTIFICATION,
            payload: {
              type: "error",
              title: "Case Payment Overdue",
              message: `Client payment for case "${c.title}" is now overdue.`,
              caseId: c.id,
              targetRole: "lawyer",
              category: "payment",
            },
          });
        }
      });
    };

    const interval = setInterval(checkExpirations, 5000);
    return () => clearInterval(interval);
  }, [state.appointments, state.payments, state.cases]);

  // ── Action Creators ────────────────────────────────────────

  /** Book a new appointment (client action) */
  const bookAppointment = useCallback(
    (appointmentData) => {
      const id = `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const approvalDeadline = createDeadline(state.config.lawyerApprovalHours, "hours");

      const appointment = {
        id,
        ...appointmentData,
        status: AppointmentStatus.PENDING_APPROVAL,
        createdAt: Date.now(),
        approvalDeadline,
        paymentDeadline: null,
        approvalDuration: state.config.lawyerApprovalHours * 60 * 60 * 1000,
      };

      dispatch({ type: ActionTypes.ADD_APPOINTMENT, payload: appointment });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "info",
          title: "Appointment Booked",
          message: `Your appointment request has been sent to ${appointmentData.lawyerName}. They have ${state.config.lawyerApprovalHours}h to respond.`,
          appointmentId: id,
          targetRole: "client",
          category: "appointment",
        },
      });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "info",
          title: "New Consultation Request",
          message: `${appointmentData.clientName || "A client"} has requested a consultation.`,
          appointmentId: id,
          targetRole: "lawyer",
          category: "appointment",
        },
      });

      return appointment;
    },
    [state.config.lawyerApprovalHours]
  );

  /** Lawyer approves an appointment */
  const approveAppointment = useCallback(
    (appointmentId) => {
      const paymentDeadline = createDeadline(state.config.clientPaymentMinutes, "minutes");
      const paymentId = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const apt = state.appointments.find((a) => a.id === appointmentId);

      dispatch({
        type: ActionTypes.UPDATE_APPOINTMENT,
        payload: {
          id: appointmentId,
          status: AppointmentStatus.APPROVED_AWAITING_PAYMENT,
          paymentDeadline,
          paymentDuration: state.config.clientPaymentMinutes * 60 * 1000,
          approvedAt: Date.now(),
        },
      });

      // Create pending payment record
      const payment = {
        id: paymentId,
        appointmentId,
        caseId: null,
        clientId: apt?.clientId,
        lawyerId: apt?.lawyerId,
        amount: apt?.consultationFee || 5000,
        type: "consultation_fee",
        status: PaymentStatus.PENDING,
        createdAt: Date.now(),
        deadline: paymentDeadline,
        paidAt: null,
        description: `Consultation fee for appointment with ${apt?.lawyerName}`,
      };

      dispatch({ type: ActionTypes.ADD_PAYMENT, payload: payment });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "success",
          title: "Appointment Approved",
          message: `Your appointment has been approved. You have ${state.config.clientPaymentMinutes} minutes to complete payment.`,
          appointmentId,
          targetRole: "client",
          category: "appointment",
        },
      });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "success",
          title: "Appointment Approved",
          message: `You approved appointment #${appointmentId.slice(-6)}. Awaiting client payment.`,
          appointmentId,
          targetRole: "lawyer",
          category: "appointment",
        },
      });
    },
    [state.config.clientPaymentMinutes, state.appointments]
  );

  /** Lawyer declines an appointment */
  const declineAppointment = useCallback((appointmentId, reason = "") => {
    dispatch({
      type: ActionTypes.UPDATE_APPOINTMENT,
      payload: {
        id: appointmentId,
        status: AppointmentStatus.DECLINED,
        declineReason: reason,
        declinedAt: Date.now(),
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "warning",
        title: "Appointment Declined",
        message: `Your appointment request was declined.${reason ? ` Reason: ${reason}` : ""}`,
        appointmentId,
        targetRole: "client",
        category: "appointment",
      },
    });
  }, []);

  /** Client confirms payment for an appointment */
  const confirmPayment = useCallback(
    (paymentId) => {
      const payment = state.payments.find((p) => p.id === paymentId);
      if (!payment) return;

      dispatch({
        type: ActionTypes.UPDATE_PAYMENT,
        payload: { id: paymentId, status: PaymentStatus.SUCCESS, paidAt: Date.now() },
      });

      if (payment.appointmentId) {
        dispatch({
          type: ActionTypes.UPDATE_APPOINTMENT,
          payload: { id: payment.appointmentId, status: AppointmentStatus.CONFIRMED },
        });
      }

      if (payment.caseId) {
        const caseData = state.cases.find((c) => c.id === payment.caseId);
        if (caseData) {
          dispatch({
            type: ActionTypes.UPDATE_CASE,
            payload: {
              id: payment.caseId,
              status: CaseStatus.ACTIVE,
              paidAmount: (caseData.paidAmount || 0) + payment.amount,
              nextPaymentDeadline: null,
            },
          });
        }
      }

      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "success",
          title: "Payment Successful",
          message: `Payment of LKR ${payment.amount.toLocaleString()} has been confirmed.`,
          paymentId,
          targetRole: "client",
          category: "payment",
        },
      });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "success",
          title: "Payment Received",
          message: `LKR ${payment.amount.toLocaleString()} payment received for ${payment.caseId ? "case" : "consultation"}.`,
          paymentId,
          targetRole: "lawyer",
          category: "payment",
        },
      });
    },
    [state.payments, state.cases]
  );

  /** Mark consultation as completed */
  const completeConsultation = useCallback((appointmentId) => {
    dispatch({
      type: ActionTypes.UPDATE_APPOINTMENT,
      payload: { id: appointmentId, status: AppointmentStatus.COMPLETED, completedAt: Date.now() },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "success",
        title: "Consultation Completed",
        message: `Your consultation has been completed. A case may be started from this.`,
        appointmentId,
        targetRole: "client",
        category: "appointment",
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "success",
        title: "Consultation Completed",
        message: `Consultation #${appointmentId.slice(-6)} marked as completed.`,
        appointmentId,
        targetRole: "lawyer",
        category: "appointment",
      },
    });
  }, []);

  /** Cancel an appointment */
  const cancelAppointment = useCallback((appointmentId, reason = "") => {
    dispatch({
      type: ActionTypes.UPDATE_APPOINTMENT,
      payload: {
        id: appointmentId,
        status: AppointmentStatus.CANCELLED,
        cancelReason: reason,
        cancelledAt: Date.now(),
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "info",
        title: "Appointment Cancelled",
        message: `Appointment #${appointmentId.slice(-6)} has been cancelled.`,
        appointmentId,
        targetRole: "client",
        category: "appointment",
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "info",
        title: "Appointment Cancelled",
        message: `A client has cancelled appointment #${appointmentId.slice(-6)}.`,
        appointmentId,
        targetRole: "lawyer",
        category: "appointment",
      },
    });
  }, []);

  /** Start a case from a completed consultation */
  const startCase = useCallback(
    (appointmentId, caseData) => {
      const apt = state.appointments.find((a) => a.id === appointmentId);
      if (!apt) return null;

      const id = `case-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newCase = {
        id,
        appointmentId,
        clientId: apt.clientId,
        clientName: apt.clientName,
        lawyerId: apt.lawyerId,
        lawyerName: apt.lawyerName,
        caseType: apt.caseType || caseData.caseType,
        title: caseData.title,
        description: caseData.description || apt.description,
        status: CaseStatus.ACTIVE,
        createdAt: Date.now(),
        documents: [],
        messages: [],
        payments: [],
        nextPaymentDeadline: null,
        totalFees: caseData.estimatedFees || 0,
        paidAmount: apt.consultationFee || 0,
        progress: 10,
      };

      dispatch({ type: ActionTypes.ADD_CASE, payload: newCase });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "success",
          title: "Case Started",
          message: `A new case "${caseData.title}" has been started from your consultation.`,
          caseId: id,
          targetRole: "client",
          category: "case",
        },
      });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "success",
          title: "Case Started",
          message: `Case "${caseData.title}" created from consultation #${appointmentId.slice(-6)}.`,
          caseId: id,
          targetRole: "lawyer",
          category: "case",
        },
      });

      return newCase;
    },
    [state.appointments]
  );

  /** Lawyer requests additional payment for a case */
  const requestCasePayment = useCallback(
    (caseId, amount, description = "Additional case fee") => {
      const c = state.cases.find((cs) => cs.id === caseId);
      if (!c) return;

      const paymentDeadline = createDeadline(state.config.casePaymentDays * 24, "hours");
      const paymentId = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const payment = {
        id: paymentId,
        appointmentId: null,
        caseId,
        clientId: c.clientId,
        lawyerId: c.lawyerId,
        amount,
        type: "case_fee",
        status: PaymentStatus.PENDING,
        createdAt: Date.now(),
        deadline: paymentDeadline,
        paidAt: null,
        description,
      };

      dispatch({ type: ActionTypes.ADD_PAYMENT, payload: payment });
      dispatch({
        type: ActionTypes.UPDATE_CASE,
        payload: {
          id: caseId,
          status: CaseStatus.PAYMENT_PENDING,
          nextPaymentDeadline: paymentDeadline,
          totalFees: (c.totalFees || 0) + amount,
        },
      });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "warning",
          title: "Payment Requested",
          message: `Your lawyer has requested LKR ${amount.toLocaleString()} for case "${c.title}".`,
          caseId,
          paymentId,
          targetRole: "client",
          category: "payment",
        },
      });
      dispatch({
        type: ActionTypes.ADD_NOTIFICATION,
        payload: {
          type: "info",
          title: "Payment Requested",
          message: `LKR ${amount.toLocaleString()} payment requested for case "${c.title}".`,
          caseId,
          paymentId,
          targetRole: "lawyer",
          category: "payment",
        },
      });
    },
    [state.cases, state.config.casePaymentDays]
  );

  /** Close a case (lawyer action) */
  const closeCase = useCallback((caseId) => {
    dispatch({
      type: ActionTypes.UPDATE_CASE,
      payload: { id: caseId, status: CaseStatus.CLOSED, closedAt: Date.now(), progress: 100 },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "success",
        title: "Case Closed",
        message: `Your case #${caseId.slice(-6)} has been closed by your lawyer.`,
        caseId,
        targetRole: "client",
        category: "case",
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "success",
        title: "Case Closed",
        message: `Case #${caseId.slice(-6)} has been closed.`,
        caseId,
        targetRole: "lawyer",
        category: "case",
      },
    });
  }, []);

  /** End a case (client action) */
  const endCase = useCallback((caseId, reason = "") => {
    dispatch({
      type: ActionTypes.UPDATE_CASE,
      payload: {
        id: caseId,
        status: CaseStatus.ENDED,
        endedAt: Date.now(),
        endReason: reason,
        progress: 100,
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "info",
        title: "Case Ended",
        message: `You have ended case #${caseId.slice(-6)}.${reason ? ` Reason: ${reason}` : ""}`,
        caseId,
        targetRole: "client",
        category: "case",
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "warning",
        title: "Case Ended by Client",
        message: `Client has ended case #${caseId.slice(-6)}.${reason ? ` Reason: ${reason}` : ""}`,
        caseId,
        targetRole: "lawyer",
        category: "case",
      },
    });
  }, []);

  /** Terminate a case (overdue / non-payment — lawyer action) */
  const terminateCase = useCallback((caseId, reason = "") => {
    dispatch({
      type: ActionTypes.UPDATE_CASE,
      payload: {
        id: caseId,
        status: CaseStatus.TERMINATED,
        terminatedAt: Date.now(),
        terminationReason: reason,
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "error",
        title: "Case Terminated",
        message: `Your case #${caseId.slice(-6)} has been terminated.${reason ? ` Reason: ${reason}` : ""}`,
        caseId,
        targetRole: "client",
        category: "case",
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "error",
        title: "Case Terminated",
        message: `Case #${caseId.slice(-6)} has been terminated.${reason ? ` Reason: ${reason}` : ""}`,
        caseId,
        targetRole: "lawyer",
        category: "case",
      },
    });
  }, []);

  /** Admin: Override any appointment status */
  const overrideAppointmentStatus = useCallback((appointmentId, newStatus) => {
    dispatch({
      type: ActionTypes.UPDATE_APPOINTMENT,
      payload: { id: appointmentId, status: newStatus, overriddenAt: Date.now(), overriddenBy: "admin" },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "info",
        title: "Status Override",
        message: `Admin overrode appointment #${appointmentId.slice(-6)} status to "${newStatus}".`,
        appointmentId,
      },
    });
  }, []);

  /** Admin: Override case status */
  const overrideCaseStatus = useCallback((caseId, newStatus) => {
    dispatch({
      type: ActionTypes.UPDATE_CASE,
      payload: { id: caseId, status: newStatus, overriddenAt: Date.now(), overriddenBy: "admin" },
    });
  }, []);

  /** Admin: Update time window config */
  const updateConfig = useCallback((newConfig) => {
    dispatch({ type: ActionTypes.UPDATE_CONFIG, payload: newConfig });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "info",
        title: "Config Updated",
        message: "System time windows have been updated.",
      },
    });
  }, []);

  /** Add a document to a case */
  const addDocumentToCase = useCallback((caseId, document) => {
    // Normalize type — ensure it's always a file extension, not a MIME type
    let docType = document.type || "file";
    if (docType.includes("/")) docType = docType.split("/").pop().replace("x-", "");
    const doc = {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      uploadedAt: Date.now(),
      ...document,
      type: docType,
    };
    dispatch({ type: ActionTypes.ADD_DOCUMENT_TO_CASE, payload: { caseId, document: doc } });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "success",
        title: "Document Uploaded",
        message: `"${document.name}" has been uploaded to your case.`,
        caseId,
        targetRole: "client",
        category: "case",
      },
    });
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: {
        type: "success",
        title: "Document Uploaded",
        message: `A document "${document.name}" was uploaded to the case.`,
        caseId,
        targetRole: "lawyer",
        category: "case",
      },
    });
    return doc;
  }, []);

  /** Remove a document from a case */
  const removeDocumentFromCase = useCallback((caseId, documentId) => {
    dispatch({ type: ActionTypes.REMOVE_DOCUMENT_FROM_CASE, payload: { caseId, documentId } });
  }, []);

  /** Add a message to a case (supports both client and lawyer senders) */
  const addMessageToCase = useCallback((caseId, messageText, senderRole = "client") => {
    const isLawyer = senderRole === "lawyer";
    const message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: senderRole,
      senderName: isLawyer ? "Attorney" : "You",
      text: messageText,
      timestamp: Date.now(),
    };
    dispatch({ type: ActionTypes.ADD_MESSAGE_TO_CASE, payload: { caseId, message } });

    // Simulate auto-reply from the other side after 2-4 seconds
    setTimeout(() => {
      const lawyerReplies = [
        "Thank you for the update. I will review this shortly.",
        "Noted. I'll incorporate this into our strategy.",
        "I've received your message. Let me get back to you by end of day.",
        "Thank you. This is helpful for the case proceedings.",
        "Understood. I will follow up on this matter.",
      ];
      const clientReplies = [
        "Thank you, Attorney. I'll prepare the documents you requested.",
        "Understood. I'll be available for the hearing date.",
        "Thank you for the update. Looking forward to the next steps.",
        "Noted. I'll get back to you with the information shortly.",
        "Thank you for your guidance on this matter.",
      ];
      const replies = isLawyer ? clientReplies : lawyerReplies;
      const reply = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: isLawyer ? "client" : "lawyer",
        senderName: isLawyer ? "Client" : "Attorney",
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: Date.now(),
      };
      dispatch({ type: ActionTypes.ADD_MESSAGE_TO_CASE, payload: { caseId, message: reply } });
    }, 2000 + Math.random() * 2000);

    return message;
  }, []);

  /** Dismiss a notification */
  const dismissNotification = useCallback((notifId) => {
    dispatch({ type: ActionTypes.DISMISS_NOTIFICATION, payload: notifId });
  }, []);

  /** Mark a single notification as read */
  const markNotificationRead = useCallback((notifId) => {
    dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: notifId });
  }, []);

  /** Mark all notifications as read (optionally filtered by role) */
  const markAllNotificationsRead = useCallback((role = null) => {
    dispatch({ type: ActionTypes.MARK_ALL_NOTIFICATIONS_READ, payload: role });
  }, []);

  // ── Memoized Value ─────────────────────────────────────────

  const value = useMemo(
    () => ({
      // State
      appointments: state.appointments,
      cases: state.cases,
      payments: state.payments,
      notifications: state.notifications,
      config: state.config,

      // Appointment Actions
      bookAppointment,
      approveAppointment,
      declineAppointment,
      confirmPayment,
      completeConsultation,
      cancelAppointment,

      // Case Actions
      startCase,
      requestCasePayment,
      closeCase,
      endCase,
      terminateCase,
      addDocumentToCase,
      removeDocumentFromCase,
      addMessageToCase,

      // Admin Actions
      overrideAppointmentStatus,
      overrideCaseStatus,
      updateConfig,

      // Notification Actions
      dismissNotification,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      state,
      bookAppointment,
      approveAppointment,
      declineAppointment,
      confirmPayment,
      completeConsultation,
      cancelAppointment,
      startCase,
      requestCasePayment,
      closeCase,
      endCase,
      terminateCase,
      addDocumentToCase,
      removeDocumentFromCase,
      addMessageToCase,
      overrideAppointmentStatus,
      overrideCaseStatus,
      updateConfig,
      dismissNotification,
      markNotificationRead,
      markAllNotificationsRead,
    ]
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

/** Hook: access global store */
export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore() must be used within <AppStoreProvider>.");
  }
  return context;
}

export default AppStoreContext;
