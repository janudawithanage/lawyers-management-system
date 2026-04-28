import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Lock, Scale, Eye } from "lucide-react";
import { WHY_CHOOSE } from "../../constants";
import { Container, SectionHeading, Card, IconBox } from "../ui";
import { ScrollReveal, TiltCard } from "../common";
import { IMAGES } from "../../config/images";

const iconMap = { MapPin, Lock, Scale, Eye };

export default function WhyChoose() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for background orbs
  const orbY1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [30, -60]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <section
      ref={sectionRef}
      id="why-choose"
      className="py-20 lg:py-28 bg-dark-950 relative overflow-hidden"
      aria-label="Why choose SL-LMS"
    >
      {/* Background image with parallax zoom & heavy overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <motion.div className="w-full h-full" style={{ scale: imgScale }}>
          <img
            src={IMAGES.sections.whyChoose.src}
            alt=""
            className="w-full h-full object-cover opacity-4"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-b from-dark-950 via-dark-950/95 to-dark-950" />
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/4 rounded-full blur-[120px]"
          style={{ y: orbY1 }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/3 rounded-full blur-[120px]"
          style={{ y: orbY2 }}
        />
      </div>

      <Container className="relative z-10">
        <ScrollReveal variant="fadeUp">
          <SectionHeading
            badge="Why SL-LMS?"
            title="Trust Built Into Every Interaction"
            subtitle="We're not just another legal directory. SL-LMS is purpose-built for Sri Lanka's legal ecosystem, ensuring trust, security, and accessibility at every step."
            maxWidth="max-w-5xl"
          />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {WHY_CHOOSE.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <ScrollReveal
                key={item.title}
                variant={idx % 2 === 0 ? "fadeLeft" : "fadeRight"}
                delay={idx * 0.1}
              >
                <TiltCard
                  className="h-full rounded-2xl"
                  maxTilt={5}
                  glareColor="rgba(198, 167, 94, 0.05)"
                >
                  <Card
                    variant="gold"
                    padding="lg"
                    className="h-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <IconBox icon={Icon} color="gold" size="md" className="mb-5" />
                    </motion.div>

                    <h3 className="text-xl font-semibold text-neutral-50 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
