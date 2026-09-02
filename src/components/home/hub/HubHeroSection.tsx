import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/navigation";
import type { HomeDictionary } from "@/i18n/types";
import { HubHeroVisual } from "./HubHeroVisual";

interface HubHeroSectionProps {
  dict: HomeDictionary;
}

export function HubHeroSection({ dict }: HubHeroSectionProps) {
  const { hero } = dict;
  const [primary, ...secondaryCtas] = hero.ctas;

  return (
    <section
      className="relative overflow-hidden bg-surface-950 text-white"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,_#064b8540_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_100%,_#16653430_0%,_transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_60%,_var(--color-surface-950)_100%)]" />

      <div className="container-main relative section-padding !pb-12 sm:!pb-14 lg:!pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12 xl:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <p className="text-sm font-medium tracking-wide text-brand-300">{siteConfig.name}</p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-surface-400">
              {hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="mt-4 text-[1.75rem] font-bold leading-[1.18] tracking-tight sm:text-4xl lg:text-[2.35rem] lg:leading-[1.12]"
            >
              {hero.headline}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-surface-300 sm:text-lg">
              {hero.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href={primary.href} variant="primary" size="lg" className="min-h-11 w-full sm:w-auto">
                {primary.label}
              </Button>
              {secondaryCtas.map((cta) => (
                <Button
                  key={cta.href + cta.label}
                  href={cta.href}
                  variant="secondary"
                  size="lg"
                  className="min-h-11 w-full !border-white/25 !bg-white/10 !text-white hover:!bg-white/20 sm:w-auto"
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>
          <HubHeroVisual />
        </div>

        <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          {hero.highlights.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/8 bg-white/4 p-4 sm:px-2 sm:border-0 sm:bg-transparent sm:p-0">
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-surface-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
