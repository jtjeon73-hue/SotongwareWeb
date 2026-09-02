import type { Locale } from "@/i18n/config";
import { guideLabels } from "@/i18n/guide-labels";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LocalizedButton } from "@/components/locale/LocalizedButton";

export function GuidePageView({ locale }: { locale: Locale }) {
  const labels = guideLabels[locale];

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader eyebrow={labels.eyebrow} title={labels.title} description={labels.description} />

        <section className="mb-12" aria-labelledby="usage-types-heading">
          <h2 id="usage-types-heading" className="text-lg font-bold text-surface-900">
            {labels.usageTypesTitle}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labels.usageTypes.map((type) => (
              <div key={type.id} className="rounded-xl border border-surface-200 p-5">
                <h3 className="text-base font-semibold text-surface-900">{type.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">{type.description}</p>
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
            {labels.usageFlowsTitle}
          </h2>
          <p className="mt-1 text-sm text-surface-600">{labels.usageFlowsDescription}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {labels.usageFlows.map((flow) => (
              <article key={flow.id} className="rounded-xl border border-surface-200 bg-surface-50/50 p-5">
                <h3 className="text-base font-semibold text-surface-900">{flow.title}</h3>
                <ol className="mt-4 space-y-2">
                  {flow.steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-2 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                        {index + 1}
                      </span>
                      <span className="text-surface-700">{step}</span>
                      {index < flow.steps.length - 1 && <span className="sr-only">{labels.nextStepSr}</span>}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <LocalizedButton href="/process" variant="outline" className="min-h-11">
            {labels.ctaProcess}
          </LocalizedButton>
          <LocalizedButton href="/#business-hub-heading" variant="primary" className="min-h-11">
            {labels.ctaServices}
          </LocalizedButton>
          <LocalizedButton href="/contact" variant="outline" className="min-h-11">
            {labels.ctaContact}
          </LocalizedButton>
        </div>
      </div>
    </div>
  );
}
