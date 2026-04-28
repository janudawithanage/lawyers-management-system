import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Scale } from "lucide-react";
import { Button, Container } from "../ui";
import { ScrollReveal } from "../common";
import { IMAGES } from "../../config/images";

export default function CallToAction() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);
  const dotPatternY = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-dark-900" aria-label="Call to action">
      <Container>
        <ScrollReveal variant="scaleUp">
          <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden">
            {/* Background image with parallax zoom */}
            <div className="absolute inset-0" aria-hidden="true">
              <motion.div className="w-full h-full" style={{ scale: bgScale }}>
                <img
                  src={IMAGES.sections.callToAction.src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
              <div className="absolute inset-0 bg-dark-950/88" />
              <div className="absolute inset-0 bg-linear-to-br from-dark-950/50 to-transparent" />
              <motion.div
                className="absolute -top-20 -right-20 w-80 h-80 bg-gold-500/8 rounded-full blur-[100px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-80 h-80 bg-gold-500/5 rounded-full blur-[100px]"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 opacity-3"
                style={{
                  y: dotPatternY,
                  backgroundImage: `radial-gradient(circle, rgba(198,167,94,0.3) 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center border border-white/6 rounded-3xl">
              {/* Icon with 3D spin on view */}
              <motion.div
                initial={{ scale: 0, rotateY: -90 }}
                whileInView={{ scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gold-500/15 flex items-center justify-center mx-auto mb-6 glow-gold"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Scale className="w-8 h-8 text-gold-400" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-50 mb-4 text-balance"
              >
                Start Your Legal Journey Today
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                Join thousands of Sri Lankans who trust SL-LMS to connect them with
                verified legal professionals. Your path to justice starts here.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button variant="primary" size="xl" href="#search">
                  Find a Lawyer Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="secondary" size="xl" href="/register">
                  Register as a Lawyer
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="text-xs text-neutral-600 mt-8"
              >
                No registration fee • 500+ verified lawyers • Secure &amp; confidential
              </motion.p>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
