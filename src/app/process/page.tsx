import { businessProcesses, commonProcessSteps } from "@/data/process";
import { businessAreas } from "@/data/businesses";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CommonProcessGrid, ProcessStepFlow } from "@/components/process/ProcessStepFlow";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "제작 과정",
  description:
    "SotongWare의 기획·제작·검수·배포 과정. 산업자동화, 앱, 전자책, 지식·교육, 마케팅, 콘텐츠 분야별 제작 프로세스를 안내합니다.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Process"
          title="제작 과정"
          description="SotongWare는 단순 생성이 아니라 기획·제작·검수·배포까지 체계적인 과정으로 결과물을 만듭니다."
        />

        <section className="mb-12" aria-labelledby="common-process-heading">
          <h2 id="common-process-heading" className="text-lg font-bold text-surface-900">
            공통 제작 프로세스
          </h2>
          <p className="mt-1 text-sm text-surface-600">
            모든 분야에 공통으로 적용되는 핵심 단계입니다.
          </p>
          <div className="mt-6">
            <CommonProcessGrid steps={commonProcessSteps} />
          </div>
        </section>

        <section aria-labelledby="business-process-heading">
          <h2 id="business-process-heading" className="text-lg font-bold text-surface-900">
            분야별 제작 프로세스
          </h2>
          <p className="mt-1 text-sm text-surface-600">
            6대 전문 서비스마다 현장과 산출물에 맞는 세부 과정을 운영합니다.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {businessProcesses.map((process) => {
              const area = businessAreas.find((b) => b.id === process.id);
              return (
                <article
                  key={process.id}
                  className="rounded-xl border border-surface-200 p-5 sm:p-6"
                >
                  <h3 className="text-base font-bold text-surface-900">{process.titleKo}</h3>
                  {area && (
                    <p className="mt-1 text-sm text-surface-600">{area.tagline}</p>
                  )}
                  <div className="mt-4">
                    <ProcessStepFlow steps={process.steps} compact />
                  </div>
                  {area && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button href={area.internalPath} variant="outline" className="min-h-11 text-sm">
                        서비스 보기
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/guide" variant="primary" className="min-h-11">
            서비스 이용 안내
          </Button>
          <Button href="/contact" variant="outline" className="min-h-11">
            상담·제작 문의
          </Button>
        </div>
      </div>
    </div>
  );
}
