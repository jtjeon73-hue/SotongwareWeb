import { whyPoints } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function WhySection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="why-heading">
      <div className="container-main">
        <SectionHeader
          id="why-heading"
          title="Why SotongWare"
          description="산업 현장 이해, 소프트웨어 개발, AI 활용, 디지털 콘텐츠, 온라인 사업화, 자동화 — 이 결합이 SotongWare의 핵심 경쟁력입니다."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-surface-200 p-6"
            >
              <h3 className="text-base font-semibold text-surface-900">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-600">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
