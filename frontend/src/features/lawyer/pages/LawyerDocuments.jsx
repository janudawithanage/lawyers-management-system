/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER DOCUMENTS — Document Management Hub
 * ══════════════════════════════════════════════════════════════
 *
 * Centralized document management for lawyers:
 *  • View all documents across cases
 *  • Upload new documents
 *  • Filter by case and type
 *  • Mock file interactions
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  Upload,
  Download,
  Trash2,
  FolderOpen,
  Eye,
  File,
  Image,
  Shield,
} from "lucide-react";
import { useAppStore } from "@/store/globalStore";

const MOCK_LAWYER_ID = "LWR-003";

export default function LawyerDocuments() {
  const { cases } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Aggregate all documents from all lawyer's cases
  const allDocuments = useMemo(() => {
    const myCases = cases.filter((c) => c.lawyerId === MOCK_LAWYER_ID);
    const docs = [];
    myCases.forEach((c) => {
      (c.documents || []).forEach((doc) => {
        docs.push({ ...doc, caseId: c.id, caseTitle: c.title });
      });
    });
    return docs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }, [cases]);

  const filtered = useMemo(() => {
    let result = allDocuments;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d) =>
        d.name?.toLowerCase().includes(q) ||
        d.caseTitle?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") {
      result = result.filter((d) => d.type === typeFilter);
    }
    return result;
  }, [allDocuments, searchQuery, typeFilter]);

  const types = useMemo(() => {
    const set = new Set(allDocuments.map((d) => d.type).filter(Boolean));
    return ["all", ...set];
  }, [allDocuments]);

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${(bytes / 1000).toFixed(0)} KB`;
  };

  const getFileIcon = (type) => {
    if (type === "pdf") return <FileText className="w-5 h-5 text-red-400" />;
    if (type === "docx") return <File className="w-5 h-5 text-blue-400" />;
    if (["jpg", "png"].includes(type)) return <Image className="w-5 h-5 text-purple-400" />;
    return <FileText className="w-5 h-5 text-neutral-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[#C6A75E]" />
            <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Practice</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Documents</h1>
          <p className="text-sm text-neutral-500 mt-1">All case documents in one place</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Files", value: allDocuments.length, icon: FolderOpen, color: "text-[#C6A75E] bg-[#C6A75E]/10" },
          { label: "PDFs", value: allDocuments.filter((d) => d.type === "pdf").length, icon: FileText, color: "text-red-400 bg-red-500/10" },
          { label: "Word Docs", value: allDocuments.filter((d) => d.type === "docx").length, icon: File, color: "text-blue-400 bg-blue-500/10" },
          { label: "Total Size", value: formatSize(allDocuments.reduce((s, d) => s + (d.size || 0), 0)), icon: Download, color: "text-emerald-400 bg-emerald-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}><s.icon className="w-4 h-4" /></div>
            <p className="text-xl font-bold text-neutral-100">{s.value}</p>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
            {types.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-[11px] font-medium capitalize transition-colors ${typeFilter === t ? "bg-[#C6A75E]/10 text-[#C6A75E]" : "text-neutral-500 hover:text-neutral-300"} border-r border-white/[0.04] last:border-r-0`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl bg-dark-800/40 border border-white/[0.06]">
          <FolderOpen className="w-10 h-10 text-neutral-600 mb-3" />
          <p className="text-neutral-400 font-medium">No documents found</p>
          <p className="text-xs text-neutral-600 mt-1">Upload documents from case detail pages</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group flex items-center gap-4 p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] hover:border-white/[0.10] transition-all">
              <div className="w-10 h-10 rounded-lg bg-dark-700/60 flex items-center justify-center flex-shrink-0">
                {getFileIcon(doc.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-200 truncate">{doc.name}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {doc.caseTitle} • {formatSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString("en-LK", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Eye className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg text-neutral-500 hover:text-[#C6A75E] hover:bg-[#C6A75E]/10 transition-colors"><Download className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
