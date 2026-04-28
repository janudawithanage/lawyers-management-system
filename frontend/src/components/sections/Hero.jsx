import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Scale,
  Search,
  Star,
} from "lucide-react";
import { TRUST_INDICATORS } from "../../constants";
import { Button, Container, Badge } from "../ui";
import { OptimizedImage, ParticleField, FloatingScale3D } from "../common";
import { IMAGES } from "../../config/images";

/* ─── Animation Variants ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay },
});

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const scaleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
      style={{
        background:
          "linear-gradient(160deg, #0A0A0B 0%, #0D0D0F 30%, #111113 60%, #0B0B0D 100%)",
      }}
    >
      {/* ── Atmospheric Background with Parallax ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ y: bgY }}
      >
        {/* Primary gold orb — top right */}
        <div
          className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(198,167,94,0.09) 0%, rgba(198,167,94,0.03) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Secondary gold orb — bottom left */}
        <div
          className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(198,167,94,0.06) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* Center warmth */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(198,167,94,0.025) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── Interactive Particle Constellation ── */}
        <ParticleField particleCount={35} connectionDistance={120} />

        {/* Animated grid overlay with scroll fade */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: gridOpacity,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          }}
        />

        {/* Noise texture for depth */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Bottom fade to next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-56"
          style={{
            background:
              "linear-gradient(to top, #111214 0%, rgba(17,18,20,0.7) 50%, transparent 100%)",
          }}
        />
      </motion.div>

      <Container className="relative z-10 pt-32 pb-24">
        <motion.div
          className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center"
          style={{ y: contentY }}
        >

          {/* ── LEFT COLUMN — Copy ── */}
          <div>
            {/* Eyebrow badge */}
            <motion.div {...fadeIn(0.1)} className="mb-7">
              <span
                className="inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.18em] uppercase"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(198,167,94,0.12), rgba(198,167,94,0.05))",
                  border: "1px solid rgba(198,167,94,0.22)",
                  color: "#C6A75E",
                  borderRadius: "100px",
                  padding: "8px 18px",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{ boxShadow: "0 0 6px rgba(52,211,153,0.8)" }}
                />
                Bar Association of Sri Lanka — Verified Platform
              </span>
            </motion.div>

            {/* Gold divider line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "3rem", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-px mb-7"
              style={{
                background:
                  "linear-gradient(90deg, #C6A75E, rgba(198,167,94,0.2))",
              }}
            />

            {/* H1 — Headline */}
            <motion.h1
              {...fadeUp(0.25)}
              className="font-serif font-bold leading-[1.08] text-balance mb-7"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.85rem)",
                color: "#F5F5F5",
                letterSpacing: "-0.02em",
              }}
            >
              Connecting You With{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #E8C15C 0%, #C6A75E 45%, #B08D3E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Verified Lawyers
              </span>{" "}
              Across Sri Lanka
            </motion.h1>

            {/* Subheading */}
            <motion.p
              {...fadeUp(0.35)}
              className="leading-relaxed mb-10"
              style={{
                fontSize: "1.125rem",
                color: "#8A8A95",
                maxWidth: "34rem",
                lineHeight: "1.75",
              }}
            >
              Find expert legal representation in your district and preferred
              language. Book consultations, share documents securely, and track
              your case — all through one trusted platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              {...fadeUp(0.42)}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Button variant="primary" size="lg" href="#search">
                <Search className="w-4 h-4" />
                Find a Lawyer
              </Button>
              <Button variant="secondary" size="lg" href="/register">
                Register as Lawyer
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Divider before stats */}
            <motion.div
              {...fadeIn(0.5)}
              className="mb-7"
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 60%, transparent)",
              }}
            />

            {/* Trust Stats */}
            <motion.div
              {...fadeIn(0.55)}
              className="grid grid-cols-2 sm:grid-cols-4 gap-px"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.05)",
                overflow: "hidden",
              }}
            >
              {TRUST_INDICATORS.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.08 }}
                  className="flex flex-col items-center justify-center py-5 px-3 text-center relative"
                  style={{ background: "rgba(11,11,12,0.6)" }}
                >
                  {idx < TRUST_INDICATORS.length - 1 && (
                    <div
                      className="absolute right-0 top-3 bottom-3 w-px hidden sm:block"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                  )}
                  <div
                    className="font-serif font-bold text-2xl mb-1"
                    style={{
                      background:
                        "linear-gradient(135deg, #E8C15C, #C6A75E)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    className="text-[11px] font-medium tracking-wide"
                    style={{ color: "#5A5A63" }}
                  >
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              {...fadeIn(0.75)}
              className="flex items-center gap-3 mt-6"
            >
              <div className="flex -space-x-2">
                {[
                  "photo-1573496359142-b8d87734a5a2",
                  "photo-1507003211169-0a1dd7228f2d",
                  "photo-1472099645785-5658abf4ff4e",
                ].map((id, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/${id}?w=48&h=48&auto=format&fit=crop&crop=face&q=80`}
                    alt="Verified lawyer"
                    className="w-8 h-8 rounded-full object-cover"
                    style={{
                      border: "2px solid #0B0B0C",
                      boxShadow: "0 0 0 1px rgba(198,167,94,0.15)",
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-gold-400 text-gold-400"
                    />
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "#5A5A63" }}>
                  Trusted by{" "}
                  <span style={{ color: "#8A8A95" }}>10,000+ Sri Lankans</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Visual with 3D Scale ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* ── 3D Animated Scale of Justice (behind image) ── */}
              <motion.div
                className="absolute -top-20 -left-16 z-0"
                style={{ opacity: scaleOpacity }}
              >
                <FloatingScale3D className="opacity-60" />
              </motion.div>

              {/* Main image card */}
              <div
                className="relative rounded-3xl overflow-hidden z-10"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow:
                    "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,167,94,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <OptimizedImage
                  src={IMAGES.hero.primary.src}
                  srcSet={IMAGES.hero.primary.srcSet}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  alt={IMAGES.hero.primary.alt}
                  width={IMAGES.hero.primary.width}
                  height={IMAGES.hero.primary.height}
                  className="w-full h-[460px]"
                  loading="eager"
                  overlay
                  overlayClassName="bg-linear-to-t from-dark-950/50 via-transparent to-transparent"
                  containerClassName="w-full h-[460px]"
                />
                {/* Gold shimmer border top */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px"
                  animate={{
                    backgroundPosition: ["0% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 100%",
                    backgroundImage:
                      "linear-gradient(90deg, transparent, rgba(198,167,94,0.6) 20%, rgba(198,167,94,0.15) 50%, transparent 80%)",
                  }}
                />
              </div>

              {/* Floating badge — BASL Verified (top right) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 z-20"
              >
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold"
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(52,211,153,0.25)",
                    color: "#34D399",
                    boxShadow:
                      "0 8px 32px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  BASL Verified
                </div>
              </motion.div>

              {/* Floating card — Documents Secured (bottom right) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-4 z-20"
              >
                <div
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "rgba(11,11,12,0.75)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
                    minWidth: "200px",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(52,211,153,0.1)",
                      border: "1px solid rgba(52,211,153,0.15)",
                    }}
                  >
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-100">
                      Documents Secured
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#5A5A63" }}>
                      End-to-end encrypted
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card — BASL Compliant (middle left) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                className="absolute top-1/3 -left-8 z-20"
              >
                <div
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "rgba(11,11,12,0.75)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(198,167,94,0.12)",
                    boxShadow:
                      "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(198,167,94,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
                    minWidth: "190px",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(198,167,94,0.08)",
                      border: "1px solid rgba(198,167,94,0.15)",
                    }}
                  >
                    <Scale className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-100">
                      BASL Compliant
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#5A5A63" }}>
                      Verified credentials
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative glow behind image */}
              <div
                className="absolute -inset-4 -z-10 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(198,167,94,0.06), transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* ── Scroll Indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: "#4A4A52" }}>
          Scroll to explore
        </span>
        <motion.div
          className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-gold-400/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
