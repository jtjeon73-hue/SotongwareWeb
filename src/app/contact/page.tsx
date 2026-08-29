import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
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
          title="문의·제작 의뢰"
          description="제작 의뢰, 견적, 상담 문의를 접수합니다. 영업일 기준 순차적으로 답변합니다."
        />
        <p className="mb-6 text-sm text-surface-600">
          먼저{" "}
          <Link href="/ai-guide" className="font-medium text-brand-600 hover:text-brand-700">
            목적별 안내
          </Link>
          또는{" "}
          <Link href="/products" className="font-medium text-brand-600 hover:text-brand-700">
            디지털 상품
          </Link>
          을 확인해 보세요.
        </p>
        <ContactFormSection />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/ai-guide" variant="outline">목적별 안내</Button>
          <Button href="/" variant="outline">홈으로</Button>
        </div>
      </div>
    </div>
  );
}
