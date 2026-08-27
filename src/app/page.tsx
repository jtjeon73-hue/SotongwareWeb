import { HeroSection } from "@/components/home/HeroSection";
import { WhatWeBuildSection } from "@/components/home/WhatWeBuildSection";
import { LatestWorksSection } from "@/components/home/LatestWorksSection";
import { WhySection } from "@/components/home/WhySection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ExploreByGoalSection } from "@/components/home/ExploreByGoalSection";
import { TechnologySection } from "@/components/home/TechnologySection";
import { AiGuidePreviewSection } from "@/components/home/AiGuidePreviewSection";
import { EcosystemSection } from "@/components/home/EcosystemSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhatWeBuildSection />
      <LatestWorksSection />
      <WhySection />
      <HowItWorksSection />
      <ExploreByGoalSection />
      <TechnologySection />
      <AiGuidePreviewSection />
      <EcosystemSection />
      <FinalCtaSection />
    </>
  );
}
