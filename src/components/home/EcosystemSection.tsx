import { ecosystemNodes } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function EcosystemSection() {
  return (
    <section className="section-padding section-alt" aria-labelledby="ecosystem-heading">
      <div className="container-main">
        <SectionHeader
          id="ecosystem-heading"
          title="SotongWare Ecosystem"
          description="각 결과물이 다른 결과물로 방문자를 자연스럽게 이동시키는 순환형 디지털 자산 구조입니다."
          align="center"
          className="mx-auto text-center"
        />

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {ecosystemNodes.map((node, index) => (
            <div key={node.id} className="flex items-center gap-3">
              <div className="rounded-xl border border-surface-200 bg-white px-5 py-4 text-center shadow-sm">
                <p className="text-sm font-bold text-brand-700">{node.label}</p>
                <p className="mt-1 text-xs text-surface-600">{node.description}</p>
              </div>
              {index < ecosystemNodes.length - 1 && (
                <span className="hidden text-surface-400 sm:inline" aria-hidden="true">
                  ↔
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-surface-600">
          Apps ↔ E-books ↔ Websites ↔ Content ↔ Automation
        </p>
      </div>
    </section>
  );
}
