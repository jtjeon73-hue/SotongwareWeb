import type { HomeDictionary } from "@/i18n/types";
import { VenturePortfolioVisual } from "./VenturePortfolioVisual";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface DigitalVenturesSectionProps {
  dict: HomeDictionary;
}

const STATUS_STYLES: Record<string, string> = {
  launchPrep: "bg-amber-50 text-amber-800 ring-amber-200",
  inValidation: "bg-violet-50 text-violet-800 ring-violet-200",
  live: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  expansion: "bg-sky-50 text-sky-800 ring-sky-200",
};

const UNIT_THEMES: Record<string, { border: string; bg: string; accent: string }> = {
  ebook: { border: "border-amber-200/80", bg: "bg-gradient-to-br from-amber-50/80 to-white", accent: "text-amber-800" },
  app: { border: "border-brand-200/80", bg: "bg-gradient-to-br from-brand-50/60 to-white", accent: "text-brand-800" },
  site: { border: "border-surface-300/80", bg: "bg-gradient-to-br from-surface-100/80 to-white", accent: "text-surface-800" },
  content: { border: "border-rose-200/80", bg: "bg-gradient-to-br from-rose-50/50 to-white", accent: "text-rose-800" },
  knowledge: { border: "border-emerald-200/80", bg: "bg-gradient-to-br from-emerald-50/60 to-white", accent: "text-emerald-800" },
};

export function DigitalVenturesSection({ dict }: DigitalVenturesSectionProps) {
  const { ventures } = dict;

  return (
    <section className="section-padding bg-surface-950 text-white" aria-labelledby="ventures-heading">
      <div className="container-main">
        <SectionHeader
          id="ventures-heading"
          eyebrow={ventures.eyebrow}
          title={ventures.title}
          description={ventures.description}
          align="center"
          className="[&_h2]:text-white [&_p]:text-surface-300 [&_p:first-child]:text-brand-300"
        />

        <div className="mt-12 space-y-6">
          {ventures.units.map((unit, index) => {
            const theme = UNIT_THEMES[unit.id] ?? UNIT_THEMES.site;
            const statusClass = STATUS_STYLES[unit.statusType] ?? STATUS_STYLES.launchPrep;
            const reverse = index % 2 === 1;

            return (
              <article
                key={unit.id}
                className={`overflow-hidden rounded-2xl border ${theme.border} ${theme.bg} text-surface-900 shadow-lg ${
                  reverse ? "lg:flex-row-reverse" : ""
                } lg:flex`}
              >
                <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 lg:max-w-[52%]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass}`}>
                      {unit.status}
                    </span>
                    {unit.formats?.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-medium text-surface-600 ring-1 ring-surface-200"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <h3 className={`mt-4 text-xl font-bold sm:text-2xl ${theme.accent}`}>{unit.title}</h3>
                  <p className="mt-1 text-sm font-medium text-surface-500">{unit.subtitle}</p>
                  {unit.audience && (
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide text-surface-400">
                      {unit.audience}
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-surface-600 sm:text-base">{unit.description}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {unit.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-surface-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <LocalizedButton href={unit.ctaHref} variant="primary" className="min-h-11 w-full sm:w-auto">
                      {unit.cta}
                    </LocalizedButton>
                  </div>
                </div>
                <div className="border-t border-surface-200/60 bg-white/40 p-5 sm:p-8 lg:w-[48%] lg:border-t-0 lg:border-l">
                  <VenturePortfolioVisual type={unit.visual} title={unit.title} />
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-surface-400">
          <LocalizedLink href="/products" className="font-medium text-brand-300 hover:text-brand-200 hover:underline">
            {dict.results.viewAll} →
          </LocalizedLink>
        </p>
      </div>
    </section>
  );
}
