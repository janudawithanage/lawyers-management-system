import { motion } from "framer-motion";
import { MapPin, Lock, Scale, Eye } from "lucide-react";
import { WHY_CHOOSE } from "../../constants";
import { Container, SectionHeading, Card, IconBox } from "../ui";
import { IMAGES } from "../../config/images";

const iconMap = { MapPin, Lock, Scale, Eye };

export default function WhyChoose() {
  return (
    <section
      id="why-choose"
      className="py-20 lg:py-28 bg-dark-950 relative overflow-hidden"
      aria-label="Why choose SL-LMS"
    >
      {/* Background image with heavy overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={IMAGES.sections.whyChoose.src}
          alt=""
          className="w-full h-full object-cover opacity-4"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-linear-to-b from-dark-950 via-dark-950/95 to-dark-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/2 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <SectionHeading
          badge="Why SL-LMS?"
          title="Trust Built Into Every Interaction"
          subtitle="We're not just another legal directory. SL-LMS is purpose-built for Sri Lanka's legal ecosystem, ensuring trust, security, and accessibility at every step."
        />

        <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {WHY_CHOOSE.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <Card
                key={item.title}
                variant="gold"
                padding="lg"
                animated
                animationDelay={idx * 0.1}
              >
                <IconBox icon={Icon} color="gold" size="md" className="mb-5" />

                <h3 className="text-xl font-semibold text-neutral-50 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
