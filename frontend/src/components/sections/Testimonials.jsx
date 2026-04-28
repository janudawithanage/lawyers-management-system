import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../constants";
import { Container, SectionHeading, Card } from "../ui";
import { ScrollReveal, TiltCard } from "../common";
import { getInitials } from "../../utils/formatters";

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-dark-950 relative overflow-hidden" aria-label="Testimonials">
      {/* Floating background accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 3, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(ellipse, rgba(198,167,94,0.03), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <Container className="relative z-10">
        <ScrollReveal variant="fadeUp">
          <SectionHeading
            badge="Testimonials"
            title="Trusted by Clients Across Sri Lanka"
            subtitle="Real experiences from people who found the right legal help through SL-LMS."
            maxWidth="max-w-6xl"
          />
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial, idx) => (
            <ScrollReveal
              key={testimonial.name}
              variant="fadeUp"
              delay={idx * 0.12}
            >
              <TiltCard
                className="h-full rounded-2xl"
                maxTilt={5}
                glareColor="rgba(198, 167, 94, 0.04)"
              >
                <Card
                  variant="default"
                  padding="lg"
                  className="relative h-full"
                >
                  {/* Quote icon with subtle animation */}
                  <motion.div
                    className="absolute top-6 right-6"
                    aria-hidden="true"
                    animate={{ rotate: [0, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                  >
                    <Quote className="w-8 h-8 text-white/4" />
                  </motion.div>

                  {/* Stars with stagger animation */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.1 + i * 0.05, type: "spring" }}
                      >
                        <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-neutral-300 text-sm leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                    <div className="w-10 h-10 rounded-full gradient-gold-btn flex items-center justify-center text-dark-950 font-semibold text-xs shrink-0">
                      {getInitials(testimonial.name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-100">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
