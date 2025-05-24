import {
  ArchitectureSection,
  CTASection,
  FeaturesSection,
  Footer,
  HeroSection,
} from "@/components/landing-page";

export default function Home() {
  return (
    <div className="container mx-auto">
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <CTASection />
      <Footer />
    </div>
  );
}
