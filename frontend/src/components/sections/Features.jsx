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
import { Container, SectionHeading } from "../ui";

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
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.08 }}
                className="group relative surface-card rounded-2xl p-7 hover:surface-card-hover transition-all duration-300"
              >
                {/* Corner accent on hover */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-gold-500/6 to-transparent rounded-bl-3xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-5 group-hover:bg-gold-500/15 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-gold-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
