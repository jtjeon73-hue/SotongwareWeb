import { HeroSection } from "@/components/home/HeroSection";
import { BusinessHubSection } from "@/components/business/BusinessHubSection";
import { BusinessNetworkSection } from "@/components/business/BusinessNetworkSection";
import { WhatWeBuildSection } from "@/components/home/WhatWeBuildSection";
import { LatestWorksSection } from "@/components/home/LatestWorksSection";
import { ExploreByGoalSection } from "@/components/home/ExploreByGoalSection";
import { WhySection, TrustSection } from "@/components/home/WhySection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { StructuredData } from "@/components/common/StructuredData";
import { organizationJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <StructuredData data={organizationJsonLd()} />
      <HeroSection />
      <WhatWeBuildSection />
      <BusinessHubSection />
      <BusinessNetworkSection />
      <LatestWorksSection />
      <ExploreByGoalSection />
      <WhySection />
      <TrustSection />
      <FinalCtaSection />
    </>
  );
}
