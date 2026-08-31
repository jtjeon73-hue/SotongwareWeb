import { usageFlows, usageTypes } from "@/data/guide";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "서비스 이용 안내",
  description:
    "SotongWare 무료·회원전용·유료·구독·상담·제작 이용 방식 안내. 분야별 실제 이용 흐름을 확인하세요.",
  path: "/guide",
});

export default function GuidePage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Guide"
          title="서비스 이용 안내"
          description="SotongWare와 각 전문 사이트의 이용 방식 차이를 이해하고, 필요한 서비스로 이동할 수 있습니다."
        />

        <section className="mb-12" aria-labelledby="usage-types-heading">
          <h2 id="usage-types-heading" className="text-lg font-bold text-surface-900">
            이용 유형
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {usageTypes.map((type) => (
              <div
                key={type.id}
                className="rounded-xl border border-surface-200 p-5"
              >
                <h3 className="text-base font-semibold text-surface-900">{type.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">
                  {type.description}
                </p>
                {type.note && (
                  <p className="mt-3 inline-flex rounded-md bg-surface-100 px-2 py-1 text-xs font-medium text-surface-600">
                    {type.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="usage-flows-heading">
          <h2 id="usage-flows-heading" className="text-lg font-bold text-surface-900">
            분야별 이용 흐름
          </h2>
          <p className="mt-1 text-sm text-surface-600">
            SotongWare 중앙 허브에서 각 전문 사이트·플랫폼으로 이어지는 경로입니다.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {usageFlows.map((flow) => (
              <article
                key={flow.id}
                className="rounded-xl border border-surface-200 bg-surface-50/50 p-5"
              >
                <h3 className="text-base font-semibold text-surface-900">{flow.title}</h3>
                <ol className="mt-4 space-y-2">
                  {flow.steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-2 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                        {index + 1}
                      </span>
                      <span className="text-surface-700">{step}</span>
                      {index < flow.steps.length - 1 && (
                        <span className="sr-only">다음 단계</span>
                      )}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/process" variant="outline" className="min-h-11">
            제작 과정 보기
          </Button>
          <Button href="/#business-hub-heading" variant="primary" className="min-h-11">
            6대 서비스 보기
          </Button>
          <Button href="/contact" variant="outline" className="min-h-11">
            상담·제작 문의
          </Button>
        </div>
      </div>
    </div>
  );
}
