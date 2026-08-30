import { HeroSection } from "@/components/home/HeroSection";
import { ExploreByGoalSection } from "@/components/home/ExploreByGoalSection";
import { BusinessHubSection } from "@/components/business/BusinessHubSection";
import { LatestWorksSection } from "@/components/home/LatestWorksSection";
import { BusinessNetworkSection } from "@/components/business/BusinessNetworkSection";
import { WhySection, TrustSection } from "@/components/home/WhySection";
import { KnowledgeEntrySection } from "@/components/home/KnowledgeEntrySection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { StructuredData } from "@/components/common/StructuredData";
import { organizationJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <StructuredData data={organizationJsonLd()} />
      <HeroSection />
      <ExploreByGoalSection />
      <BusinessHubSection />
      <LatestWorksSection />
      <BusinessNetworkSection />
      <WhySection />
      <TrustSection />
      <KnowledgeEntrySection />
      <FinalCtaSection />
    </>
  );
}
