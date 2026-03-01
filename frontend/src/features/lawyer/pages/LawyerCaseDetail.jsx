/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS — Lawyer Case Detail Page
 * ══════════════════════════════════════════════════════════════
 *
 * Full case management for a single case:
 *   • Overview tab — case info, progress, financials
 *   • Documents tab — upload/view/delete
 *   • Timeline tab — case events
 *   • Messages tab — attorney-client chat
 *   • Payments tab — request payments, view history
 *   • Case closure / termination actions
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Briefcase, FileText, Clock, MessageSquare,
  DollarSign, User, Scale, Upload, Trash2, Download,
  Send, CheckCircle, XCircle, AlertTriangle, Plus,
  ChevronRight, Calendar, TrendingUp, Shield, Lock,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { CaseStatus, PaymentStatus, CASE_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@utils/statusEnums";
import StatusBadge from "@components/common/StatusBadge";
import CountdownTimer from "@components/common/CountdownTimer";

const TABS = [
  { id: "overview", label: "Overview", icon: Briefcase },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "payments", label: "Payments", icon: DollarSign },
];

export default function LawyerCaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const {
    cases, payments,
    addDocumentToCase, removeDocumentFromCase,
    addMessageToCase, requestCasePayment,
    closeCase, terminateCase,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [terminateReason, setTerminateReason] = useState("");

  const caseData = useMemo(() => cases.find((c) => c.id === caseId), [cases, caseId]);
  const casePayments = useMemo(() => {
    return payments.filter((p) => p.caseId === caseId).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [payments, caseId]);

  if (!caseData) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200">
          <ArrowLeft className="w-4 h-4" /> Back to Cases
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <XCircle className="w-12 h-12 text-neutral-600 mb-4" />
          <p className="text-neutral-400 font-medium">Case not found</p>
        </div>
      </div>
    );
  }

  const c = caseData;
  const isClosed = [CaseStatus.CLOSED, CaseStatus.ENDED, CaseStatus.TERMINATED].includes(c.status);
  const outstanding = (c.totalFees || 0) - (c.paidAmount || 0);

  const handleClose = () => {
    closeCase(caseId);
    setShowCloseModal(false);
  };

  const handleTerminate = () => {
    terminateCase(caseId, terminateReason);
    setShowTerminateModal(false);
    setTerminateReason("");
  };

  return (
    <div className="space-y-6">
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate("/dashboard/lawyer/cases")}
        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-[#C6A75E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cases
      </button>

      {/* ── Case Header ── */}
      <div className="rounded-2xl bg-dark-800/40 border border-white/[0.06] p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C6A75E]/20 to-[#C6A75E]/5 border border-[#C6A75E]/10 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-[#C6A75E]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-neutral-100">{c.title}</h1>
              <StatusBadge status={c.status} type="case" size="sm" />
            </div>
            <p className="text-sm text-neutral-400 mt-1">{c.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{c.clientName}</span>
              <span className="flex items-center gap-1"><Scale className="w-3 h-3" />{c.caseType}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.createdAt).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span className="text-[10px] text-neutral-600 font-mono">{c.id}</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-dark-900/80 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${c.progress >= 100 ? "bg-emerald-400" : "bg-[#C6A75E]"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress || 0}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="text-sm font-bold text-neutral-300 w-10 text-right">{c.progress || 0}%</span>
            </div>
          </div>

          {/* Actions */}
          {!isClosed && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowCloseModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
              >
                Close Case
              </button>
              <button
                onClick={() => setShowTerminateModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                Terminate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#C6A75E]/15 text-[#C6A75E] border border-[#C6A75E]/25"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-dark-800/40 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "documents" && (c.documents || []).length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-700/50 text-neutral-400">
                  {(c.documents || []).length}
                </span>
              )}
              {tab.id === "messages" && (c.messages || []).length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-700/50 text-neutral-400">
                  {(c.messages || []).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <OverviewTab caseData={c} outstanding={outstanding} casePayments={casePayments} />}
          {activeTab === "documents" && <DocumentsTab caseData={c} caseId={caseId} addDocument={addDocumentToCase} removeDocument={removeDocumentFromCase} isClosed={isClosed} />}
          {activeTab === "timeline" && <TimelineTab caseData={c} />}
          {activeTab === "messages" && <MessagesTab caseData={c} caseId={caseId} addMessage={addMessageToCase} isClosed={isClosed} />}
          {activeTab === "payments" && <PaymentsTab caseData={c} caseId={caseId} casePayments={casePayments} requestPayment={requestCasePayment} isClosed={isClosed} />}
        </motion.div>
      </AnimatePresence>

      {/* ── Close Modal ── */}
      <AnimatePresence>
        {showCloseModal && (
          <Modal onClose={() => setShowCloseModal(false)}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-100">Close Case</h3>
                <p className="text-xs text-neutral-500">Mark this case as successfully resolved</p>
              </div>
            </div>
            <p className="text-sm text-neutral-300 mb-6">
              This will close <strong>"{c.title}"</strong> and mark it as 100% complete. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowCloseModal(false)} className="px-4 py-2 rounded-xl text-sm text-neutral-400 bg-dark-800 border border-white/[0.06]">Cancel</button>
              <button onClick={handleClose} className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25">Confirm Close</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Terminate Modal ── */}
      <AnimatePresence>
        {showTerminateModal && (
          <Modal onClose={() => setShowTerminateModal(false)}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-100">Terminate Case</h3>
                <p className="text-xs text-neutral-500">End this case due to non-compliance or non-payment</p>
              </div>
            </div>
            <textarea
              value={terminateReason}
              onChange={(e) => setTerminateReason(e.target.value)}
              placeholder="Reason for termination..."
              rows={3}
              className="w-full rounded-xl bg-dark-800 border border-white/[0.06] px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-red-500/30 resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowTerminateModal(false)} className="px-4 py-2 rounded-xl text-sm text-neutral-400 bg-dark-800 border border-white/[0.06]">Cancel</button>
              <button onClick={handleTerminate} className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25">Confirm Terminate</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  OVERVIEW TAB
// ══════════════════════════════════════════════════════════════

function OverviewTab({ caseData, outstanding, casePayments }) {
  const c = caseData;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Financial Summary */}
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#C6A75E]" /> Financial Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Total Fees</p>
              <p className="text-xl font-bold text-neutral-100">LKR {(c.totalFees || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Collected</p>
              <p className="text-xl font-bold text-emerald-400">LKR {(c.paidAmount || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Outstanding</p>
              <p className={`text-xl font-bold ${outstanding > 0 ? "text-amber-400" : "text-neutral-400"}`}>
                LKR {outstanding.toLocaleString()}
              </p>
            </div>
          </div>
          {c.nextPaymentDeadline && (
            <div className="mt-4 rounded-lg bg-amber-500/5 border border-amber-500/15 p-3 flex items-center justify-between">
              <span className="text-xs text-amber-400 font-medium">Payment deadline active</span>
              <CountdownTimer deadline={c.nextPaymentDeadline} variant="inline" showLabel={false} />
            </div>
          )}
        </div>

        {/* Case Details */}
        <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C6A75E]" /> Case Details
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">{c.description}</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <InfoRow label="Client" value={c.clientName} />
            <InfoRow label="Case Type" value={c.caseType} />
            <InfoRow label="Documents" value={`${(c.documents || []).length} files`} />
            <InfoRow label="Messages" value={`${(c.messages || []).length} messages`} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Recent Activity */}
        <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C6A75E]" /> Recent Activity
          </h3>
          <div className="space-y-2">
            {(c.timeline || []).slice(-4).reverse().map((event, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${event.status === "completed" ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span className="text-neutral-300 flex-1">{event.event}</span>
                <span className="text-neutral-600 font-mono">
                  {new Date(event.date).toLocaleDateString("en-LK", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-neutral-300 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#C6A75E]" /> Recent Payments
          </h3>
          {casePayments.length === 0 ? (
            <p className="text-xs text-neutral-600">No payments yet</p>
          ) : (
            <div className="space-y-2">
              {casePayments.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">LKR {p.amount.toLocaleString()}</span>
                  <StatusBadge status={p.status} type="payment" size="xs" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-neutral-600 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-sm text-neutral-200 font-medium">{value}</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  DOCUMENTS TAB
// ══════════════════════════════════════════════════════════════

function DocumentsTab({ caseData, caseId, addDocument, removeDocument, isClosed }) {
  const docs = caseData.documents || [];
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    const mockFiles = [
      { name: "Legal_Brief.pdf", size: 1500000, type: "pdf" },
      { name: "Court_Order.pdf", size: 2300000, type: "pdf" },
      { name: "Evidence_Summary.docx", size: 890000, type: "docx" },
      { name: "Witness_Statement.pdf", size: 1100000, type: "pdf" },
    ];
    const file = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    addDocument(caseId, file);
  };

  const formatSize = (bytes) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${(bytes / 1000).toFixed(0)} KB`;
  };

  return (
    <div className="space-y-4">
      {!isClosed && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      )}

      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <FileText className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No documents yet</p>
          <p className="text-xs text-neutral-600 mt-1">Upload case files and evidence</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] hover:border-white/[0.10] transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-200 truncate">{doc.name}</p>
                <p className="text-[11px] text-neutral-500">
                  {formatSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              {!isClosed && (
                <button
                  onClick={() => removeDocument(caseId, doc.id)}
                  className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  TIMELINE TAB
// ══════════════════════════════════════════════════════════════

function TimelineTab({ caseData }) {
  const timeline = (caseData.timeline || []).sort((a, b) => a.date - b.date);

  return (
    <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] p-6">
      {timeline.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <Clock className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No timeline events</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[17px] top-2 bottom-2 w-px bg-white/[0.06]" />
          <div className="space-y-6">
            {timeline.map((event, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className={`w-[35px] h-[35px] rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  event.status === "completed"
                    ? "bg-emerald-500/15 border border-emerald-500/25"
                    : "bg-amber-500/15 border border-amber-500/25"
                }`}>
                  {event.status === "completed" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-medium text-neutral-200">{event.event}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {new Date(event.date).toLocaleDateString("en-LK", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MESSAGES TAB
// ══════════════════════════════════════════════════════════════

function MessagesTab({ caseData, caseId, addMessage, isClosed }) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const messages = caseData.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    addMessage(caseId, messageText.trim(), "lawyer");
    setMessageText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-xl bg-dark-800/40 border border-white/[0.06] overflow-hidden">
      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-5 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-10 h-10 text-neutral-600 mb-3" />
            <p className="text-neutral-400 font-medium">No messages yet</p>
            <p className="text-xs text-neutral-600 mt-1">Start the conversation with your client</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "lawyer" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                msg.sender === "lawyer"
                  ? "bg-[#C6A75E]/15 border border-[#C6A75E]/20"
                  : "bg-dark-900/80 border border-white/[0.06]"
              }`}>
                <p className={`text-[11px] font-medium mb-1 ${
                  msg.sender === "lawyer" ? "text-[#C6A75E]" : "text-neutral-500"
                }`}>
                  {msg.sender === "lawyer" ? "You" : msg.senderName || "Client"}
                </p>
                <p className="text-sm text-neutral-200">{msg.text}</p>
                <p className="text-[10px] text-neutral-600 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isClosed && (
        <div className="border-t border-white/[0.06] p-4 flex gap-3">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to your client..."
            className="flex-1 bg-dark-900/60 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-[#C6A75E]/30"
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PAYMENTS TAB
// ══════════════════════════════════════════════════════════════

function PaymentsTab({ caseData, caseId, casePayments, requestPayment, isClosed }) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqAmount, setReqAmount] = useState("");
  const [reqDesc, setReqDesc] = useState("");

  const handleRequest = () => {
    const amount = parseInt(reqAmount, 10);
    if (!amount || amount <= 0) return;
    requestPayment(caseId, amount, reqDesc || "Additional case fee");
    setReqAmount("");
    setReqDesc("");
    setShowRequestForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Request Payment Button */}
      {!isClosed && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all"
          >
            <DollarSign className="w-4 h-4" /> Request Payment
          </button>
        </div>
      )}

      {/* Request Form */}
      <AnimatePresence>
        {showRequestForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-dark-800/60 border border-[#C6A75E]/15 p-5 space-y-3">
              <h4 className="text-sm font-semibold text-neutral-200">New Payment Request</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Amount (LKR)</label>
                  <input
                    type="number"
                    value={reqAmount}
                    onChange={(e) => setReqAmount(e.target.value)}
                    placeholder="E.g., 15000"
                    className="mt-1 w-full rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-[#C6A75E]/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-neutral-500 font-medium uppercase tracking-wide">Description</label>
                  <input
                    type="text"
                    value={reqDesc}
                    onChange={(e) => setReqDesc(e.target.value)}
                    placeholder="E.g., Court filing fees — Phase 2"
                    className="mt-1 w-full rounded-xl bg-dark-900 border border-white/[0.06] px-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-600 outline-none focus:border-[#C6A75E]/30"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowRequestForm(false)} className="px-4 py-2 rounded-xl text-sm text-neutral-400 bg-dark-800 border border-white/[0.06]">Cancel</button>
                <button onClick={handleRequest} className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#C6A75E]/15 text-[#C6A75E] border border-[#C6A75E]/20 hover:bg-[#C6A75E]/25">Send Request</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment History */}
      {casePayments.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <DollarSign className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No payments recorded</p>
        </div>
      ) : (
        <div className="space-y-2">
          {casePayments.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                p.status === PaymentStatus.SUCCESS ? "bg-emerald-500/10" : p.status === PaymentStatus.PENDING ? "bg-amber-500/10" : "bg-neutral-500/10"
              }`}>
                <DollarSign className={`w-5 h-5 ${
                  p.status === PaymentStatus.SUCCESS ? "text-emerald-400" : p.status === PaymentStatus.PENDING ? "text-amber-400" : "text-neutral-500"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-200">{p.description}</p>
                <p className="text-[11px] text-neutral-500">
                  {new Date(p.createdAt).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" })}
                  {p.paidAt && ` • Paid ${new Date(p.paidAt).toLocaleDateString("en-LK", { month: "short", day: "numeric" })}`}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-neutral-200">LKR {p.amount.toLocaleString()}</p>
                <StatusBadge status={p.status} type="payment" size="xs" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MODAL WRAPPER
// ══════════════════════════════════════════════════════════════

function Modal({ onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-dark-900 border border-white/[0.08] p-6"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
