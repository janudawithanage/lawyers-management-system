/**
 * ══════════════════════════════════════════════════════════════
 * USE LAWYER STORE — Filtered Global-Store Wrapper for Lawyer
 * ══════════════════════════════════════════════════════════════
 *
 * Mirrors useClientStore.js but filters data for the logged-in
 * lawyer. Provides derived KPI stats used by LawyerDashboard.
 *
 * Falls back to MOCK_LAWYER_ID when no auth user is available.
 */

import { useMemo } from "react";
import { useAppStore } from "@/store/globalStore";
import { useAuth } from "@context/AuthContext";
import { AppointmentStatus, CaseStatus, PaymentStatus } from "@utils/statusEnums";

const MOCK_LAWYER_ID = "LWR-003";

export default function useLawyerStore() {
  const store = useAppStore();
  const { user } = useAuth();

  const lawyerId = user?.id || MOCK_LAWYER_ID;

  // ── Filtered collections ──────────────────────────────────
  const myAppointments = useMemo(
    () => store.appointments.filter((a) => a.lawyerId === lawyerId),
    [store.appointments, lawyerId]
  );

  const myCases = useMemo(
    () => store.cases.filter((c) => c.lawyerId === lawyerId),
    [store.cases, lawyerId]
  );

  const myPayments = useMemo(
    () => store.payments.filter((p) => {
      // Payments linked to my appointments or my cases
      const myAptIds = new Set(myAppointments.map((a) => a.id));
      const myCaseIds = new Set(myCases.map((c) => c.id));
      return myAptIds.has(p.appointmentId) || myCaseIds.has(p.caseId);
    }),
    [store.payments, myAppointments, myCases]
  );

  const myNotifications = useMemo(
    () => store.notifications.filter(
      (n) => n.targetRole === "lawyer" || n.targetRole === "all"
    ),
    [store.notifications]
  );

  // ── Derived stats (KPIs) ──────────────────────────────────
  const stats = useMemo(() => {
    const pendingRequests = myAppointments.filter(
      (a) => a.status === AppointmentStatus.PENDING_APPROVAL
    );
    const awaitingPayment = myAppointments.filter(
      (a) => a.status === AppointmentStatus.APPROVED_AWAITING_PAYMENT
    );
    const confirmedAppointments = myAppointments.filter(
      (a) => a.status === AppointmentStatus.CONFIRMED
    );
    const completedAppointments = myAppointments.filter(
      (a) => a.status === AppointmentStatus.COMPLETED
    );
    const activeCases = myCases.filter(
      (c) => c.status === CaseStatus.ACTIVE
    );
    const paymentPendingCases = myCases.filter(
      (c) => c.status === CaseStatus.PAYMENT_PENDING || c.status === CaseStatus.OVERDUE
    );
    const totalEarned = myPayments
      .filter((p) => p.status === PaymentStatus.SUCCESS)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingPayments = myPayments.filter(
      (p) => p.status === PaymentStatus.PENDING
    );

    return {
      pendingRequests,
      awaitingPayment,
      confirmedAppointments,
      completedAppointments,
      activeCases,
      paymentPendingCases,
      totalEarned,
      pendingPayments,
    };
  }, [myAppointments, myCases, myPayments]);

  // ── Today's appointments ──────────────────────────────────
  const todaysAppointments = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return myAppointments.filter((a) => {
      if (a.status !== AppointmentStatus.CONFIRMED) return false;
      return a.selectedDate === today;
    });
  }, [myAppointments]);

  return {
    // Raw filtered data
    lawyerId,
    myAppointments,
    myCases,
    myPayments,
    myNotifications,
    todaysAppointments,

    // Derived stats
    ...stats,

    // Pass-through store actions
    approveAppointment: store.approveAppointment,
    declineAppointment: store.declineAppointment,
    completeConsultation: store.completeConsultation,
    cancelAppointment: store.cancelAppointment,
    startCase: store.startCase,
    requestCasePayment: store.requestCasePayment,
    closeCase: store.closeCase,
    terminateCase: store.terminateCase,
    addDocumentToCase: store.addDocumentToCase,
    removeDocumentFromCase: store.removeDocumentFromCase,
    addMessageToCase: store.addMessageToCase,
    confirmPayment: store.confirmPayment,
    dismissNotification: store.dismissNotification,

    // Config
    config: store.config,
  };
}
