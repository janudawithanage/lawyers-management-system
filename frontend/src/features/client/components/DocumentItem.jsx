/**
 * ══════════════════════════════════════════════════════════════
 * DOCUMENT ITEM — File Row / Card for Document Management
 * ══════════════════════════════════════════════════════════════
 *
 * Displays uploaded document with:
 *  • File type icon with color coding
 *  • File name & size
 *  • Associated case reference
 *  • Upload date & uploaded-by indicator
 *  • Review status badge
 *  • Download / Delete actions
 *  • Hover animation
 */

import { motion } from "framer-motion";
import {
  FileText,
  FileSpreadsheet,
  Image,
  Archive,
  Download,
  Trash2,
  Eye,
  User,
  Scale,
  Clock,
} from "lucide-react";
import { formatFileSize, formatRelativeTime } from "../data/mockClientData";

const FILE_ICON_MAP = {
  pdf: { icon: FileText, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/15" },
  docx: { icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/15" },
  xlsx: { icon: FileSpreadsheet, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  jpg: { icon: Image, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/15" },
  png: { icon: Image, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/15" },
  zip: { icon: Archive, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/15" },
};

const STATUS_CONFIG = {
  reviewed: {
    label: "Reviewed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  pending_review: {
    label: "Pending Review",
    color: "text-gold-400",
    bg: "bg-gold-500/10",
    border: "border-gold-500/20",
  },
  verified: {
    label: "Verified",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

export default function DocumentItem({ document, index = 0, onDownload, onDelete, onView }) {
  const fileConfig = FILE_ICON_MAP[document.fileType] || FILE_ICON_MAP.pdf;
  const FileIcon = fileConfig.icon;
  const statusConfig = STATUS_CONFIG[document.status] || STATUS_CONFIG.pending_review;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] transition-all duration-300 hover:bg-dark-700/40 hover:border-white/[0.1]"
    >
      {/* File Icon */}
      <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${fileConfig.bg} border ${fileConfig.border} flex items-center justify-center`}>
        <FileIcon className={`w-5 h-5 ${fileConfig.color}`} />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium text-neutral-200 truncate">
            {document.filename}
          </h4>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
          <span>{formatFileSize(document.fileSize)}</span>
          <span className="text-neutral-700">•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {formatRelativeTime(document.uploaded_at)}
          </span>
          {document.case_title && (
            <>
              <span className="text-neutral-700">•</span>
              <span className="flex items-center gap-1 text-neutral-400">
                <Scale className="w-2.5 h-2.5" />
                {document.case_id}
              </span>
            </>
          )}
          <span className="text-neutral-700">•</span>
          <span className="flex items-center gap-1">
            <User className="w-2.5 h-2.5" />
            {document.uploadedBy === "client" ? "You" : "Lawyer"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onView?.(document)}
          className="p-2 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-dark-600 transition-all"
          aria-label="View document"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDownload?.(document)}
          className="p-2 rounded-lg text-neutral-500 hover:text-gold-400 hover:bg-gold-500/10 transition-all"
          aria-label="Download document"
        >
          <Download className="w-4 h-4" />
        </button>
        {document.uploadedBy === "client" && (
          <button
            onClick={() => onDelete?.(document)}
            className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            aria-label="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
