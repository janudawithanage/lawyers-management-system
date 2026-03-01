/**
 * ══════════════════════════════════════════════════════════════
 * LAWYER DETAILS PAGE — Client Feature
 * ══════════════════════════════════════════════════════════════
 *
 * Full-profile lawyer details page with:
 *  • Breadcrumb navigation (sticky)
 *  • Two-column layout (info panel + content)
 *  • Tabbed sections (Overview, Reviews, Cases)
 *  • LawyerInfoPanel sidebar with full profile
 *  • RatingStars & ReviewsList components
 *  • Case summary statistics
 *  • Book Appointment CTA
 *  • Back navigation
 *  • Smooth page entrance animation
 *  • Skeleton loading state
 *  • 404 state for invalid lawyer IDs
 *  • Mobile-responsive (stacked layout)
 *
 * Route: /dashboard/client/lawyers/:lawyerId
 * Future API: GET /api/v1/lawyers/:lawyerId
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Star,
  MessageSquare,
  Briefcase,
  BadgeCheck,
  ShieldAlert,
  Clock,
  Trophy,
  Target,
  Scale,
  FileText,
  Calendar,
  ArrowRight,
  Home,
} from "lucide-react";
import LawyerInfoPanel from "../components/LawyerInfoPanel";
import RatingStars from "../components/RatingStars";
import ReviewsList from "../components/ReviewsList";
import { lawyers } from "../data/mockClientData";

// ── Tab Configuration ────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "reviews", label: "Reviews", icon: MessageSquare },
  { id: "cases", label: "Cases Summary", icon: Briefcase },
];

// ── Skeleton ─────────────────────────────────────────────────
function DetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 animate-pulse">
      {/* Sidebar skeleton */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-dark-800/50 border border-white/[0.06]">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-2xl bg-dark-600/60 mb-4" />
            <div className="h-5 w-40 bg-dark-600/50 rounded mb-2" />
            <div className="h-3 w-24 bg-dark-600/40 rounded mb-3" />
            <div className="h-5 w-28 bg-dark-600/40 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 rounded-xl bg-dark-800/40 border border-white/[0.04]">
              <div className="h-4 w-6 mx-auto bg-dark-600/50 rounded mb-2" />
              <div className="h-5 w-8 mx-auto bg-dark-600/40 rounded" />
            </div>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06] space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-dark-600/50" />
              <div className="flex-1">
                <div className="h-2 w-14 bg-dark-600/40 rounded mb-1" />
                <div className="h-3 w-32 bg-dark-600/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-28 bg-dark-600/40 rounded-xl" />
          ))}
        </div>
        <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
          <div className="h-4 w-32 bg-dark-600/50 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-dark-600/30 rounded" />
            <div className="h-3 w-5/6 bg-dark-600/25 rounded" />
            <div className="h-3 w-4/6 bg-dark-600/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LawyerDetails() {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Find the lawyer
  const lawyer = useMemo(
    () => lawyers.find((l) => l.lawyer_id === lawyerId),
    [lawyerId]
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lawyerId]);

  const handleBook = (lawyer) => {
    navigate(`/dashboard/client/find-lawyer/${lawyer.lawyer_id}/book`);
  };

  const handleChat = (lawyer) => {
    console.log("Chat with:", lawyer.name);
  };

  // ── Success rate calc ──────────────────────────────────────
  const successRate = lawyer?.cases_total
    ? Math.round((lawyer.cases_won / lawyer.cases_total) * 100)
    : 0;

  // ── 404 State ──────────────────────────────────────────────
  if (!loading && !lawyer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 px-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-dark-700/50 border border-white/[0.06] flex items-center justify-center mb-4">
          <User className="w-7 h-7 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-neutral-300 mb-2">Lawyer not found</h2>
        <p className="text-sm text-neutral-500 text-center max-w-sm mb-6">
          The lawyer profile you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/dashboard/client/find-lawyer")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-gold-btn text-dark-950 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/35 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Directory
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      {/* ── Breadcrumb ── */}
      <nav className="sticky top-0 z-10 -mx-1 px-1 py-3 bg-dark-950/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Link
            to="/dashboard/client"
            className="hover:text-neutral-300 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link
            to="/dashboard/client/find-lawyer"
            className="hover:text-neutral-300 transition-colors"
          >
            Find Lawyer
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-300 font-medium truncate max-w-[200px]">
            {loading ? "Loading…" : lawyer?.name}
          </span>
        </div>
      </nav>

      {/* ── Loading State ── */}
      {loading ? (
        <DetailsSkeleton />
      ) : (
        /* ── Main Layout: Sidebar + Content ── */
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* ════════ LEFT: Info Panel ════════ */}
          <aside className="lg:sticky lg:top-20 lg:self-start space-y-6">
            <LawyerInfoPanel
              lawyer={lawyer}
              onBook={handleBook}
              onChat={handleChat}
            />
          </aside>

          {/* ════════ RIGHT: Content ════════ */}
          <main className="space-y-6 min-w-0">
            {/* ── Tab Bar ── */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-dark-800/40 border border-white/[0.06] overflow-x-auto scrollbar-thin">
              {TABS.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gold-500/15 text-gold-400 shadow-[0_0_12px_rgba(198,167,94,0.08)]"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-dark-700/40"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === "reviews" && lawyer.reviews?.length > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          activeTab === tab.id
                            ? "bg-gold-500/20 text-gold-300"
                            : "bg-dark-600 text-neutral-500"
                        }`}
                      >
                        {lawyer.reviews.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Tab Content ── */}
            <AnimatePresence mode="wait">
              {/* ═══════ OVERVIEW TAB ═══════ */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* About */}
                  <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
                    <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-gold-400" />
                      About
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {lawyer.bio}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        icon: Clock,
                        value: `${lawyer.experience} Years`,
                        label: "Experience",
                        accent: true,
                      },
                      {
                        icon: Trophy,
                        value: lawyer.cases_won,
                        label: "Cases Won",
                      },
                      {
                        icon: Target,
                        value: `${successRate}%`,
                        label: "Success Rate",
                      },
                      {
                        icon: Star,
                        value: lawyer.rating,
                        label: "Rating",
                        accent: true,
                      },
                    ].map((stat, i) => {
                      const StatIcon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.3 }}
                          className="flex flex-col items-center p-4 rounded-xl bg-dark-800/40 border border-white/[0.06]"
                        >
                          <StatIcon
                            className={`w-5 h-5 mb-2 ${stat.accent ? "text-gold-400" : "text-neutral-500"}`}
                          />
                          <p className="text-xl font-bold text-neutral-200">{stat.value}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                            {stat.label}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Specialization Details */}
                  <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
                    <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-gold-400" />
                      Practice Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 rounded-xl text-sm font-medium bg-gold-500/10 text-gold-400 border border-gold-500/20">
                        {lawyer.specialization}
                      </span>
                    </div>
                  </div>

                  {/* Latest Review Preview */}
                  {lawyer.reviews?.length > 0 && (
                    <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gold-400" />
                          Latest Review
                        </h3>
                        <button
                          onClick={() => setActiveTab("reviews")}
                          className="text-[11px] text-gold-400 hover:text-gold-300 font-medium transition-colors"
                        >
                          View all →
                        </button>
                      </div>
                      <div className="flex gap-3 p-4 rounded-xl bg-dark-900/30 border border-white/[0.04]">
                        <div className="w-9 h-9 rounded-xl bg-dark-600/60 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-neutral-400">
                            {lawyer.reviews[0].client_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-neutral-200">
                              {lawyer.reviews[0].client_name}
                            </span>
                            <RatingStars
                              rating={lawyer.reviews[0].rating}
                              size="sm"
                              showValue={false}
                            />
                          </div>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            "{lawyer.reviews[0].comment}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════ REVIEWS TAB ═══════ */}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewsList
                    reviews={lawyer.reviews || []}
                    rating={lawyer.rating}
                  />
                </motion.div>
              )}

              {/* ═══════ CASES TAB ═══════ */}
              {activeTab === "cases" && (
                <motion.div
                  key="cases"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Case Summary */}
                  <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
                    <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-5 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gold-400" />
                      Case Statistics
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Total Cases",
                          value: lawyer.cases_total || 0,
                          icon: FileText,
                          color: "text-neutral-200",
                        },
                        {
                          label: "Cases Won",
                          value: lawyer.cases_won,
                          icon: Trophy,
                          color: "text-emerald-400",
                        },
                        {
                          label: "Success Rate",
                          value: `${successRate}%`,
                          icon: Target,
                          color: "text-gold-400",
                        },
                        {
                          label: "Experience",
                          value: `${lawyer.experience}y`,
                          icon: Clock,
                          color: "text-blue-400",
                        },
                      ].map((stat, i) => {
                        const StatIcon = stat.icon;
                        return (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.06, duration: 0.3 }}
                            className="flex flex-col items-center p-4 rounded-xl bg-dark-900/40 border border-white/[0.04]"
                          >
                            <StatIcon className="w-5 h-5 text-neutral-500 mb-2" />
                            <p className={`text-2xl font-bold ${stat.color}`}>
                              {stat.value}
                            </p>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                              {stat.label}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Success Rate Progress */}
                  <div className="p-6 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
                    <h4 className="text-sm font-semibold text-neutral-300 mb-4">
                      Case Outcome Distribution
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-neutral-400">Won</span>
                          <span className="text-xs text-emerald-400 font-semibold">
                            {lawyer.cases_won}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-dark-600/60 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${successRate}%` }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-400"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-neutral-400">Other Outcomes</span>
                          <span className="text-xs text-neutral-500 font-semibold">
                            {(lawyer.cases_total || 0) - lawyer.cases_won}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-dark-600/60 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - successRate}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full rounded-full bg-linear-to-r from-dark-300 to-dark-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specialization note */}
                  <div className="p-5 rounded-2xl bg-gold-500/[0.04] border border-gold-500/10">
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      <span className="text-gold-400 font-semibold">{lawyer.name}</span> has
                      been practicing{" "}
                      <span className="text-neutral-200 font-medium">{lawyer.specialization}</span>{" "}
                      for {lawyer.experience} years with a proven track record of {successRate}%
                      success rate across {lawyer.cases_total || 0} cases handled.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Bottom CTA (mobile) ── */}
            <div className="lg:hidden pt-4 border-t border-white/[0.04]">
              <button
                onClick={() => handleBook(lawyer)}
                disabled={!lawyer.available}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  lawyer.available
                    ? "gradient-gold-btn text-dark-950 shadow-lg shadow-gold-500/20"
                    : "bg-dark-600 text-neutral-500 border border-white/[0.06] cursor-not-allowed"
                }`}
              >
                {lawyer.available ? (
                  <>
                    Book Appointment
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  "Currently Unavailable"
                )}
              </button>
            </div>
          </main>
        </div>
      )}
    </motion.div>
  );
}
