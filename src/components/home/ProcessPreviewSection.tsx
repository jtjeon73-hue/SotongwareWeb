import { commonProcessSteps } from "@/data/process";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function ProcessPreviewSection() {
  const preview = commonProcessSteps.slice(0, 4);

  return (
    <section className="section-padding bg-white" aria-labelledby="process-preview-heading">
      <div className="container-main">
        <SectionHeader
          id="process-preview-heading"
          eyebrow="Process"
          title="체계적인 제작 과정"
          description="기획부터 배포·운영까지 — SotongWare가 실제로 운영하는 제작 프로세스입니다."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((step) => (
            <div key={step.step} className="rounded-xl border border-surface-200 p-4">
              <p className="text-xs font-bold text-brand-600">{step.step}</p>
              <p className="mt-1 text-sm font-semibold text-surface-900">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-surface-600">{step.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-surface-600">
          요구 이해 → 기획 → 설계 → 제작 → 검증 → 보완 → 최종 확인 → 배포·운영
        </p>
        <div className="mt-6">
          <Button href="/process" variant="primary" className="min-h-11">
            전체 제작 과정 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
