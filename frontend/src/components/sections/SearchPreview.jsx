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
} from "lucide-react";
import {
  SPECIALIZATIONS,
  DISTRICTS,
  LANGUAGE_OPTIONS,
  MOCK_LAWYERS,
} from "../../constants";
import { Button, Container, SectionHeading } from "../ui";

function SelectField({ icon: Icon, placeholder, options, value, onChange }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-10 py-4 rounded-xl bg-dark-600 border border-white/6 text-neutral-200 text-sm font-medium appearance-none cursor-pointer hover:border-gold-500/30 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none"
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

function LawyerCard({ lawyer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="surface-card rounded-2xl hover:surface-card-hover transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        {/* Top */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-gold-btn flex items-center justify-center text-dark-950 font-bold text-sm shrink-0">
              {lawyer.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <h4 className="font-semibold text-neutral-100 group-hover:text-gold-400 transition-colors">
                {lawyer.name}
              </h4>
              <p className="text-xs text-neutral-500">{lawyer.title}</p>
            </div>
          </div>
          {lawyer.verified && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Briefcase className="w-4 h-4 text-neutral-500" />
            {lawyer.specialization}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="w-4 h-4 text-neutral-500" />
            {lawyer.district}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Globe className="w-4 h-4 text-neutral-500" />
            {lawyer.languages.join(", ")}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-white/6">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
            <span className="text-sm font-semibold text-neutral-200">{lawyer.rating}</span>
            <span className="text-xs text-neutral-500">({lawyer.reviews})</span>
          </div>
          <span className="text-xs font-medium text-neutral-400 bg-white/4 px-3 py-1 rounded-full border border-white/6">
            {lawyer.experience}
          </span>
        </div>
      </div>

      <button className="w-full py-3 bg-gold-500/10 text-gold-400 text-sm font-semibold hover:bg-gold-500/20 border-t border-white/4 transition-colors cursor-pointer">
        View Profile
      </button>
    </motion.div>
  );
}

export default function SearchPreview() {
  const [specialization, setSpecialization] = useState("");
  const [district, setDistrict] = useState("");
  const [language, setLanguage] = useState("");

  return (
    <section id="search" className="py-20 lg:py-28 bg-dark-900" aria-label="Search lawyers">
      <Container>
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
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="bg-dark-700/50 rounded-2xl shadow-xl shadow-black/30 border border-white/6 p-3">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {MOCK_LAWYERS.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="md" href="#register">
            View All Lawyers
          </Button>
        </div>
      </Container>
    </section>
  );
}
