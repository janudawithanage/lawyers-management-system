import { motion } from "framer-motion";
import { MapPin, Lock, Scale, Eye } from "lucide-react";
import { WHY_CHOOSE } from "../../constants";
import { Container, SectionHeading } from "../ui";

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
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400&h=800&fit=crop&auto=format&q=60"
          alt=""
          className="w-full h-full object-cover opacity-4"
          loading="lazy"
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
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: idx * 0.1 }}
                className="glass-gold rounded-2xl p-7 hover:bg-gold-500/8 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>

                <h3 className="text-xl font-semibold text-neutral-50 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
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
