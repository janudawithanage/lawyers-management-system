import { motion } from "framer-motion";
import { ArrowRight, Scale } from "lucide-react";
import { Button, Container } from "../ui";
import { IMAGES } from "../../config/images";

export default function CallToAction() {
  return (
    <section className="py-20 lg:py-28 bg-dark-900" aria-label="Call to action">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden"
        >
          {/* Background image */}
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src={IMAGES.sections.callToAction.src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-dark-950/90" />
            <div className="absolute inset-0 bg-linear-to-br from-dark-950/50 to-transparent" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold-500/8 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gold-500/5 rounded-full blur-[100px]" />
            <div
              className="absolute inset-0 opacity-3"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(198,165,94,0.3) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center border border-white/6 rounded-3xl">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-gold-500/15 flex items-center justify-center mx-auto mb-6 glow-gold"
            >
              <Scale className="w-8 h-8 text-gold-400" />
            </motion.div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-50 mb-4 text-balance">
              Start Your Legal Journey Today
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of Sri Lankans who trust SL-LMS to connect them with
              verified legal professionals. Your path to justice starts here.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="xl" href="#search">
                Find a Lawyer Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="xl" href="#register">
                Register as a Lawyer
              </Button>
            </div>

            <p className="text-xs text-neutral-600 mt-8">
              No registration fee • 500+ verified lawyers • Secure &amp; confidential
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
