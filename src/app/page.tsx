import { HeroSection } from "@/components/home/HeroSection";
import { ExploreByGoalSection } from "@/components/home/ExploreByGoalSection";
import { BusinessHubSection } from "@/components/business/BusinessHubSection";
import { HomeWorksTeaserSection } from "@/components/home/HomeWorksTeaserSection";
import { WhySection, TrustSection } from "@/components/home/WhySection";
import { ProcessPreviewSection } from "@/components/home/ProcessPreviewSection";
import { GuidePreviewSection } from "@/components/home/GuidePreviewSection";
import { BusinessNetworkSection } from "@/components/business/BusinessNetworkSection";
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
      <WhySection />
      <ProcessPreviewSection />
      <GuidePreviewSection />
      <BusinessNetworkSection />
      <TrustSection />
      <HomeWorksTeaserSection />
      <FinalCtaSection />
    </>
  );
}
