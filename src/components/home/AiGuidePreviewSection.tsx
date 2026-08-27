import Link from "next/link";
import { aiGuideOptions } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function AiGuidePreviewSection() {
  return (
    <section className="section-padding bg-brand-50" aria-labelledby="ai-guide-heading">
      <div className="container-main">
        <div className="rounded-2xl border border-brand-200 bg-white p-6 sm:p-10">
          <SectionHeader
            id="ai-guide-heading"
            title="어떤 서비스가 필요한지 잘 모르시나요?"
            description="목적을 선택하면 관련 서비스와 결과물을 안내합니다. 향후 AI Guide가 더 정확한 안내를 제공할 예정입니다."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {aiGuideOptions.map((option) => (
              <Link
                key={option.id}
                href={option.href}
                className="rounded-xl border border-surface-200 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <p className="text-sm font-semibold text-surface-900">
                  {option.label}
                </p>
                <p className="mt-1 text-xs text-surface-600">
                  {option.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Button href="/ai-guide" variant="outline">
              AI 안내 페이지로 이동
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
