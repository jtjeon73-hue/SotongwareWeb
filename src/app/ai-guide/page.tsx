import Link from "next/link";
import { aiGuideOptions } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "목적별 안내",
  description: "목적에 맞는 SotongWare 서비스와 솔루션 안내",
  path: "/ai-guide",
});

export default function AiGuidePage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-3xl">
        <SectionHeader
          eyebrow="Service Navigator"
          title="어떤 것이 필요한지 모르시겠나요?"
          description="지금 필요한 목적을 선택하세요. 관련 서비스와 솔루션 페이지로 안내합니다."
        />
        <div className="space-y-3">
          {aiGuideOptions.map((option) => (
            <Link
              key={option.id}
              href={option.href}
              className="block rounded-xl border border-surface-200 p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
            >
              <p className="font-semibold text-surface-900">{option.label}</p>
              <p className="mt-1 text-sm text-surface-600">{option.description}</p>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-surface-500">
          자동 안내로 해결되지 않는 경우{" "}
          <Link href="/contact" className="font-medium text-brand-600 hover:text-brand-700">
            문의 페이지
          </Link>
          를 이용해 주세요.
        </p>
      </div>
    </div>
  );
}
