/**
 * LandingPage — Public-facing home page.
 *
 * Rendered inside PublicLayout (which provides Navbar + Footer).
 * All sections are imported from the sections module.
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

export default function LandingPage() {
  return (
    <>
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
