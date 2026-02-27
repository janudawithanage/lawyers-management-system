import { motion } from "framer-motion";
import { Smartphone, Video, Brain, CreditCard } from "lucide-react";
import { FUTURE_VISION } from "../../constants";
import { Container, SectionHeading } from "../ui";

const iconMap = { Smartphone, Video, Brain, CreditCard };

export default function FutureVision() {
  return (
    <section className="py-20 lg:py-28 bg-dark-900" aria-label="Future vision">
      <Container>
        <SectionHeading
          badge="Roadmap"
          title="The Future of Legal Tech in Sri Lanka"
          subtitle="We're constantly innovating to bring world-class legal technology solutions to Sri Lanka."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {FUTURE_VISION.map((item, idx) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.1 }}
                className="group relative surface-card rounded-2xl p-6 hover:surface-card-hover transition-all duration-300 text-center"
              >
                {/* Status badge */}
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gold-500/10 text-gold-400 border border-gold-500/20 mb-4">
                  {item.status}
                </span>

                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-gold-500/15 transition-all duration-300">
                  <Icon className="w-7 h-7 text-gold-400" />
                </div>

                <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
