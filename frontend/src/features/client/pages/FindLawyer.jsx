/**
 * ══════════════════════════════════════════════════════════════
 * FIND LAWYER PAGE — Client Feature
 * ══════════════════════════════════════════════════════════════
 *
 * Premium lawyer directory page with:
 *  • Hero header with stats
 *  • Search bar with real-time filtering
 *  • Filter dropdowns (specialization, district, language)
 *  • Sort options
 *  • Active filter tags with clear
 *  • Responsive card grid (1 → 2 → 3 → 4 columns)
 *  • Skeleton loading states
 *  • Smooth staggered card animations
 *  • Empty state with CTA
 *  • Results count
 *  • Pagination-ready architecture
 *  • Cards clickable → navigate to /lawyers/:id
 *
 * Future API: GET /api/v1/lawyers?q=&spec=&district=&lang=&sort=
 */

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  MapPin,
  Scale,
  Globe,
  Users,
  ArrowUpDown,
  RotateCcw,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import LawyerCard from "../components/LawyerCard";
import {
  lawyers as allLawyers,
  specializations,
  districts,
} from "../data/mockClientData";

// ── Skeleton Loader ──────────────────────────────────────────
function LawyerCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-dark-800/50 border border-white/[0.06] animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-dark-600/60" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-dark-600/60 rounded-lg mb-2" />
          <div className="h-3 w-24 bg-dark-600/40 rounded-lg mb-1" />
          <div className="h-3 w-20 bg-dark-600/30 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-dark-600/40 rounded" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-dark-900/50">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-4 w-8 mx-auto bg-dark-600/40 rounded mb-1" />
            <div className="h-2 w-12 mx-auto bg-dark-600/30 rounded" />
          </div>
        ))}
      </div>
      <div className="h-3 w-full bg-dark-600/30 rounded-lg mb-2" />
      <div className="h-3 w-3/4 bg-dark-600/20 rounded-lg mb-4" />
      <div className="flex justify-between pt-4 border-t border-white/[0.04]">
        <div className="h-6 w-24 bg-dark-600/40 rounded" />
        <div className="h-10 w-28 bg-dark-600/40 rounded-xl" />
      </div>
    </div>
  );
}

// ── Filter Select ────────────────────────────────────────────
function FilterSelect({ label, icon: Icon, value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <label className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl text-sm text-neutral-200 bg-dark-600/50 border border-white/[0.08] hover:border-white/[0.12] focus:border-gold-500/40 focus:outline-none focus:shadow-[0_0_0_3px_rgba(198,167,94,0.1)] transition-all duration-200 cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={typeof opt === "string" ? opt : opt.value} value={typeof opt === "string" ? opt : opt.value}>
              {typeof opt === "string" ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
      </div>
    </div>
  );
}

// ── Sort Options ─────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "experience", label: "Most Experienced" },
  { value: "fee-low", label: "Fee: Low to High" },
  { value: "fee-high", label: "Fee: High to Low" },
  { value: "name", label: "Name A–Z" },
];

export default function FindLawyer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [specFilter, setSpecFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ── Filtering Logic ────────────────────────────────────────
  const filteredLawyers = useMemo(() => {
    let results = [...allLawyers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.specialization.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.bio.toLowerCase().includes(q)
      );
    }

    if (specFilter) {
      results = results.filter((l) => l.specialization === specFilter);
    }

    if (districtFilter) {
      results = results.filter((l) => l.district === districtFilter);
    }

    if (languageFilter) {
      results = results.filter((l) =>
        l.languages.some((lang) => lang.toLowerCase().includes(languageFilter.toLowerCase()))
      );
    }

    switch (sortBy) {
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        results.sort((a, b) => b.experience - a.experience);
        break;
      case "fee-low":
        results.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case "fee-high":
        results.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case "name":
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return results;
  }, [searchQuery, specFilter, districtFilter, languageFilter, sortBy]);

  const activeFiltersCount = [specFilter, districtFilter, languageFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSpecFilter("");
    setDistrictFilter("");
    setLanguageFilter("");
    setSortBy("rating");
  };

  const handleBook = (lawyer) => {
    navigate(`/dashboard/client/find-lawyer/${lawyer.lawyer_id}/book`);
  };

  // ── Page Stats ─────────────────────────────────────────────
  const verifiedCount = allLawyers.filter((l) => l.verified).length;
  const uniqueSpecs = new Set(allLawyers.map((l) => l.specialization)).size;
  const uniqueDistricts = new Set(allLawyers.map((l) => l.district)).size;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      {/* ── Hero Header ── */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-dark-800/40 border border-white/[0.06] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-500/20 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider">
              Legal Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-1">
            Find a Lawyer
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl">
            Connect with verified legal professionals across Sri Lanka. Browse specializations,
            read reviews, and book consultations.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-4 mt-5">
            {[
              { value: allLawyers.length, label: "Lawyers" },
              { value: verifiedCount, label: "Verified", icon: BadgeCheck },
              { value: uniqueSpecs, label: "Specializations" },
              { value: uniqueDistricts, label: "Districts" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                {stat.icon && <stat.icon className="w-3.5 h-3.5 text-gold-400" />}
                <span className="text-sm font-bold text-neutral-200">{stat.value}</span>
                <span className="text-xs text-neutral-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, specialization, or district…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm text-neutral-200 bg-dark-800/60 border border-white/[0.08] hover:border-white/[0.12] focus:border-gold-500/40 focus:outline-none focus:shadow-[0_0_0_3px_rgba(198,167,94,0.1)] transition-all duration-200 placeholder:text-neutral-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-dark-600 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium border transition-all duration-200 ${
            showFilters || activeFiltersCount > 0
              ? "bg-gold-500/10 border-gold-500/20 text-gold-400"
              : "bg-dark-800/60 border-white/[0.08] text-neutral-300 hover:border-white/[0.12]"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gold-500 text-dark-950 text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Filter Panel ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-dark-800/40 border border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FilterSelect
                  label="Specialization"
                  icon={Scale}
                  value={specFilter}
                  onChange={setSpecFilter}
                  options={specializations}
                  placeholder="All specializations"
                />
                <FilterSelect
                  label="District"
                  icon={MapPin}
                  value={districtFilter}
                  onChange={setDistrictFilter}
                  options={districts}
                  placeholder="All districts"
                />
                <FilterSelect
                  label="Language"
                  icon={Globe}
                  value={languageFilter}
                  onChange={setLanguageFilter}
                  options={["Sinhala", "Tamil", "English"]}
                  placeholder="All languages"
                />
                <FilterSelect
                  label="Sort By"
                  icon={ArrowUpDown}
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  placeholder="Sort by…"
                />
              </div>

              {/* Active Filter Tags */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                  <span className="text-[11px] text-neutral-500">Active:</span>
                  {specFilter && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gold-500/10 text-gold-400 border border-gold-500/20">
                      {specFilter}
                      <button onClick={() => setSpecFilter("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {districtFilter && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {districtFilter}
                      <button onClick={() => setDistrictFilter("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {languageFilter && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {languageFilter}
                      <button onClick={() => setLanguageFilter("")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="ml-auto flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results Header ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">
          <span className="text-neutral-200 font-semibold">{filteredLawyers.length}</span>{" "}
          lawyer{filteredLawyers.length !== 1 ? "s" : ""} found
        </p>
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
          <Users className="w-3.5 h-3.5" />
          Sorted by: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
        </div>
      </div>

      {/* ── Results Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <LawyerCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredLawyers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredLawyers.map((lawyer, index) => (
            <LawyerCard
              key={lawyer.lawyer_id}
              lawyer={lawyer}
              index={index}
              onBook={handleBook}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 px-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-dark-700/50 border border-white/[0.06] flex items-center justify-center mb-4">
            <Search className="w-7 h-7 text-neutral-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-300 mb-1">
            No lawyers found
          </h3>
          <p className="text-sm text-neutral-500 text-center max-w-sm mb-4">
            Try adjusting your search terms or filters to find the right legal professional.
          </p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-dark-700 text-neutral-300 border border-white/[0.06] hover:border-gold-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Clear all filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
