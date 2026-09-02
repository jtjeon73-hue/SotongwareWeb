import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/localized-path";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactIntentSelector } from "@/components/contact/ContactIntentSelector";
import { ContactProductionBanner } from "@/components/contact/ContactProductionBanner";
import { ContactTopicSiteHint } from "@/components/contact/ContactTopicSiteHint";

export function ContactPageView({ locale }: { locale: Locale }) {
  const p = getSiteDictionary(locale).pages.contact;
  const common = getSiteDictionary(locale).common;

  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-2xl">
        <SectionHeader title={p.title} description={p.description} />
        <ContactProductionBanner />
        <ContactIntentSelector />
        <Suspense fallback={null}>
          <ContactTopicSiteHint />
        </Suspense>
        <div id="contact-form">
          <ContactFormSection />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={localizePath("/guide", locale)} variant="outline" className="min-h-11">
            {p.ctaGuide}
          </Button>
          <Button href={localizePath("/", locale)} variant="outline" className="min-h-11">
            {common.backHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
