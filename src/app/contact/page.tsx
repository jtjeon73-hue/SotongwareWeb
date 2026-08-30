import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { ContactIntentSelector } from "@/components/contact/ContactIntentSelector";
import { ContactProductionBanner } from "@/components/contact/ContactProductionBanner";
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
          description="제작 의뢰, 견적, 상담 문의를 접수합니다. 영업일 기준 순차적으로 답변합니다."
        />

        <ContactProductionBanner />

        <ContactIntentSelector />

        <div id="contact-form">
          <ContactFormSection />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/products" variant="outline">디지털 상품</Button>
          <Button href="/" variant="outline">홈으로</Button>
        </div>
      </div>
    </div>
  );
}
