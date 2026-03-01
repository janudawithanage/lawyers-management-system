/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS CASE DETAIL — Full Case View & Management
 * ══════════════════════════════════════════════════════════════
 *
 * Dedicated case detail page with:
 *  • Case overview header with status, progress, lawyer info
 *  • Tabbed sections: Overview, Documents, Timeline, Payments, Messages
 *  • Document upload with drag & drop
 *  • In-case messaging with simulated lawyer replies
 *  • Payment countdown & payment modal
 *  • End case / terminate flow
 *  • Back navigation to cases list
 *
 * Route: /dashboard/client/cases/:caseId
 * Connected to: useAppStore() for all state & actions
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Scale,
  FileText,
  Clock,
  DollarSign,
  MessageSquare,
  Upload,
  CloudUpload,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  CreditCard,
  Ban,
  Send,
  Trash2,
  Download,
  LayoutDashboard,
  User,
  Calendar,
  TrendingUp,
  Briefcase,
  ChevronRight,
  Eye,
  Paperclip,
  Info,
  CalendarPlus,
  ListChecks,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";
import { CaseStatus, PaymentStatus } from "@utils/statusEnums";
import StatusBadge from "@components/common/StatusBadge";
import CountdownTimer from "@components/common/CountdownTimer";
import PaymentModal from "../components/PaymentModal";
import FollowUpBookingModal from "../components/FollowUpBookingModal";

// ── Tab Config ───────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

// ── File Type Config ─────────────────────────────────────────

const FILE_TYPE_CONFIG = {
  pdf: { color: "text-red-400", bg: "bg-red-500/10", label: "PDF" },
  docx: { color: "text-blue-400", bg: "bg-blue-500/10", label: "DOCX" },
  xlsx: { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "XLSX" },
  jpg: { color: "text-amber-400", bg: "bg-amber-500/10", label: "JPG" },
  png: { color: "text-purple-400", bg: "bg-purple-500/10", label: "PNG" },
  zip: { color: "text-neutral-400", bg: "bg-neutral-500/10", label: "ZIP" },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getFileExtension(name) {
  return name?.split(".").pop()?.toLowerCase() || "file";
}

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDatetime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-LK", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ══════════════════════════════════════════════════════════════
//  UPLOAD PROGRESS ITEM
// ══════════════════════════════════════════════════════════════

function UploadProgressItem({ file, onComplete, onRemove }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("uploading");

  useEffect(() => {
    if (status !== "uploading") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("success");
          onComplete(file);
          return 100;
        }
        return prev + Math.random() * 18 + 8;
      });
    }, 180);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/[0.06]"
    >
      <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/15 flex items-center justify-center flex-shrink-0">
        <FileText className="w-4 h-4 text-gold-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-neutral-200 truncate pr-2">{file.name}</p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {status === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
            <button onClick={() => onRemove(file.name)} className="p-1 rounded hover:bg-dark-600 transition-colors">
              <X className="w-3.5 h-3.5 text-neutral-500" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-dark-600/80 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                status === "success" ? "bg-emerald-500" : "bg-linear-to-r from-gold-600 to-gold-400"
              }`}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-[10px] text-neutral-500 w-8 text-right">
            {status === "success" ? "Done" : `${Math.round(Math.min(progress, 100))}%`}
          </span>
        </div>
        <p className="text-[10px] text-neutral-600 mt-0.5">{formatFileSize(file.size)}</p>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
//  OVERVIEW TAB
// ══════════════════════════════════════════════════════════════

function OverviewTab({ caseData, relatedPayments }) {
  const isActive = caseData.status === CaseStatus.ACTIVE;
  const isPending = caseData.status === CaseStatus.PAYMENT_PENDING;
  const isOverdue = caseData.status === CaseStatus.OVERDUE;
  const dueAmount = (caseData.totalFees || 0) - (caseData.paidAmount || 0);

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
        <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-2">Case Description</h3>
        <p className="text-sm text-neutral-300 leading-relaxed">{caseData.description || "No description provided."}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Created</span>
          </div>
          <p className="text-sm text-neutral-200 font-medium">{formatDate(caseData.createdAt)}</p>
        </div>
        <div className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-neutral-500" />
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Documents</span>
          </div>
          <p className="text-sm text-neutral-200 font-medium">{caseData.documents?.length || 0} files</p>
        </div>
        <div className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-neutral-500" />
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Total Fees</span>
          </div>
          <p className="text-sm text-neutral-200 font-medium">LKR {caseData.totalFees?.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-neutral-500" />
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Progress</span>
          </div>
          <p className="text-sm text-neutral-200 font-medium">{caseData.progress}%</p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
        <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-4">Financial Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Total Fees</span>
            <span className="text-sm text-neutral-200 font-semibold">LKR {caseData.totalFees?.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Paid Amount</span>
            <span className="text-sm text-emerald-400 font-semibold">LKR {caseData.paidAmount?.toLocaleString()}</span>
          </div>
          {dueAmount > 0 && (
            <>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Outstanding</span>
                <span className={`text-sm font-semibold ${isOverdue ? "text-red-400" : "text-amber-400"}`}>
                  LKR {dueAmount.toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Warning */}
      {isPending && caseData.nextPaymentDeadline && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/10">
          <CreditCard className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-400 font-medium">Payment Due</p>
            <p className="text-xs text-amber-400/70 mt-0.5">Please complete payment before the deadline</p>
          </div>
          <CountdownTimer
            deadline={caseData.nextPaymentDeadline}
            totalDuration={7 * 24 * 3600000}
            variant="inline"
            showLabel={false}
          />
        </div>
      )}

      {isOverdue && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/[0.06] border border-red-500/10">
          <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse flex-shrink-0" />
          <div>
            <p className="text-sm text-red-400 font-medium">Payment Overdue</p>
            <p className="text-xs text-red-400/60 mt-0.5">
              Your case may be suspended if payment is not received promptly
            </p>
          </div>
        </div>
      )}

      {/* Lawyer Info */}
      <div className="p-5 rounded-xl bg-dark-800/40 border border-white/[0.06]">
        <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-3">Assigned Lawyer</h3>
        <div className="flex items-center gap-4">
          {caseData.lawyerAvatar ? (
            <img
              src={caseData.lawyerAvatar}
              alt={caseData.lawyerName}
              className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/[0.08]"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center ring-1 ring-gold-500/20">
              <User className="w-6 h-6 text-gold-400" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-neutral-100">{caseData.lawyerName}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{caseData.lawyerSpecialization || caseData.caseType}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  DOCUMENTS TAB
// ══════════════════════════════════════════════════════════════

function DocumentsTab({ caseData, onUpload, onRemoveDocument }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState([]);
  const fileInputRef = useRef(null);
  const isEditable = [CaseStatus.ACTIVE, CaseStatus.PAYMENT_PENDING].includes(caseData.status);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (isEditable) setIsDragging(true);
  }, [isEditable]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (!isEditable) return;
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [isEditable]
  );

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = "";
  };

  const handleFiles = (files) => {
    const valid = files.filter((f) => f.size <= MAX_FILE_SIZE);
    setUploading((prev) => [...prev, ...valid]);
  };

  const handleUploadComplete = useCallback(
    (file) => {
      onUpload({
        name: file.name,
        size: file.size,
        type: getFileExtension(file.name),
      });
      setTimeout(() => {
        setUploading((prev) => prev.filter((f) => f.name !== file.name));
      }, 1200);
    },
    [onUpload]
  );

  const removeUploadItem = (fileName) => {
    setUploading((prev) => prev.filter((f) => f.name !== fileName));
  };

  const documents = caseData.documents || [];

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {isEditable && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center py-10 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-gold-500/50 bg-gold-500/[0.06] shadow-[0_0_30px_rgba(198,167,94,0.1)]"
              : "border-white/[0.08] bg-dark-800/30 hover:border-gold-500/20 hover:bg-dark-800/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.xlsx,.jpg,.png,.zip"
            onChange={handleFileSelect}
            className="hidden"
          />
          <motion.div
            animate={isDragging ? { scale: 1.05, y: -4 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
                isDragging ? "bg-gold-500/20 border border-gold-500/30" : "bg-dark-700/50 border border-white/[0.06]"
              }`}
            >
              <CloudUpload className={`w-6 h-6 ${isDragging ? "text-gold-400" : "text-neutral-500"}`} />
            </div>
            <p className="text-sm font-medium text-neutral-200 mb-1">
              {isDragging ? "Drop files here" : "Drag & drop files to upload"}
            </p>
            <p className="text-xs text-neutral-500">or click to browse • Max 10MB per file</p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
              {Object.entries(FILE_TYPE_CONFIG).map(([ext, cfg]) => (
                <span key={ext} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                  .{ext}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Upload Progress */}
      <AnimatePresence>
        {uploading.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2"
          >
            <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-medium flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-gold-400" />
              Uploading ({uploading.length})
            </h3>
            {uploading.map((file) => (
              <UploadProgressItem
                key={file.name}
                file={file}
                onComplete={handleUploadComplete}
                onRemove={removeUploadItem}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
            Case Documents ({documents.length})
          </h3>
        </div>
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-neutral-400 font-medium text-sm">No documents yet</p>
            <p className="text-xs text-neutral-600 mt-1">
              {isEditable ? "Upload documents above to get started" : "No documents were added to this case"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => {
              const ext = getFileExtension(doc.name);
              const cfg = FILE_TYPE_CONFIG[ext] || FILE_TYPE_CONFIG.pdf;
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-dark-800/40 border border-white/[0.06] hover:border-white/[0.1] transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <FileText className={`w-4.5 h-4.5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-200 truncate">{doc.name}</p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">
                      {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-white/[0.04] text-neutral-500 hover:text-blue-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/[0.04] text-neutral-500 hover:text-emerald-400 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    {isEditable && (
                      <button
                        onClick={() => onRemoveDocument(doc.id)}
                        className="p-2 rounded-lg hover:bg-red-500/[0.06] text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cfg.bg} ${cfg.color} uppercase`}>
                    {cfg.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  TIMELINE TAB
// ══════════════════════════════════════════════════════════════

function TimelineTab({ caseData }) {
  const timeline = caseData.timeline || [];

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-3">
          <Clock className="w-6 h-6 text-neutral-600" />
        </div>
        <p className="text-neutral-400 font-medium text-sm">No timeline events</p>
        <p className="text-xs text-neutral-600 mt-1">Timeline events will appear as your case progresses</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[18px] top-3 bottom-3 w-px bg-dark-600/50" />

      <div className="space-y-0">
        {timeline.map((step, i) => {
          const isCompleted = step.status === "completed";
          const isUpcoming = step.status === "upcoming";
          const isCurrent = step.status === "current";

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 relative pb-6 last:pb-0"
            >
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0 mt-1">
                <div
                  className={`w-[10px] h-[10px] rounded-full ring-4 ring-dark-950 ${
                    isCompleted
                      ? "bg-emerald-400"
                      : isUpcoming || isCurrent
                      ? "bg-gold-400 animate-pulse"
                      : "bg-dark-500"
                  }`}
                />
              </div>

              {/* Content */}
              <div
                className={`flex-1 p-4 rounded-xl border transition-colors ${
                  isUpcoming || isCurrent
                    ? "bg-gold-500/[0.04] border-gold-500/10"
                    : isCompleted
                    ? "bg-dark-800/40 border-white/[0.06]"
                    : "bg-dark-800/20 border-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted
                        ? "text-neutral-200"
                        : isUpcoming || isCurrent
                        ? "text-gold-400"
                        : "text-neutral-500"
                    }`}
                  >
                    {step.event}
                  </p>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  {(isUpcoming || isCurrent) && <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />}
                </div>
                {step.date && (
                  <p className="text-[11px] text-neutral-500 mt-1">{formatDate(step.date)}</p>
                )}
                {step.description && (
                  <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">{step.description}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PAYMENTS TAB
// ══════════════════════════════════════════════════════════════

function PaymentsTab({ caseData, relatedPayments, onOpenPayment }) {
  const pendingPayment = relatedPayments.find((p) => p.status === PaymentStatus.PENDING);
  const isPending = caseData.status === CaseStatus.PAYMENT_PENDING;
  const isOverdue = caseData.status === CaseStatus.OVERDUE;

  return (
    <div className="space-y-6">
      {/* Pending Payment Alert */}
      {pendingPayment && (isPending || isOverdue) && (
        <div
          className={`p-4 rounded-xl border ${
            isOverdue ? "bg-red-500/[0.06] border-red-500/10" : "bg-amber-500/[0.06] border-amber-500/10"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${isOverdue ? "text-red-400" : "text-amber-400"} flex-shrink-0`} />
              <div>
                <p className={`text-sm font-medium ${isOverdue ? "text-red-400" : "text-amber-400"}`}>
                  {isOverdue ? "Payment Overdue" : "Payment Required"}
                </p>
                <p className={`text-xs mt-0.5 ${isOverdue ? "text-red-400/60" : "text-amber-400/60"}`}>
                  {pendingPayment.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {caseData.nextPaymentDeadline && !isOverdue && (
                <CountdownTimer
                  deadline={caseData.nextPaymentDeadline}
                  totalDuration={7 * 24 * 3600000}
                  variant="inline"
                  showLabel={false}
                />
              )}
              <button
                onClick={() => onOpenPayment(caseData, pendingPayment)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-gold-btn text-dark-950 text-xs font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pay LKR {pendingPayment.amount?.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div>
        <h3 className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-3">
          Payment History ({relatedPayments.length})
        </h3>
        {relatedPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-neutral-400 font-medium text-sm">No payments recorded</p>
          </div>
        ) : (
          <div className="space-y-2">
            {relatedPayments
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      p.status === PaymentStatus.SUCCESS
                        ? "bg-emerald-500/10"
                        : p.status === PaymentStatus.PENDING
                        ? "bg-amber-500/10"
                        : "bg-neutral-500/10"
                    }`}
                  >
                    <DollarSign
                      className={`w-5 h-5 ${
                        p.status === PaymentStatus.SUCCESS
                          ? "text-emerald-400"
                          : p.status === PaymentStatus.PENDING
                          ? "text-amber-400"
                          : "text-neutral-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-200 truncate">{p.description}</p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">
                      {formatDatetime(p.paidAt || p.createdAt)} • #{p.id.slice(-8)}
                    </p>
                  </div>
                  <StatusBadge status={p.status} type="payment" size="xs" />
                  <span className="text-sm text-neutral-200 font-mono font-semibold">
                    LKR {p.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MESSAGES TAB
// ══════════════════════════════════════════════════════════════

function MessagesTab({ caseData, onSendMessage }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messages = caseData.messages || [];
  const isActive = [CaseStatus.ACTIVE, CaseStatus.PAYMENT_PENDING].includes(caseData.status);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    if (!message.trim() || sending) return;
    setSending(true);
    onSendMessage(message.trim());
    setMessage("");
    setTimeout(() => setSending(false), 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-dark-600">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-neutral-400 font-medium text-sm">No messages yet</p>
            <p className="text-xs text-neutral-600 mt-1">
              {isActive ? "Send a message to your lawyer below" : "Messaging is closed for this case"}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isClient = msg.sender === "client";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isClient ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    isClient
                      ? "bg-gold-500/15 border border-gold-500/10 rounded-br-md"
                      : "bg-dark-800/60 border border-white/[0.06] rounded-bl-md"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isClient ? "text-gold-400" : "text-blue-400"
                      }`}
                    >
                      {msg.senderName || (isClient ? "You" : "Lawyer")}
                    </span>
                    <span className="text-[9px] text-neutral-600">
                      {new Date(msg.timestamp).toLocaleTimeString("en-LK", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {isActive && (
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                rows={1}
                className="w-full px-4 py-3 pr-10 rounded-xl bg-dark-800/60 border border-white/[0.08] text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/25 resize-none transition-colors"
              />
              <button
                className="absolute right-2 bottom-2 p-1.5 rounded-lg text-neutral-600 hover:text-neutral-400 hover:bg-white/[0.04] transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
                message.trim()
                  ? "gradient-gold-btn text-dark-950 shadow-md hover:opacity-90"
                  : "bg-dark-700 text-neutral-600 cursor-not-allowed"
              }`}
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
          <p className="text-[10px] text-neutral-600 mt-1.5 ml-1">Press Enter to send • Shift+Enter for new line</p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════

export default function CaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const {
    cases,
    payments,
    terminateCase,
    confirmPayment,
    addDocumentToCase,
    removeDocumentFromCase,
    addMessageToCase,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [showEndForm, setShowEndForm] = useState(false);
  const [endReason, setEndReason] = useState("");
  const [endReasonCategory, setEndReasonCategory] = useState("");
  const [paymentModal, setPaymentModal] = useState({ open: false, caseData: null, payment: null });
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  // Find the case
  const caseData = useMemo(() => cases.find((c) => c.id === caseId), [cases, caseId]);

  // Related payments
  const relatedPayments = useMemo(
    () => payments.filter((p) => p.caseId === caseId),
    [payments, caseId]
  );

  const pendingPayment = relatedPayments.find((p) => p.status === PaymentStatus.PENDING);

  const isActive = caseData?.status === CaseStatus.ACTIVE;
  const isPending = caseData?.status === CaseStatus.PAYMENT_PENDING;
  const isOverdue = caseData?.status === CaseStatus.OVERDUE;
  const isClosed = [CaseStatus.CLOSED, CaseStatus.ENDED, CaseStatus.TERMINATED].includes(caseData?.status);

  // Handlers
  const handleOpenPayment = useCallback((cd, payment) => {
    setPaymentModal({ open: true, caseData: cd, payment });
  }, []);

  const handleEndCase = useCallback(() => {
    const reason = endReasonCategory
      ? `[${endReasonCategory}] ${endReason}`.trim()
      : endReason;
    terminateCase(caseId, reason);
    setShowEndForm(false);
    setEndReason("");
    setEndReasonCategory("");
  }, [terminateCase, caseId, endReason, endReasonCategory]);

  const handleUploadDocument = useCallback(
    (doc) => {
      addDocumentToCase(caseId, doc);
    },
    [addDocumentToCase, caseId]
  );

  const handleRemoveDocument = useCallback(
    (docId) => {
      removeDocumentFromCase(caseId, docId);
    },
    [removeDocumentFromCase, caseId]
  );

  const handleSendMessage = useCallback(
    (text) => {
      addMessageToCase(caseId, text);
    },
    [addMessageToCase, caseId]
  );

  // ── 404 — Case not found ──────────────────────────────────
  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mb-5">
          <Scale className="w-9 h-9 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-neutral-200 mb-2">Case Not Found</h2>
        <p className="text-sm text-neutral-500 max-w-sm mb-6">
          The case you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/dashboard/client/cases"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-gold-btn text-dark-950 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Cases
        </Link>
      </div>
    );
  }

  const dueAmount = (caseData.totalFees || 0) - (caseData.paidAmount || 0);

  return (
    <div className="max-w-5xl space-y-6">
      {/* ── Back Button ─────────────────────────────────────── */}
      <button
        onClick={() => navigate("/dashboard/client/cases")}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-gold-400 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to My Cases
      </button>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Lawyer Avatar */}
          <div className="relative flex-shrink-0">
            {caseData.lawyerAvatar ? (
              <img
                src={caseData.lawyerAvatar}
                alt={caseData.lawyerName}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/[0.08]"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gold-500/10 flex items-center justify-center ring-2 ring-gold-500/20">
                <Scale className="w-7 h-7 text-gold-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-neutral-100 tracking-tight">{caseData.title}</h1>
                <p className="text-sm text-neutral-500 mt-1">
                  {caseData.lawyerName} • {caseData.caseType}
                </p>
                <p className="text-[10px] text-neutral-600 mt-1 font-mono">Case #{caseData.id}</p>
              </div>
              <StatusBadge status={caseData.status} type="case" size="md" />
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Case Progress</span>
                <span className="text-xs text-neutral-300 font-mono font-medium">{caseData.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-dark-600 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${caseData.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    caseData.progress === 100
                      ? "bg-emerald-400"
                      : caseData.progress > 60
                      ? "bg-gold-400"
                      : "bg-blue-400"
                  }`}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
              <span className="text-neutral-500">
                Total Fees: <span className="text-neutral-300 font-medium">LKR {caseData.totalFees?.toLocaleString()}</span>
              </span>
              <span className="text-neutral-500">
                Paid: <span className="text-emerald-400 font-medium">LKR {caseData.paidAmount?.toLocaleString()}</span>
              </span>
              {dueAmount > 0 && (
                <span className="text-neutral-500">
                  Due: <span className={`font-medium ${isOverdue ? "text-red-400" : "text-amber-400"}`}>
                    LKR {dueAmount.toLocaleString()}
                  </span>
                </span>
              )}
              <span className="text-neutral-500">
                Docs: <span className="text-neutral-300 font-medium">{caseData.documents?.length || 0}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-white/[0.04]">
          {pendingPayment && (isPending || isOverdue) && (
            <button
              onClick={() => handleOpenPayment(caseData, pendingPayment)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl gradient-gold-btn text-dark-950 text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              <CreditCard className="w-4 h-4" />
              Pay LKR {pendingPayment.amount?.toLocaleString()}
            </button>
          )}

          {isActive && (
            <Link
              to="/dashboard/client/messages"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-blue-400/70 hover:text-blue-400 hover:bg-blue-500/[0.06] transition-colors border border-blue-500/10"
            >
              <MessageSquare className="w-4 h-4" />
              Full Messages
            </Link>
          )}

          {isActive && (
            <button
              onClick={() => setShowFollowUpModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/[0.06] transition-colors border border-emerald-500/10"
            >
              <CalendarPlus className="w-4 h-4" />
              Book Follow-Up
            </button>
          )}

          {(isActive || isPending) && (
            <button
              onClick={() => setShowEndForm(!showEndForm)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors border border-red-500/10 ml-auto"
            >
              <Ban className="w-4 h-4" />
              End Case
            </button>
          )}
        </div>

        {/* End Case Form */}
        <AnimatePresence>
          {showEndForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-xl bg-red-500/[0.04] border border-red-500/10 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-red-400 font-medium">End Case Confirmation</p>
                    <p className="text-[11px] text-red-400/60 mt-0.5">
                      This action cannot be undone. Outstanding fees may still apply.
                    </p>
                  </div>
                </div>

                {/* Reason category selection */}
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium mb-2">
                    <ListChecks className="w-3 h-3 inline mr-1" />
                    Select a reason
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      "Case Resolved",
                      "Financial Reasons",
                      "Unsatisfied with Service",
                      "Personal Reasons",
                      "Found Alternative",
                      "Other",
                    ].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setEndReasonCategory(cat)}
                        className={`px-3 py-2 rounded-lg text-[11px] font-medium text-left transition-all border ${
                          endReasonCategory === cat
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : "border-white/[0.06] text-neutral-500 hover:border-white/[0.1] hover:text-neutral-400"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={endReason}
                  onChange={(e) => setEndReason(e.target.value)}
                  placeholder="Additional details (optional)…"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900/60 border border-white/[0.08] text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-red-500/30 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEndCase}
                    disabled={!endReasonCategory}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirm End Case
                  </button>
                  <button
                    onClick={() => { setShowEndForm(false); setEndReasonCategory(""); setEndReason(""); }}
                    className="px-4 py-2 rounded-lg text-neutral-500 text-xs hover:bg-white/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tabs ──────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl bg-dark-800/40 border border-white/[0.04] overflow-x-auto scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count =
            tab.id === "documents"
              ? caseData.documents?.length
              : tab.id === "payments"
              ? relatedPayments.length
              : tab.id === "messages"
              ? caseData.messages?.length
              : null;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-dark-700 text-gold-400 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    activeTab === tab.id ? "bg-gold-500/15 text-gold-400" : "bg-dark-600 text-neutral-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ──────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && <OverviewTab caseData={caseData} relatedPayments={relatedPayments} />}

          {activeTab === "documents" && (
            <DocumentsTab caseData={caseData} onUpload={handleUploadDocument} onRemoveDocument={handleRemoveDocument} />
          )}

          {activeTab === "timeline" && <TimelineTab caseData={caseData} />}

          {activeTab === "payments" && (
            <PaymentsTab caseData={caseData} relatedPayments={relatedPayments} onOpenPayment={handleOpenPayment} />
          )}

          {activeTab === "messages" && <MessagesTab caseData={caseData} onSendMessage={handleSendMessage} />}
        </motion.div>
      </AnimatePresence>

      {/* ── Payment Modal ────────────────────────────────── */}
      <PaymentModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, caseData: null, payment: null })}
        payment={paymentModal.payment}
        onConfirmPayment={confirmPayment}
      />

      {/* ── Follow-Up Booking Modal ──────────────────────── */}
      {caseData && (
        <FollowUpBookingModal
          isOpen={showFollowUpModal}
          onClose={() => setShowFollowUpModal(false)}
          caseData={caseData}
        />
      )}
    </div>
  );
}
