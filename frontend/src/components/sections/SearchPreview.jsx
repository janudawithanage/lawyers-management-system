import { useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  Globe,
  Star,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  X,
  SearchX,
} from "lucide-react";
import {
  SPECIALIZATIONS,
  DISTRICTS,
  LANGUAGE_OPTIONS,
  MOCK_LAWYERS,
} from "../../constants";
import { Button, Container, SectionHeading } from "../ui";
import { getInitials } from "../../utils/formatters";

/**
 * SearchPreview — The primary conversion path on the landing page.
 *
 * The filters here now actually filter. Previously the three selects and the
 * Search button were decorative: changing them did nothing, the markup was a
 * div rather than a form so Enter did nothing either, and the same three
 * lawyers showed regardless. A search control that visibly ignores input is
 * worse than no search control — it's the moment a visitor stops trusting the
 * rest of the page.
 *
 * Behaviour:
 *  • Results filter live as each select changes — immediate feedback beats
 *    making people hunt for a submit button.
 *  • It is still a real <form role="search"> with an onSubmit, so Enter works
 *    and the control is announced as a search landmark.
 *  • The result count lives in an aria-live region, because for a screen
 *    reader user a silently changing grid is indistinguishable from a broken one.
 *  • Active filters appear as individually removable chips, and there is an
 *    empty state — now reachable, so it has to exist.
 */

function SelectField({ icon: Icon, label, options, value, onChange }) {
  const id = useId();

  return (
    <div className="relative group/select">
      {/* A placeholder is not a label: it disappears on selection and is not
          reliably announced. Real label, visually hidden. */}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-hover/select:text-gold-400 pointer-events-none transition-colors duration-300"
        aria-hidden="true"
      />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-12 pr-10 py-4 rounded-xl bg-dark-700 border text-sm font-medium appearance-none cursor-pointer hover:bg-dark-600 outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
          value
            ? "border-gold-500/40 text-neutral-100"
            : "border-white/10 text-neutral-300 hover:border-gold-500/30"
        }`}
      >
        {/* Options inherit the OS widget styling in most browsers, so set the
            colours explicitly or the open dropdown flashes white-on-white. */}
        <option value="" className="bg-dark-700 text-neutral-400">
          {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-dark-700 text-neutral-100">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

function FilterChip({ label, value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/25 text-xs font-medium text-gold-300">
      <span className="text-gold-500/70">{label}:</span>
      {value}
      <button
        type="button"
        onClick={onRemove}
        /* The accessible name has to name the filter being cleared — six
           buttons all called "Remove" are useless in a screen-reader
           element list. */
        aria-label={`Clear ${label} filter: ${value}`}
        className="ml-0.5 p-1 rounded-full text-gold-400/70 hover:text-gold-200 hover:bg-gold-500/20 outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 transition-colors cursor-pointer"
      >
        <X className="w-3 h-3" aria-hidden="true" />
      </button>
    </span>
  );
}

function LawyerCard({ lawyer, index }) {
  const reduceMotion = useReducedMotion();
  const headingId = `lawyer-${lawyer.id}-name`;

  return (
    <motion.article
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: reduceMotion ? 0 : Math.min(index * 0.08, 0.32),
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-labelledby={headingId}
      /* `group` drives the hover states; `focus-within` mirrors every one of
         them for keyboard users, who previously got no hover feedback at all. */
      className="relative rounded-[1.25rem] overflow-hidden group transition-transform duration-300 hover:-translate-y-2 focus-within:-translate-y-2 motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0"
    >
      {/* ── Portrait ── */}
      <div className="relative h-72 sm:h-80 overflow-hidden bg-dark-800">
        {lawyer.avatar ? (
          <img
            src={lawyer.avatar}
            alt=""
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out motion-reduce:group-hover:scale-100"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-serif font-bold text-5xl text-gold-500/35 bg-linear-to-br from-dark-700 to-dark-800"
            aria-hidden="true"
          >
            {getInitials(lawyer.name)}
          </div>
        )}

        {/* Readability scrim for the overlaid text below. */}
        <div
          className="absolute inset-0 bg-linear-to-t from-dark-950 via-dark-950/75 to-transparent"
          aria-hidden="true"
        />

        {/* Status badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          {lawyer.verified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-400/25 text-emerald-200 text-[11px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              BASL Verified
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-dark-950/70 backdrop-blur-md border border-white/10 text-xs font-medium text-neutral-100">
            <Star className="w-3 h-3 text-gold-400 fill-gold-400" aria-hidden="true" />
            {lawyer.rating}
            <span className="sr-only">out of 5, from {lawyer.reviews} reviews</span>
            <span className="text-neutral-400 font-normal" aria-hidden="true">
              ({lawyer.reviews})
            </span>
          </span>
        </div>
      </div>

      {/* ── Details ── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <h4
          id={headingId}
          className="font-serif text-xl sm:text-[1.35rem] font-bold text-neutral-50 mb-0.5 group-hover:text-gold-200 transition-colors duration-300"
        >
          {lawyer.name}
        </h4>
        <p className="text-xs text-gold-300 font-semibold uppercase tracking-wider mb-3">
          {lawyer.specialization}
        </p>

        <ul className="flex flex-wrap items-center gap-2 mb-4 list-none">
          {[
            { Icon: MapPin, text: lawyer.district, label: "District" },
            { Icon: Briefcase, text: lawyer.experience, label: "Experience" },
            { Icon: Globe, text: lawyer.languages.join(" · "), label: "Languages" },
          ].map(({ Icon, text, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-200 bg-white/8 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10"
            >
              <Icon className="w-3 h-3 text-gold-400" aria-hidden="true" />
              <span className="sr-only">{label}: </span>
              {text}
            </li>
          ))}
        </ul>

        {/* Visual affordance only — the real link is the overlay below, so
            there is exactly one tab stop and one accessible name per card.
            Its states are driven by the card's `group`. */}
        <span className="w-full py-2.5 rounded-xl bg-gold-500/15 backdrop-blur-md text-gold-200 text-sm font-semibold border border-gold-500/25 transition-all duration-300 flex items-center justify-center gap-2 group-hover:bg-gold-500/25 group-hover:border-gold-500/40 group-focus-within:bg-gold-500/25 group-focus-within:border-gold-500/40">
          View profile
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            aria-hidden="true"
          />
        </span>
      </div>

      {/* The card's single link, covering the whole surface.
          Replaces a cursor-pointer <div> that wrapped a <button> — that
          combination was unreachable by keyboard, announced nothing useful,
          and gave three identical "View Profile" buttons with no indication
          of whose profile they opened. */}
      <a
        href={`/lawyers/${lawyer.id}`}
        className="absolute inset-0 z-20 rounded-[1.25rem] outline-none focus-visible:ring-focus-card"
      >
        <span className="sr-only">View profile of {lawyer.name}</span>
      </a>

      {/* Border + focus ring */}
      <div
        className="absolute inset-0 rounded-[1.25rem] border border-white/8 group-hover:border-gold-500/30 group-focus-within:border-gold-500/50 transition-colors duration-500 pointer-events-none"
        aria-hidden="true"
      />
    </motion.article>
  );
}

const FILTER_META = [
  { key: "specialization", label: "Specialization", icon: Briefcase, options: SPECIALIZATIONS },
  { key: "district", label: "District", icon: MapPin, options: DISTRICTS },
  { key: "language", label: "Language", icon: Globe, options: LANGUAGE_OPTIONS },
];

const EMPTY_FILTERS = { specialization: "", district: "", language: "" };

export default function SearchPreview() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const headingId = useId();

  const setFilter = (key) => (value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const results = useMemo(
    () =>
      MOCK_LAWYERS.filter(
        (l) =>
          (!filters.specialization || l.specialization === filters.specialization) &&
          (!filters.district || l.district === filters.district) &&
          (!filters.language || l.languages.includes(filters.language))
      ),
    [filters]
  );

  const activeFilters = FILTER_META.filter((f) => filters[f.key]);
  const hasFilters = activeFilters.length > 0;

  return (
    <section
      id="search"
      className="py-20 lg:py-28 bg-dark-900 relative overflow-hidden"
      aria-labelledby={headingId}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gold-500/[0.02] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-500/[0.015] rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <SectionHeading
          id={headingId}
          badge="Find Your Lawyer"
          title="Search Verified Lawyers Across Sri Lanka"
          subtitle="Filter by specialization, district, and language to find the right legal expert for your needs."
          maxWidth="max-w-3xl"
        />

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <form
            role="search"
            aria-label="Search verified lawyers"
            onSubmit={(e) => e.preventDefault()}
            className="bg-dark-800/70 rounded-2xl shadow-2xl shadow-black/30 border border-white/8 p-3 backdrop-blur-md"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {FILTER_META.map(({ key, label, icon, options }) => (
                <SelectField
                  key={key}
                  icon={icon}
                  label={label}
                  options={options}
                  value={filters[key]}
                  onChange={setFilter(key)}
                />
              ))}
              <Button type="submit" variant="primary" size="lg" className="w-full rounded-xl">
                <Search className="w-5 h-5" aria-hidden="true" />
                Search
              </Button>
            </div>
          </form>

          {/* ── Result summary + active filters ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 mb-10">
            {/* Announced on change — otherwise the grid silently swaps under
                a screen reader with no indication anything happened. */}
            <p className="text-sm text-neutral-400" aria-live="polite" role="status">
              {results.length === 0 ? (
                "No lawyers match these filters"
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-neutral-100">
                    {results.length}
                  </span>{" "}
                  {results.length === 1 ? "lawyer" : "lawyers"}
                  {hasFilters ? " matching your filters" : " from our directory"}
                </>
              )}
            </p>

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.map(({ key, label }) => (
                  <FilterChip
                    key={key}
                    label={label}
                    value={filters[key]}
                    onRemove={() => setFilter(key)("")}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="text-xs font-semibold text-neutral-400 hover:text-gold-300 underline decoration-dotted underline-offset-4 px-2 py-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Results ── */}
        {results.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {results.map((lawyer, idx) => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} index={idx} />
            ))}
          </div>
        ) : (
          /* An empty state is only optional while it's unreachable. Now that
             the filters work, it needs to say what happened and offer the way
             out rather than leaving a blank hole in the page. */
          <div className="max-w-md mx-auto text-center py-14 px-6 rounded-2xl border border-dashed border-white/10 bg-dark-800/40">
            <div
              className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-5"
              aria-hidden="true"
            >
              <SearchX className="w-7 h-7 text-gold-400" />
            </div>
            <h3 className="font-serif text-xl font-bold text-neutral-50 mb-2">
              No matches in this combination
            </h3>
            <p className="text-sm text-neutral-400 mb-6 measure-tight mx-auto">
              Our directory is growing across all 25 districts. Try widening one
              of your filters, or register to be notified as new lawyers join.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear all filters
              </Button>
              <Button variant="ghost" size="sm" href="/register">
                Notify me
              </Button>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <Button variant="outline" size="md" href="/register">
              Browse all verified lawyers
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
