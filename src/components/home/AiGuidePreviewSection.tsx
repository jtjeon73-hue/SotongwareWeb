import Link from "next/link";
import { aiGuideOptions } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function AiGuidePreviewSection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="guide-heading">
      <div className="container-main">
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-6 sm:p-8 lg:p-10">
          <SectionHeader
            id="guide-heading"
            eyebrow="Service Navigator"
            title="어떤 것이 필요한지 모르시겠나요?"
            description="목적을 선택하면 관련 서비스와 솔루션 페이지로 안내합니다. 기술 이름을 알 필요 없이, 지금 필요한 것만 고르세요."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {aiGuideOptions.map((option) => (
              <Link
                key={option.id}
                href={option.href}
                className="group rounded-xl border border-surface-200 bg-white p-4 transition-colors hover:border-brand-300 hover:shadow-sm sm:p-5"
              >
                <p className="text-sm font-semibold text-surface-900 group-hover:text-brand-700">
                  {option.label}
                </p>
                <p className="mt-1 text-sm text-surface-600">{option.description}</p>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-xs text-surface-500">
            향후 대화형 안내 기능이 추가될 예정입니다. 현재는 목적별 페이지로 연결됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
