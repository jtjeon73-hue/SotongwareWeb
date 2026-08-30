import { Button } from "@/components/ui/Button";
import { heroContent } from "@/data/home";
import { siteConfig } from "@/data/navigation";
import { HeroCapabilityVisual } from "./HeroCapabilityVisual";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface-900 text-white" aria-labelledby="hero-heading">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-900)_0%,_transparent_55%)] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_50%,_var(--color-surface-900)_100%)]" />

      <div className="container-main relative section-padding !pb-14 sm:!pb-16 lg:!pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <p className="text-sm font-medium tracking-wide text-brand-300">
              {siteConfig.name} · {siteConfig.nameKo}
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-widest text-surface-400">
              {heroContent.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="mt-4 text-[1.75rem] font-bold leading-[1.2] tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]"
            >
              {heroContent.headline.split(",").map((part, i, arr) => (
                <span key={part.trim()}>
                  {part.trim()}
                  {i < arr.length - 1 ? "," : ""}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-surface-300 sm:text-lg">
              {heroContent.subheadline}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {heroContent.ctas.map((cta) => (
                <Button
                  key={cta.href + cta.label}
                  href={cta.href}
                  variant={cta.variant}
                  size="lg"
                  className={
                    cta.variant !== "primary"
                      ? "min-h-11 !border-white/25 !bg-white/10 !text-white hover:!bg-white/20"
                      : "min-h-11"
                  }
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>
          <HeroCapabilityVisual />
        </div>

        <div className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-3">
          {heroContent.highlights.map((item) => (
            <div key={item.label} className="sm:px-2">
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-surface-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
