import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { HomeDictionary } from "@/i18n/types";
import { ShowcaseVisual } from "./ShowcaseVisual";

interface BusinessShowcaseSectionProps {
  dict: HomeDictionary;
}

export function BusinessShowcaseSection({ dict }: BusinessShowcaseSectionProps) {
  const { showcase } = dict;

  return (
    <section className="section-padding section-alt" aria-labelledby="showcase-heading">
      <div className="container-main">
        <SectionHeader
          id="showcase-heading"
          eyebrow={showcase.eyebrow}
          title={showcase.title}
          description={showcase.description}
        />
        <div className="space-y-8">
          {showcase.units.map((unit, index) => (
            <article
              key={unit.id}
              className={`overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              } lg:flex lg:items-stretch`}
            >
              <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:max-w-[55%]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {unit.status}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-surface-900 sm:text-2xl">{unit.title}</h3>
                <p className="mt-1 text-sm font-medium text-surface-500">{unit.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-surface-600">{unit.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {unit.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-surface-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button href={unit.ctaHref} variant="primary" className="min-h-11">
                    {unit.cta}
                  </Button>
                </div>
              </div>
              <div className="border-t border-surface-100 bg-surface-50 p-6 sm:p-8 lg:w-[45%] lg:border-t-0 lg:border-l">
                <ShowcaseVisual type={unit.visual} title={unit.title} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
