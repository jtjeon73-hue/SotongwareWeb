import { processSteps } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-surface-900 text-white" aria-labelledby="how-it-works-heading">
      <div className="container-main">
        <SectionHeader
          id="how-it-works-heading"
          title="How It Works"
          description="아이디어에서 출시, 홍보, 개선까지 — Sotong24Work 자동 제작 시스템과 연결 가능한 제작 흐름입니다."
          className="[&_h2]:text-white [&_p]:text-surface-300"
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li
              key={step.step}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold">
                {step.step}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-surface-400">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
