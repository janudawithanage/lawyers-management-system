import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Scale,
  Search,
} from "lucide-react";
import { TRUST_INDICATORS } from "../../constants";
import { Button, Container } from "../ui";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center gradient-hero overflow-hidden"
      aria-label="Hero"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Radial gold glow top-right */}
        <div className="absolute -top-40 -right-40 w-175 h-175 rounded-full bg-gold-500/4 blur-[120px]" />
        {/* Subtle center glow */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-gold-500/2 blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-2"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-dark-950 to-transparent" />
      </div>

      <Container className="relative z-10 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/6 backdrop-blur-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-neutral-400 font-medium">
                Trusted by 500+ verified lawyers across Sri Lanka
              </span>
            </motion.div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-neutral-50 leading-[1.1] mb-6 text-balance">
              Connecting You with{" "}
              <span className="gradient-gold-text">
                Verified Lawyers
              </span>{" "}
              Across Sri Lanka
            </h1>

            <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-xl">
              Find expert legal representation in your district and language. Book
              consultations, share documents securely, and track your case —
              all in one trusted platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Button variant="primary" size="lg" href="#search">
                <Search className="w-5 h-5" />
                Find a Lawyer
              </Button>
              <Button variant="secondary" size="lg" href="#register">
                Register as Lawyer
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRUST_INDICATORS.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="glass rounded-xl px-4 py-3 text-center"
                >
                  <div className="text-xl font-bold text-gold-400">
                    {item.value}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Visual card composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Hero image card — courtroom/legal themed */}
              <div className="relative rounded-3xl overflow-hidden border border-white/6 shadow-2xl shadow-black/50">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop&auto=format&q=80"
                  alt="Legal scales of justice on desk with legal books"
                  className="w-full h-[380px] object-cover"
                  loading="eager"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-dark-950 via-dark-950/40 to-transparent" />

                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl gradient-gold-btn flex items-center justify-center text-dark-950 font-bold text-lg shrink-0">
                        AP
                      </div>
                      <div className="flex-1">
                        <h3 className="text-neutral-50 font-semibold text-lg">
                          Ayesha Perera
                        </h3>
                        <p className="text-neutral-400 text-sm">
                          Attorney-at-Law • Family Law
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3.5 h-3.5 text-gold-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                          <span className="text-neutral-500 text-xs ml-1">4.9 (128)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge — BASL Verified */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 border border-emerald-400/30"
              >
                <ShieldCheck className="w-4 h-4 inline mr-1" />
                BASL Verified
              </motion.div>

              {/* Floating card — Documents */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 flex items-center gap-3 shadow-xl shadow-black/40"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-100">Documents Secured</div>
                  <div className="text-xs text-neutral-500">End-to-end encrypted</div>
                </div>
              </motion.div>

              {/* Floating card — BASL */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-8 -left-6 glass rounded-2xl p-4 flex items-center gap-3 shadow-xl shadow-black/40"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-100">BASL Compliant</div>
                  <div className="text-xs text-neutral-500">Verified credentials</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
