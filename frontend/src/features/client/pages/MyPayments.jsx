/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS MY PAYMENTS — Full Payment Dashboard
 * ══════════════════════════════════════════════════════════════
 *
 * Enterprise payment management page with:
 *  • All payments (consultation + case fees)
 *  • Tab filters (All, Pending, Paid, Expired)
 *  • Payment details with receipt view
 *  • Countdown for pending payments
 *  • Financial summary cards
 *  • Payment confirmation flow
 */

import { useState, useMemo, useCallback } from "react";
import {
  DollarSign,
  Search,
  CreditCard,
  Receipt,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { PaymentStatus } from "@utils/statusEnums";
import StatusBadge from "@components/common/StatusBadge";
import CountdownTimer from "@components/common/CountdownTimer";
import PaymentModal from "../components/PaymentModal";

// ── Tab Configuration ────────────────────────────────────────

const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending", statuses: [PaymentStatus.PENDING] },
  { id: "paid", label: "Paid", statuses: [PaymentStatus.SUCCESS] },
  { id: "other", label: "Other", statuses: [PaymentStatus.EXPIRED, PaymentStatus.FAILED, PaymentStatus.REFUNDED] },
];

// ── Stat Card ────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, subtext, color = "gold" }) {
  const colors = {
    gold: { bg: "bg-gold-500/10", text: "text-gold-400", border: "border-gold-500/20" },
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  };
  const c = colors[color];

  return (
    <div className={`p-4 rounded-xl bg-dark-800/60 border ${c.border}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        <div>
          <p className="text-[11px] text-neutral-500 uppercase tracking-wider">{label}</p>
          <p className={`text-lg font-bold ${c.text}`}>{value}</p>
          {subtext && <p className="text-[10px] text-neutral-600">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Payment Row ──────────────────────────────────────────────

function PaymentRow({ payment, onPay }) {
  const [showDetails, setShowDetails] = useState(false);
  const isPending = payment.status === PaymentStatus.PENDING;

  return (
    <div className="rounded-xl bg-dark-800/60 border border-white/[0.06] overflow-hidden hover:border-white/[0.1] transition-colors">
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Type Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          payment.type === "consultation_fee" ? "bg-blue-500/10" : "bg-purple-500/10"
        }`}>
          {payment.type === "consultation_fee" ? (
            <Calendar className="w-5 h-5 text-blue-400" />
          ) : (
            <FileText className="w-5 h-5 text-purple-400" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-200 truncate">{payment.description}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] text-neutral-500">
              {new Date(payment.createdAt).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-[11px] text-neutral-600 capitalize">{payment.type?.replace("_", " ")}</span>
          </div>
        </div>

        {/* Timer for pending */}
        {isPending && payment.deadline && (
          <CountdownTimer
            deadline={payment.deadline}
            totalDuration={payment.deadline - payment.createdAt}
            variant="inline"
            showLabel={false}
          />
        )}

        {/* Amount & Status */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-sm font-bold font-mono ${
              isPending ? "text-amber-400" :
              payment.status === PaymentStatus.SUCCESS ? "text-emerald-400" :
              "text-neutral-400"
            }`}>
              LKR {payment.amount?.toLocaleString()}
            </p>
          </div>
          <StatusBadge status={payment.status} type="payment" size="xs" />
        </div>

        {/* Pay Button */}
        {isPending && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPay(payment);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-gold-btn text-dark-950 text-xs font-semibold hover:opacity-90 transition-opacity shadow-md flex-shrink-0"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Pay
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="px-5 pb-4 pt-0 border-t border-white/[0.04] mt-0">
          <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
            <div>
              <p className="text-neutral-500">Transaction ID</p>
              <p className="text-neutral-300 font-mono mt-0.5">{payment.id}</p>
            </div>
            <div>
              <p className="text-neutral-500">Type</p>
              <p className="text-neutral-300 capitalize mt-0.5">{payment.type?.replace("_", " ")}</p>
            </div>
            {payment.paidAt && (
              <div>
                <p className="text-neutral-500">Paid At</p>
                <p className="text-neutral-300 mt-0.5">
                  {new Date(payment.paidAt).toLocaleString("en-LK")}
                </p>
              </div>
            )}
            {payment.appointmentId && (
              <div>
                <p className="text-neutral-500">Appointment</p>
                <p className="text-neutral-300 font-mono mt-0.5">{payment.appointmentId}</p>
              </div>
            )}
            {payment.caseId && (
              <div>
                <p className="text-neutral-500">Case</p>
                <p className="text-neutral-300 font-mono mt-0.5">{payment.caseId}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MyPayments() {
  const { payments, appointments, confirmPayment } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentModal, setPaymentModal] = useState({ open: false, payment: null });

  // ── Financial Stats ────────────────────────────────────────
  const stats = useMemo(() => {
    const totalPaid = payments
      .filter((p) => p.status === PaymentStatus.SUCCESS)
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments
      .filter((p) => p.status === PaymentStatus.PENDING)
      .reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = payments.length;
    const pendingCount = payments.filter((p) => p.status === PaymentStatus.PENDING).length;

    return { totalPaid, totalPending, totalTransactions, pendingCount };
  }, [payments]);

  // ── Filter ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...payments];

    const tab = TABS.find((t) => t.id === activeTab);
    if (tab?.statuses) {
      result = result.filter((p) => tab.statuses.includes(p.status));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.description?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q) ||
          p.type?.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      if (a.status === PaymentStatus.PENDING && b.status !== PaymentStatus.PENDING) return -1;
      if (b.status === PaymentStatus.PENDING && a.status !== PaymentStatus.PENDING) return 1;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }, [payments, activeTab, searchQuery]);

  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach((tab) => {
      counts[tab.id] = tab.statuses
        ? payments.filter((p) => tab.statuses.includes(p.status)).length
        : payments.length;
    });
    return counts;
  }, [payments]);

  const handlePay = useCallback((payment) => {
    const apt = appointments.find((a) => a.id === payment.appointmentId);
    setPaymentModal({ open: true, payment, appointment: apt });
  }, [appointments]);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Payments</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Track all your consultation and case payments
        </p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={DollarSign}
          label="Total Paid"
          value={`LKR ${stats.totalPaid.toLocaleString()}`}
          subtext={`${stats.totalTransactions} transactions`}
          color="emerald"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={`LKR ${stats.totalPending.toLocaleString()}`}
          subtext={`${stats.pendingCount} awaiting`}
          color="amber"
        />
        <StatCard
          icon={Receipt}
          label="Transactions"
          value={stats.totalTransactions}
          subtext="All time"
          color="gold"
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value={`LKR ${payments
            .filter((p) => p.status === PaymentStatus.SUCCESS && p.paidAt > Date.now() - 30 * 86400000)
            .reduce((s, p) => s + p.amount, 0)
            .toLocaleString()}`}
          subtext="Last 30 days"
          color="gold"
        />
      </div>

      {/* Pending Alert */}
      {stats.pendingCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/15">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-300 font-medium">
              You have {stats.pendingCount} pending payment{stats.pendingCount > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-amber-400/60 mt-0.5">
              Complete payments before their deadlines to avoid cancellation
            </p>
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1 p-1 rounded-xl bg-dark-800/40 border border-white/[0.04]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-dark-700 text-gold-400 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
              }`}
            >
              {tab.label}
              {tabCounts[tab.id] > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  activeTab === tab.id ? "bg-gold-500/15 text-gold-400" : "bg-dark-600 text-neutral-500"
                }`}>
                  {tabCounts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payments…"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-800/40 border border-white/[0.06] text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Payment List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-4">
            <DollarSign className="w-7 h-7 text-neutral-600" />
          </div>
          <p className="text-neutral-400 font-medium">No payments found</p>
          <p className="text-sm text-neutral-600 mt-1">
            {searchQuery ? "Try adjusting your search" : "Payments will appear after booking consultations"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <PaymentRow key={p.id} payment={p} onPay={handlePay} />
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, payment: null })}
        payment={paymentModal.payment}
        appointment={paymentModal.appointment}
        onConfirmPayment={confirmPayment}
      />
    </div>
  );
}
