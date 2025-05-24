"use client";

import {
  ArchitectureSection,
  CTASection,
  FeaturesSection,
  Footer,
  HeroSection,
} from "@/components/landing-page";
import { useAccounts } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const accounts = useAccounts();
  const router = useRouter();
  
  useEffect(() => {
    if (accounts.length > 0) {
      router.push("/dashboard");
    }
  }, [accounts]);

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
