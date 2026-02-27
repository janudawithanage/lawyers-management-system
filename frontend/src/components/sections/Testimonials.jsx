import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../constants";
import { Container, SectionHeading, Card } from "../ui";
import { getInitials } from "../../utils/formatters";

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-dark-950" aria-label="Testimonials">
      <Container>
        <SectionHeading
          badge="Testimonials"
          title="Trusted by Clients Across Sri Lanka"
          subtitle="Real experiences from people who found the right legal help through SL-LMS."
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TESTIMONIALS.map((testimonial, idx) => (
            <Card
              key={testimonial.name}
              variant="default"
              padding="lg"
              animated
              animationDelay={idx * 0.1}
              className="relative"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6" aria-hidden="true">
                <Quote className="w-8 h-8 text-white/4" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
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
          ))}
        </div>
      </Container>
    </section>
  );
}
