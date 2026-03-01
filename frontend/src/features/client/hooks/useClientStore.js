/**
 * ══════════════════════════════════════════════════════════════
 * CLIENT STORE HOOK — Filtered Global Store for Client Role
 * ══════════════════════════════════════════════════════════════
 *
 * Wraps useAppStore to return only data belonging to the
 * current authenticated client. Prevents cross-role data leaks.
 *
 * Usage:
 *   const { myAppointments, myCases, myPayments, ... } = useClientStore();
 */

import { useMemo } from "react";
import { useAppStore } from "@/store/globalStore";
import { useAuth } from "@context/AuthContext";

const MOCK_CLIENT_ID = "USR-2026-0001";

export default function useClientStore() {
  const store = useAppStore();
  const { user } = useAuth();

  const clientId = user?.id || MOCK_CLIENT_ID;

  const myAppointments = useMemo(
    () => store.appointments.filter((a) => a.clientId === clientId),
    [store.appointments, clientId]
  );

  const myCases = useMemo(
    () => store.cases.filter((c) => c.clientId === clientId),
    [store.cases, clientId]
  );

  const myPayments = useMemo(
    () => store.payments.filter((p) => p.clientId === clientId),
    [store.payments, clientId]
  );

  const myNotifications = useMemo(
    () => store.notifications.filter((n) => !n.targetRole || n.targetRole === "client"),
    [store.notifications]
  );

  // ── Derived Computed Stats ──

  const pendingApprovals = useMemo(
    () => myAppointments.filter((a) => a.status === "PENDING_LAWYER_APPROVAL"),
    [myAppointments]
  );

  const awaitingPayment = useMemo(
    () => myAppointments.filter((a) => a.status === "APPROVED_AWAITING_PAYMENT"),
    [myAppointments]
  );

  const confirmedAppointments = useMemo(
    () => myAppointments.filter((a) => a.status === "CONFIRMED"),
    [myAppointments]
  );

  const activeCases = useMemo(
    () => myCases.filter((c) => c.status === "ACTIVE"),
    [myCases]
  );

  const paymentDueCases = useMemo(
    () => myCases.filter((c) => c.status === "PAYMENT_PENDING" || c.status === "PAYMENT_OVERDUE"),
    [myCases]
  );

  const pendingPayments = useMemo(
    () => myPayments.filter((p) => p.status === "PENDING"),
    [myPayments]
  );

  const totalSpent = useMemo(
    () =>
      myPayments
        .filter((p) => p.status === "SUCCESS")
        .reduce((sum, p) => sum + p.amount, 0),
    [myPayments]
  );

  return {
    // Raw filtered data
    myAppointments,
    myCases,
    myPayments,
    myNotifications,
    clientId,

    // Derived stats
    pendingApprovals,
    awaitingPayment,
    confirmedAppointments,
    activeCases,
    paymentDueCases,
    pendingPayments,
    totalSpent,

    // Pass-through actions
    bookAppointment: store.bookAppointment,
    cancelAppointment: store.cancelAppointment,
    confirmPayment: store.confirmPayment,
    addDocumentToCase: store.addDocumentToCase,
    removeDocumentFromCase: store.removeDocumentFromCase,
    addMessageToCase: store.addMessageToCase,
    terminateCase: store.terminateCase,
    dismissNotification: store.dismissNotification,

    // Config
    config: store.config,
  };
}
