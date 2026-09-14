import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { siteConfig } from "@/data/navigation";
import type { HomeDictionary } from "@/i18n/types";
import { HubHeroVisual } from "./HubHeroVisual";

interface HubHeroSectionProps {
  dict: HomeDictionary;
  locale?: "ko" | "en";
}

export function HubHeroSection({ dict, locale = "ko" }: HubHeroSectionProps) {
  const { hero } = dict;
  const [primary, ...secondaryCtas] = hero.ctas;

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_42%,#eef7ff_100%)] text-surface-900"
      aria-labelledby="hero-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(56,189,248,0.22),transparent_50%),radial-gradient(ellipse_at_88%_20%,rgba(14,165,233,0.14),transparent_45%),radial-gradient(ellipse_at_50%_100%,rgba(125,211,252,0.18),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent"
      />

      <div className="container-main relative section-padding !pb-12 sm:!pb-14 lg:!pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <div className="min-w-0 max-w-xl lg:max-w-none">
            <p className="text-sm font-semibold tracking-wide text-brand-700">{siteConfig.name}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-sky-700/80">
              {hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="mt-4 max-w-full text-[1.65rem] font-bold leading-[1.2] tracking-tight text-balance break-keep hyphens-none text-surface-950 sm:text-3xl md:text-4xl lg:text-[2.35rem] lg:leading-[1.12]"
            >
              {hero.headline}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-surface-600 sm:text-lg">
              {hero.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <LocalizedButton href={primary.href} variant="primary" size="lg" className="min-h-11 w-full sm:w-auto">
                {primary.label}
              </LocalizedButton>
              {secondaryCtas.map((cta) => (
                <LocalizedButton
                  key={cta.href + cta.label}
                  href={cta.href}
                  variant="secondary"
                  size="lg"
                  className="min-h-11 w-full sm:w-auto"
                >
                  {cta.label}
                </LocalizedButton>
              ))}
            </div>
          </div>
          <HubHeroVisual locale={locale} />
        </div>

        <div className="mt-10 grid gap-4 border-t border-sky-100 pt-8 sm:grid-cols-3">
          {hero.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-sky-100/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:px-3"
            >
              <p className="text-sm font-semibold text-surface-900">{item.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-surface-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
