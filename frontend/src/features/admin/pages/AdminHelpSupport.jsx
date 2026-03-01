/**
 * ══════════════════════════════════════════════════════════════
 * ADMIN HELP & SUPPORT — FAQ, Contact & Resources
 * ══════════════════════════════════════════════════════════════
 *
 *  • Searchable FAQ accordion (admin / governance-specific)
 *  • Support contact options
 *  • Quick links to documentation
 *  • Report issue form
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  BookOpen,
  FileText,
  Shield,
  ExternalLink,
  Send,
  CheckCircle2,
  Server,
  Lock,
} from "lucide-react";

const FAQ_DATA = [
  { q: "How do I verify a new lawyer registration?", a: "Navigate to 'Verification' from the sidebar. Pending applications appear at the top. Review the submitted BASL credentials, NIC, and supporting documents. Click 'Approve' to verify or 'Reject' with a reason. The lawyer will be notified by email.", cat: "Verification" },
  { q: "What documents are required for lawyer verification?", a: "Lawyers must submit their BASL enrollment certificate, National Identity Card (NIC), a recent professional photograph, and proof of practice address. Optional documents include specialisation certificates and letters of good standing.", cat: "Verification" },
  { q: "How do I handle a client-lawyer dispute?", a: "Go to 'Disputes' from the sidebar. Open the dispute, review both parties' statements and any uploaded evidence. You can request additional info, mediate, or issue a ruling. Use 'Resolve' to close the dispute with a decision summary.", cat: "Disputes" },
  { q: "How do I escalate a dispute to the legal team?", a: "Open the dispute and click 'Escalate'. Select the reason for escalation, attach any relevant notes, and confirm. The legal review team will be notified and the dispute status will change to 'Escalated'.", cat: "Disputes" },
  { q: "How do I update platform system configuration?", a: "Navigate to 'System Config' from the sidebar. You can adjust payment timeouts, appointment windows, verification requirements, and other platform-wide settings. All changes are logged in the audit trail.", cat: "Configuration" },
  { q: "How do I suspend or reactivate a user account?", a: "Go to 'User Management' from the sidebar. Search for the user, then click their profile. Use 'Suspend Account' with a reason, or 'Reactivate' for previously suspended accounts. The user will be notified via email.", cat: "Users" },
  { q: "How do I view and export reports?", a: "Navigate to 'Reports' from the sidebar. Select the report type (financial, usage, verification, etc.), choose a date range, and click 'Generate'. Reports can be viewed on-screen or exported as PDF/CSV.", cat: "Reports" },
  { q: "How do I review audit logs?", a: "Go to 'Audit Logs' from the sidebar. Logs are displayed in reverse chronological order. Use the filters to narrow by action type, user, date range, or severity. Each entry shows the actor, action, timestamp, and affected resource.", cat: "Audit" },
  { q: "How do I manage platform notifications?", a: "Navigate to 'Notifications' from the sidebar. You can view all system notifications, mark them as read, or configure notification templates and triggers under 'Platform Settings'.", cat: "System" },
  { q: "How do I monitor payment transactions?", a: "Go to 'Payments' from the sidebar. The dashboard shows real-time transaction overview, pending settlements, and flagged payments. Use filters to find specific transactions by date, amount, or status.", cat: "Payments" },
  { q: "How do I update platform-wide settings?", a: "Navigate to 'Settings' from the sidebar. This includes general platform settings, email templates, payment gateway configuration, session timeouts, and maintenance mode controls.", cat: "Configuration" },
  { q: "What should I do if the system shows unusual activity?", a: "Check the Audit Logs for any suspicious entries. Review the Dashboard for anomaly indicators. If you suspect a security breach, enable maintenance mode from Settings, then contact the development team immediately.", cat: "System" },
  { q: "How do I reset a user's password?", a: "Go to 'User Management', find the user, and select 'Reset Password'. A password reset link will be sent to the user's registered email address. The old password is immediately invalidated.", cat: "Users" },
  { q: "How do I manage appointment monitoring?", a: "Navigate to 'Appointments' from the sidebar. You can view all platform appointments, filter by status (pending, confirmed, completed, cancelled), and intervene if there are scheduling conflicts or complaints.", cat: "System" },
];

const CATEGORIES = ["All", ...new Set(FAQ_DATA.map((f) => f.cat))];

const RESOURCES = [
  { title: "Admin Operations Guide", desc: "Complete admin workflow documentation", icon: BookOpen },
  { title: "BASL Compliance Guidelines", desc: "Bar Association standards & requirements", icon: FileText },
  { title: "Platform Security Policy", desc: "Security protocols & incident response", icon: Lock },
  { title: "System Architecture Docs", desc: "Technical platform documentation", icon: Server },
];

export default function AdminHelpSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [issueText, setIssueText] = useState("");
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  const filteredFaq = useMemo(() => {
    let result = FAQ_DATA;
    if (categoryFilter !== "All") result = result.filter((f) => f.cat === categoryFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    }
    return result;
  }, [searchQuery, categoryFilter]);

  const handleSubmitIssue = () => {
    if (!issueText.trim()) return;
    setIssueSubmitted(true);
    setIssueText("");
    setTimeout(() => setIssueSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Help & Support</h1>
        <p className="text-sm text-neutral-500 mt-1">Admin documentation, FAQs, and support channels</p>
      </div>

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: MessageCircle, label: "Live Chat", sub: "Priority admin support", color: "text-blue-400 bg-blue-500/10" },
          { icon: Mail, label: "Email Support", sub: "admin-support@basl-lms.lk", color: "text-emerald-400 bg-emerald-500/10" },
          { icon: Phone, label: "Emergency Line", sub: "+94 11 234 5600", color: "text-[#C6A75E] bg-[#C6A75E]/10" },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] hover:border-white/[0.10] transition-all cursor-pointer group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}><c.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100 transition-colors">{c.label}</p>
              <p className="text-[11px] text-neutral-500">{c.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* FAQ — Main Area */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-200">Frequently Asked Questions</h2>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search admin FAQs…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${categoryFilter === cat ? "bg-[#C6A75E]/10 text-[#C6A75E] border border-[#C6A75E]/20" : "text-neutral-500 border border-white/[0.06] hover:text-neutral-300"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-2">
            {filteredFaq.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-dark-800/40 border border-white/[0.06] text-center">
                <HelpCircle className="w-8 h-8 text-neutral-600 mb-2" />
                <p className="text-sm text-neutral-400">No matching FAQs found</p>
                <p className="text-xs text-neutral-600 mt-1">Try a different search term or category</p>
              </div>
            ) : (
              filteredFaq.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="rounded-xl bg-dark-800/40 border border-white/[0.06] overflow-hidden">
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="flex items-center justify-between w-full p-4 text-left">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-medium text-neutral-200">{faq.q}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium text-[#C6A75E]/70 bg-[#C6A75E]/5">{faq.cat}</span>
                    </div>
                    <motion.div animate={{ rotate: expandedFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-neutral-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                        <div className="px-4 pb-4 text-sm text-neutral-400 leading-relaxed border-t border-white/[0.04] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Resources */}
          <h2 className="text-lg font-semibold text-neutral-200">Resources</h2>
          <div className="space-y-2">
            {RESOURCES.map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }}
                className="group flex items-center gap-3 p-3 rounded-xl bg-dark-800/40 border border-white/[0.06] hover:border-white/[0.10] transition-all cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-[#C6A75E]/10 flex items-center justify-center"><r.icon className="w-4 h-4 text-[#C6A75E]" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200">{r.title}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{r.desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
              </motion.div>
            ))}
          </div>

          {/* Report Issue */}
          <h2 className="text-lg font-semibold text-neutral-200 pt-2">Report an Issue</h2>
          <div className="p-4 rounded-xl bg-dark-800/40 border border-white/[0.06] space-y-3">
            <textarea value={issueText} onChange={(e) => setIssueText(e.target.value)}
              placeholder="Describe the platform issue…" rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors resize-none" />
            <button onClick={handleSubmitIssue}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all">
              <Send className="w-4 h-4" /> Submit
            </button>
            {issueSubmitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Submitted! The team will investigate shortly.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
