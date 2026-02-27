import { Navbar, Footer } from "../components/layout";
import {
  Hero,
  SearchPreview,
  HowItWorks,
  Features,
  WhyChoose,
  FutureVision,
  Testimonials,
  CallToAction,
} from "../components/sections";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <SearchPreview />
        <HowItWorks />
        <Features />
        <WhyChoose />
        <FutureVision />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
