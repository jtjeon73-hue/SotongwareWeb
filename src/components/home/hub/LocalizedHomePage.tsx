import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { HubHeroSection } from "@/components/home/hub/HubHeroSection";
import { CapabilitiesSection } from "@/components/home/hub/CapabilitiesSection";
import { WorkflowSection } from "@/components/home/hub/WorkflowSection";
import { DigitalVenturesSection } from "@/components/home/hub/DigitalVenturesSection";
import { ResultsSection } from "@/components/home/hub/ResultsSection";
import { ConversionHubSection } from "@/components/home/hub/ConversionHubSection";
import { TrustPolicySection } from "@/components/home/hub/TrustPolicySection";
import { HubFinalCtaSection } from "@/components/home/hub/HubFinalCtaSection";
import { StructuredData } from "@/components/common/StructuredData";
import { organizationJsonLd } from "@/lib/structured-data";

interface LocalizedHomePageProps {
  locale: Locale;
}

export function LocalizedHomePage({ locale }: LocalizedHomePageProps) {
  const dict = getDictionary(locale);

  return (
    <>
      <StructuredData data={organizationJsonLd()} />
      <HubHeroSection dict={dict} />
      <CapabilitiesSection dict={dict} />
      <WorkflowSection dict={dict} />
      <DigitalVenturesSection dict={dict} />
      <ResultsSection dict={dict} locale={locale} />
      <ConversionHubSection dict={dict} />
      <TrustPolicySection dict={dict} />
      <HubFinalCtaSection dict={dict} />
    </>
  );
}
