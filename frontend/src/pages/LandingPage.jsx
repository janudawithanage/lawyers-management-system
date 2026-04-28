/**
 * LandingPage — Public-facing home page.
 *
 * Rendered inside PublicLayout (which provides Navbar + Footer).
 * All sections are imported from the sections module.
 * Includes a scroll progress bar and animated section transitions.
 */

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
import { ScrollProgress } from "../components/common";

export default function LandingPage() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <SearchPreview />
      <HowItWorks />
      <Features />
      <WhyChoose />
      <FutureVision />
      <Testimonials />
      <CallToAction />
    </>
  );
}
