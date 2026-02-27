import { motion } from "framer-motion";
import { Smartphone, Video, Brain, CreditCard } from "lucide-react";
import { FUTURE_VISION } from "../../constants";
import { Container, SectionHeading, Card, Badge, IconBox } from "../ui";

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
              <Card
                key={item.title}
                variant="default"
                padding="md"
                animated
                animationDelay={idx * 0.1}
                className="text-center"
              >
                {/* Status badge */}
                <Badge variant="gold" size="sm" className="mb-4">
                  {item.status}
                </Badge>

                <IconBox icon={Icon} color="gold" size="lg" className="mx-auto mb-4" />

                <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
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
