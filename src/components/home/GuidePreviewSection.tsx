import { usageTypes } from "@/data/guide";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function GuidePreviewSection() {
  const preview = usageTypes.slice(0, 4);

  return (
    <section className="section-padding section-alt" aria-labelledby="guide-preview-heading">
      <div className="container-main">
        <SectionHeader
          id="guide-preview-heading"
          eyebrow="Guide"
          title="서비스 이용 방식"
          description="무료·회원·유료·구독·상담·제작 — SotongWare와 전문 사이트의 이용 차이를 이해하세요."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((type) => (
            <div key={type.id} className="rounded-xl border border-surface-200 bg-white p-4">
              <p className="text-sm font-semibold text-surface-900">{type.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-surface-600 line-clamp-3">
                {type.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button href="/guide" variant="primary" className="min-h-11">
            이용 안내 전체 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
