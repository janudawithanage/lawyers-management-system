import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Globe,
  Star,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import {
  SPECIALIZATIONS,
  DISTRICTS,
  LANGUAGE_OPTIONS,
  MOCK_LAWYERS,
} from "../../constants";
import { Button, Container, SectionHeading } from "../ui";
import { getInitials } from "../../utils/formatters";

function SelectField({ icon: Icon, placeholder, options, value, onChange }) {
  return (
    <div className="relative group/select">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-hover/select:text-gold-400 pointer-events-none transition-colors duration-300" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-10 py-4 rounded-xl bg-dark-700 border border-white/6 text-neutral-200 text-sm font-medium appearance-none cursor-pointer hover:border-gold-500/30 hover:bg-dark-600 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 outline-none"
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
    </div>
  );
}

function LawyerCard({ lawyer, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.35 } }}
      className="relative rounded-[1.25rem] overflow-hidden group cursor-pointer"
    >
      {/* ── Large photo background ── */}
      <div className="relative h-72 sm:h-80 overflow-hidden">
        {lawyer.avatar ? (
          <img
            src={lawyer.avatar}
            alt={lawyer.name}
            className="w-full h-full object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full gradient-gold-btn flex items-center justify-center text-dark-950 font-bold text-5xl">
            {getInitials(lawyer.name)}
          </div>
        )}

        {/* Dark gradient overlay — bottom heavy for text readability */}
        <div
          className="absolute inset-0 bg-linear-to-t from-dark-950 via-dark-950/60 to-transparent"
          aria-hidden="true"
        />

        {/* Subtle side vignette */}
        <div
          className="absolute inset-0 bg-linear-to-r from-dark-950/30 via-transparent to-dark-950/30"
          aria-hidden="true"
        />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {lawyer.verified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-400/20 text-emerald-300 text-[11px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              BASL Verified
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-dark-950/50 backdrop-blur-md border border-white/8 text-xs font-medium text-neutral-200">
            <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
            {lawyer.rating}
          </span>
        </div>
      </div>

      {/* ── Content overlay — sits on top of the photo gradient ── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        {/* Name & title */}
        <h4 className="font-serif text-xl sm:text-[1.35rem] font-bold text-neutral-50 mb-0.5 group-hover:text-gold-300 transition-colors duration-300">
          {lawyer.name}
        </h4>
        <p className="text-xs text-gold-400/80 font-semibold uppercase tracking-wider mb-3">
          {lawyer.specialization}
        </p>

        {/* Key info chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-300 bg-white/6 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/6">
            <MapPin className="w-3 h-3 text-gold-400/70" />
            {lawyer.district}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-300 bg-white/6 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/6">
            <Briefcase className="w-3 h-3 text-gold-400/70" />
            {lawyer.experience}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-300 bg-white/6 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/6">
            <Globe className="w-3 h-3 text-gold-400/70" />
            {lawyer.languages.join(" · ")}
          </span>
        </div>

        {/* CTA */}
        <button className="w-full py-2.5 rounded-xl bg-gold-500/12 backdrop-blur-md text-gold-400 text-sm font-semibold hover:bg-gold-500/20 border border-gold-500/20 hover:border-gold-500/35 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group/btn">
          View Profile
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Card border — subtle, gold on hover */}
      <div className="absolute inset-0 rounded-[1.25rem] border border-white/6 group-hover:border-gold-500/25 transition-colors duration-500 pointer-events-none" />

      {/* Hover glow ring */}
      <div className="absolute inset-0 rounded-[1.25rem] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] group-hover:shadow-[inset_0_1px_0_0_rgba(198,167,94,0.15),0_8px_40px_-8px_rgba(0,0,0,0.5)] transition-shadow duration-500 pointer-events-none" />
    </motion.div>
  );
}

export default function SearchPreview() {
  const [specialization, setSpecialization] = useState("");
  const [district, setDistrict] = useState("");
  const [language, setLanguage] = useState("");

  return (
    <section id="search" className="py-24 lg:py-32 bg-dark-900 relative overflow-hidden" aria-label="Search lawyers">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gold-500/[0.02] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-500/[0.015] rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <SectionHeading
          badge="Find Your Lawyer"
          title="Search Verified Lawyers Across Sri Lanka"
          subtitle="Filter by specialization, district, and language to find the perfect legal expert for your needs."
        />

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="bg-dark-800/60 rounded-2xl shadow-2xl shadow-black/20 border border-white/6 p-3 backdrop-blur-md">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <SelectField
                icon={Briefcase}
                placeholder="Specialization"
                options={SPECIALIZATIONS}
                value={specialization}
                onChange={setSpecialization}
              />
              <SelectField
                icon={MapPin}
                placeholder="District"
                options={DISTRICTS}
                value={district}
                onChange={setDistrict}
              />
              <SelectField
                icon={Globe}
                placeholder="Language"
                options={LANGUAGE_OPTIONS}
                value={language}
                onChange={setLanguage}
              />
              <Button variant="primary" size="lg" className="w-full rounded-xl">
                <Search className="w-5 h-5" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Lawyer Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {MOCK_LAWYERS.map((lawyer, idx) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} index={idx} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Button variant="outline" size="md" href="#register">
            View All Lawyers
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
