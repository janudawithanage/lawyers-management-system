/**
 * ══════════════════════════════════════════════════════════════
 * CLIENT HELP & SUPPORT — FAQ, Contact & Resources
 * ══════════════════════════════════════════════════════════════
 *
 *  • Searchable FAQ accordion
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
} from "lucide-react";

const FAQ_DATA = [
  { q: "How do I book a consultation with a lawyer?", a: 'Navigate to "Find a Lawyer" from the sidebar, browse or search for a lawyer by specialization, and click "Book Consultation" on their profile. Select an available time slot and confirm your appointment.', cat: "Appointments" },
  { q: "How long do I have to pay for a confirmed appointment?", a: "Once a lawyer confirms your appointment, you will have a limited time window to complete the payment. The remaining time is shown as a countdown timer on your appointment card. If payment is not received in time, the appointment may be automatically cancelled.", cat: "Payments" },
  { q: "What happens after my consultation?", a: "After a successful consultation, the lawyer may offer to convert it into a formal case. You'll receive a notification and can view the case under \"My Cases\". The lawyer will manage documents, milestones, and fees from their end.", cat: "Cases" },
  { q: "How do I upload documents to my case?", a: 'Go to "My Cases", open the relevant case, and navigate to the Documents tab. You can upload PDFs, images, and Word documents. All uploads are securely associated with your case.', cat: "Documents" },
  { q: "Can I message my lawyer directly?", a: 'Yes. Each case has a Messages tab where you can communicate with your assigned lawyer. Messages are case-specific and provide a clear record of your communication.', cat: "Communication" },
  { q: "How do I change my profile information?", a: 'Go to "Profile Settings" from the sidebar. You can update your personal details, contact information, and account preferences.', cat: "Account" },
  { q: "What payment methods are accepted?", a: "We support bank transfers, credit/debit cards, and mobile payment platforms. Payment details are provided when you confirm an appointment or respond to a case payment request.", cat: "Payments" },
  { q: "How do I track my case progress?", a: 'Open the case from "My Cases" and check the Overview tab. You\'ll see the current status, timeline of events, and any pending actions like payment requests.', cat: "Cases" },
  { q: "Can I cancel an appointment?", a: "You can cancel a pending appointment before the lawyer confirms it. Once confirmed and paid, cancellation is subject to the lawyer's cancellation policy. Contact support for assistance.", cat: "Appointments" },
  { q: "How do I find a lawyer specializing in a specific area?", a: 'Use the "Find a Lawyer" page and filter by specialization (e.g., Family Law, Criminal Law, Corporate Law). You can also filter by district, language, and rating.', cat: "Discovery" },
];

const CATEGORIES = ["All", ...new Set(FAQ_DATA.map((f) => f.cat))];

const RESOURCES = [
  { title: "Getting Started Guide", desc: "Learn the basics of using the platform", icon: BookOpen },
  { title: "Legal Terminology", desc: "Common legal terms explained simply", icon: FileText },
  { title: "Privacy Policy", desc: "How we handle and protect your data", icon: Shield },
];

export default function HelpSupport() {
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
          <HelpCircle className="w-4 h-4 text-[#C6A75E]" />
          <span className="text-[11px] font-semibold text-[#C6A75E]/70 uppercase tracking-wider">Support</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight">Help & Support</h1>
        <p className="text-sm text-neutral-500 mt-1">Find answers or contact our support team</p>
      </div>

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: MessageCircle, label: "Live Chat", sub: "Available 9 AM – 5 PM", color: "text-blue-400 bg-blue-500/10" },
          { icon: Mail, label: "Email Support", sub: "support@basl-lms.lk", color: "text-emerald-400 bg-emerald-500/10" },
          { icon: Phone, label: "Phone Support", sub: "+94 11 234 5678", color: "text-[#C6A75E] bg-[#C6A75E]/10" },
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
                placeholder="Search FAQs…"
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
              placeholder="Describe your issue…" rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.06] placeholder:text-neutral-600 focus:outline-none focus:border-[#C6A75E]/30 transition-colors resize-none" />
            <button onClick={handleSubmitIssue}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#C6A75E] to-[#B8963E] text-dark-950 hover:shadow-lg hover:shadow-[#C6A75E]/20 transition-all">
              <Send className="w-4 h-4" /> Submit
            </button>
            {issueSubmitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" /> Submitted! We'll get back to you soon.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
