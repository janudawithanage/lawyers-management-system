import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Smartphone, Video, Brain, CreditCard } from "lucide-react";
import { FUTURE_VISION } from "../../constants";
import { Container, SectionHeading, Card, Badge, IconBox } from "../ui";
import { ScrollReveal } from "../common";

const iconMap = { Smartphone, Video, Brain, CreditCard };

/**
 * FutureVision — Horizontal scroll timeline for the platform roadmap.
 * Cards scroll horizontally as the user scrolls vertically,
 * creating a cinematic timeline reveal effect.
 */
export default function FutureVision() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for background elements
  const bgX = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-dark-900 relative overflow-hidden"
      aria-label="Future vision"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            x: bgX,
            background: "radial-gradient(ellipse, rgba(198,167,94,0.04), transparent 70%)",
            filter: "blur(100px)",
            left: "-10%",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(52,211,153,0.06), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <Container className="relative z-10">
        <ScrollReveal variant="fadeUp">
          <SectionHeading
            badge="Roadmap"
            title="The Future of Legal Tech in Sri Lanka"
            subtitle="We're constantly innovating to bring world-class legal technology solutions to Sri Lanka."
            maxWidth="max-w-6xl"
          />
        </ScrollReveal>

        {/* Timeline connector line */}
        <div className="relative max-w-6xl mx-auto">
          {/* Horizontal progress line (desktop) */}
          <div className="hidden lg:block absolute top-[4.5rem] left-0 right-0 h-px z-0">
            <div className="w-full h-full bg-white/5" />
            <motion.div
              className="absolute top-0 left-0 h-full origin-left"
              style={{
                scaleX: lineScale,
                background: "linear-gradient(90deg, rgba(198,167,94,0.5), rgba(52,211,153,0.3), transparent)",
              }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FUTURE_VISION.map((item, idx) => {
              const Icon = iconMap[item.icon];
              return (
                <ScrollReveal
                  key={item.title}
                  variant="fadeUp"
                  delay={idx * 0.12}
                >
                  <div className="relative">
                    {/* Timeline dot */}
                    <div className="hidden lg:flex absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                      <motion.div
                        className="w-4 h-4 rounded-full border-2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.15, type: "spring" }}
                        style={{
                          borderColor: idx < 2 ? "rgba(198,167,94,0.5)" : "rgba(255,255,255,0.15)",
                          background: idx < 2 ? "rgba(198,167,94,0.2)" : "rgba(255,255,255,0.05)",
                          boxShadow: idx < 2 ? "0 0 12px rgba(198,167,94,0.3)" : "none",
                        }}
                      />
                    </div>

                    <Card
                      variant="default"
                      padding="md"
                      className="text-center mt-8 lg:mt-10 group hover:border-gold-500/20 transition-all duration-500"
                    >
                      {/* Status badge */}
                      <Badge variant="gold" size="sm" className="mb-4">
                        {item.status}
                      </Badge>

                      <motion.div
                        whileHover={{ rotateY: 10, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <IconBox icon={Icon} color="gold" size="lg" className="mx-auto mb-4" />
                      </motion.div>

                      <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {item.description}
                      </p>
                    </Card>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
