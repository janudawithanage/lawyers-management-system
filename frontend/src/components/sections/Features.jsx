import { motion } from "framer-motion";
import {
  Shield,
  Calendar,
  FileSearch,
  BadgeCheck,
  Languages,
  Bell,
} from "lucide-react";
import { FEATURES } from "../../constants";
import { Container, SectionHeading, Card, IconBox } from "../ui";
import { IMAGES } from "../../config/images";

const iconMap = { Shield, Calendar, FileSearch, BadgeCheck, Languages, Bell };

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-dark-900" aria-label="Key features">
      <Container>
        <SectionHeading
          badge="Platform Features"
          title="Everything You Need for Legal Management"
          subtitle="A comprehensive suite of tools designed to streamline legal services across Sri Lanka."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {FEATURES.map((feature, idx) => {
            const Icon = iconMap[feature.icon];
            return (
              <Card
                key={feature.title}
                variant="default"
                padding="lg"
                animated
                animationDelay={idx * 0.08}
                className="relative overflow-hidden"
              >
                {/* Corner accent on hover */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-gold-500/6 to-transparent rounded-bl-3xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

                <div className="relative">
                  <IconBox icon={Icon} color="gold" size="md" className="mb-5" />

                  <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Feature accent image — legal consultation */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/6 h-48 sm:h-64">
            <img
              src={IMAGES.sections.consultation.src}
              alt={IMAGES.sections.consultation.alt}
              className="w-full h-full object-cover opacity-30"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-linear-to-r from-dark-900 via-dark-900/85 to-transparent" />
            <div className="absolute inset-0 flex items-center p-8 sm:p-12">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-50 mb-2">
                  Built for <span className="gradient-gold-text">Sri Lanka&apos;s</span> Legal Ecosystem
                </h3>
                <p className="text-neutral-400 text-sm sm:text-base max-w-lg">
                  Every feature designed with the unique needs of Sri Lankan legal professionals and their clients in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
