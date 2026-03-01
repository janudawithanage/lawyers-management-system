/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS DOCUMENT UPLOAD — Store-Connected with Drag & Drop
 * ══════════════════════════════════════════════════════════════
 *
 * Connected to globalStore for case document management.
 * Features: drag & drop, file preview, upload animation,
 * per-case document grouping.
 */

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Image,
  File,
  Trash2,
  Eye,
  Download,
  Search,
  Briefcase,
  CheckCircle,
  X,
  FolderOpen,
} from "lucide-react";
import useClientStore from "../hooks/useClientStore";
import EmptyState from "@components/common/EmptyState";

const FILE_ICONS = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  jpg: Image,
  jpeg: Image,
  png: Image,
  default: File,
};

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

function getFileIcon(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || FILE_ICONS.default;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

// ── Upload Progress Item ─────────────────────────────────────

function UploadProgressItem({ file, progress, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-gold-500/5 border border-gold-500/10"
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gold-500/10 shrink-0">
        <Upload className="w-4 h-4 text-gold-400 animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-neutral-300 truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-gold-500/70 to-gold-400"
            />
          </div>
          <span className="text-[10px] text-neutral-500 tabular-nums">{progress}%</span>
        </div>
      </div>
      {progress < 100 && (
        <button onClick={onCancel} className="p-1 hover:bg-white/[0.06] rounded-lg">
          <X className="w-3 h-3 text-neutral-600" />
        </button>
      )}
      {progress >= 100 && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
    </motion.div>
  );
}

// ── Document Row ─────────────────────────────────────────────

function DocumentRow({ doc, onDelete }) {
  const FileIcon = getFileIcon(doc.name);
  const uploadDate = new Date(doc.uploadedAt).toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0">
        <FileIcon className="w-4 h-4 text-neutral-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-300 truncate">{doc.name}</p>
        <p className="text-[10px] text-neutral-600">
          {doc.size ? formatFileSize(doc.size) : "—"} • {uploadDate}
          {doc.uploadedBy && ` • by ${doc.uploadedBy}`}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onDelete && (
          <button
            onClick={() => onDelete(doc.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN DOCUMENT UPLOAD COMPONENT
// ══════════════════════════════════════════════════════════════

export default function DocumentUpload() {
  const { myCases, addDocumentToCase, removeDocumentFromCase } = useClientStore();
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploads, setUploads] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Cases with documents
  const casesWithDocs = useMemo(() => {
    return myCases.filter((c) => c.status !== "TERMINATED");
  }, [myCases]);

  // All documents across cases
  const allDocuments = useMemo(() => {
    return casesWithDocs.flatMap((c) =>
      (c.documents || []).map((d) => ({ ...d, caseName: c.title, caseId: c.id }))
    );
  }, [casesWithDocs]);

  const filteredDocs = useMemo(() => {
    let docs = selectedCaseId
      ? allDocuments.filter((d) => d.caseId === selectedCaseId)
      : allDocuments;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.caseName?.toLowerCase().includes(q)
      );
    }
    return docs.sort((a, b) => b.uploadedAt - a.uploadedAt);
  }, [allDocuments, selectedCaseId, searchQuery]);

  // ── Upload Simulation ──

  const simulateUpload = useCallback(
    (files) => {
      if (!selectedCaseId) {
        alert("Please select a case to upload documents to.");
        return;
      }

      const newUploads = files.map((file) => ({
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        file,
        progress: 0,
      }));

      setUploads((prev) => [...prev, ...newUploads]);

      newUploads.forEach((upload) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 25 + 10;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Add to store
            addDocumentToCase(selectedCaseId, {
              name: upload.file.name,
              type: upload.file.type,
              size: upload.file.size,
              uploadedBy: "Client",
            });

            // Remove from upload queue after animation
            setTimeout(() => {
              setUploads((prev) => prev.filter((u) => u.id !== upload.id));
            }, 1000);
          }

          setUploads((prev) =>
            prev.map((u) => (u.id === upload.id ? { ...u, progress: Math.min(100, Math.round(progress)) } : u))
          );
        }, 300);
      });
    },
    [selectedCaseId, addDocumentToCase]
  );

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f.size <= MAX_FILE_SIZE);
    if (files.length > 0) simulateUpload(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.size <= MAX_FILE_SIZE);
    if (files.length > 0) simulateUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDelete = (caseId, docId) => {
    removeDocumentFromCase(caseId, docId);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-neutral-100 mb-1">Documents</h1>
        <p className="text-sm text-neutral-500">Upload and manage documents for your cases</p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          isDragging
            ? "border-gold-500/50 bg-gold-500/5"
            : "border-white/[0.1] bg-white/[0.01] hover:border-white/[0.15]"
        }`}
      >
        <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${isDragging ? "text-gold-400" : "text-neutral-600"}`} />
        <p className="text-sm font-medium text-neutral-300 mb-1">
          {isDragging ? "Drop files here" : "Drag & drop files to upload"}
        </p>
        <p className="text-xs text-neutral-600 mb-4">PDF, DOC, DOCX, JPG, PNG — Max 25MB per file</p>

        <div className="flex items-center justify-center gap-3">
          {/* Case Selector */}
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-dark-800/60 border border-white/[0.08] text-xs text-neutral-300 focus:outline-none focus:border-gold-500/30"
          >
            <option value="">Select a case</option>
            {casesWithDocs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-gold-btn text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity">
            <Upload className="w-3.5 h-3.5" />
            Choose Files
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
            {uploads.map((u) => (
              <UploadProgressItem
                key={u.id}
                file={u.file}
                progress={u.progress}
                onCancel={() => setUploads((prev) => prev.filter((p) => p.id !== u.id))}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-gold-500/30"
          />
        </div>
        <select
          value={selectedCaseId}
          onChange={(e) => setSelectedCaseId(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-neutral-300 focus:outline-none focus:border-gold-500/30"
        >
          <option value="">All Cases</option>
          {casesWithDocs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Document List */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-semibold text-neutral-200">
              Documents ({filteredDocs.length})
            </span>
          </div>
        </div>

        {filteredDocs.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {filteredDocs.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                onDelete={(docId) => handleDelete(doc.caseId, docId)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No Documents"
            description={selectedCaseId ? "No documents in this case yet." : "Upload documents to your cases to see them here."}
          />
        )}
      </div>
    </div>
  );
}
