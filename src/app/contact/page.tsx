import { Suspense } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactIntentSelector } from "@/components/contact/ContactIntentSelector";
import { ContactProductionBanner } from "@/components/contact/ContactProductionBanner";
import { ContactTopicSiteHint } from "@/components/contact/ContactTopicSiteHint";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "문의",
  description: "SotongWare 제작 의뢰, 견적, 상담 문의",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-2xl">
        <SectionHeader
          title="상담·제작 문의"
          description="제작 의뢰, 견적, 상담 문의를 접수합니다. 온라인 접수가 준비 중인 경우 관련 전문 사이트 안내를 우선 제공합니다."
        />

        <ContactProductionBanner />

        <ContactIntentSelector />

        <Suspense fallback={null}>
          <ContactTopicSiteHint />
        </Suspense>

        <div id="contact-form">
          <ContactFormSection />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/guide" variant="outline" className="min-h-11">이용 안내</Button>
          <Button href="/" variant="outline" className="min-h-11">홈으로</Button>
        </div>
      </div>
    </div>
  );
}
