import { whyFormula, whyPoints } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function WhySection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="why-heading">
      <div className="container-main">
        <SectionHeader
          id="why-heading"
          eyebrow="Differentiation"
          title="Why SotongWare"
          description="단순 웹에이전시나 AI 홍보 회사가 아닙니다. 산업 현장과 디지털 제작을 아우르는 기술 기반 회사입니다."
        />

        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-surface-500">
            SotongWare의 결합 역량
          </p>
          <ul className="mt-6 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            {whyFormula.map((item, index) => (
              <li key={item.label} className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 rounded-lg bg-white px-4 py-3 text-center ring-1 ring-surface-200 sm:flex-none">
                  <p className="text-xs font-semibold text-brand-700">{item.label}</p>
                  <p className="mt-0.5 text-[11px] text-surface-500">{item.labelKo}</p>
                </div>
                {index < whyFormula.length - 1 && (
                  <span
                    className="hidden text-lg font-light text-surface-300 sm:inline"
                    aria-hidden="true"
                  >
                    +
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {whyPoints.map((point) => (
            <div key={point.title} className="rounded-xl border border-surface-200 p-5 sm:p-6">
              <h3 className="text-base font-semibold text-surface-900">{point.title}</h3>
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
