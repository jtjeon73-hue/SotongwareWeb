import type { Locale } from "@/i18n/config";
import type { CapabilityPageDictionary } from "@/i18n/site-types";
import { localizePath } from "@/i18n/localized-path";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CapabilityFlowDiagram } from "./CapabilityFlowDiagram";
import { CapabilityHeroVisual } from "./CapabilityHeroVisual";

interface CapabilityPageViewProps {
  locale: Locale;
  slug: string;
  content: CapabilityPageDictionary;
}

export function CapabilityPageView({ locale, slug, content }: CapabilityPageViewProps) {
  const c = content;
  const lp = (path: string) => localizePath(path, locale);

  return (
    <>
      <section className="relative overflow-hidden bg-surface-950 text-white section-padding !pb-12">
        <div className="container-main">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">{c.hero.eyebrow}</p>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{c.hero.title}</h1>
              <p className="mt-4 text-base leading-relaxed text-surface-300 sm:text-lg">{c.hero.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {c.hero.ctas.map((cta) => (
                  <Button
                    key={cta.href + cta.label}
                    href={lp(cta.href)}
                    variant={cta.variant === "primary" ? "primary" : "secondary"}
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
            <CapabilityHeroVisual slug={slug} />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main max-w-4xl">
          <SectionHeader title={c.problems.title} />
          <ul className="mt-8 space-y-4">
            {c.problems.items.map((item) => (
              <li key={item.title} className="rounded-xl border border-surface-200 p-5">
                <h2 className="font-semibold text-surface-900">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding section-alt">
        <div className="container-main">
          <SectionHeader title={c.strengths.title} align="center" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {c.strengths.items.map((item) => (
              <article key={item.title} className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-surface-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader title={c.flow.title} description={c.flow.description} />
          <CapabilityFlowDiagram nodes={c.flow.nodes} />
        </div>
      </section>

      <section className="section-padding section-alt">
        <div className="container-main max-w-4xl">
          <SectionHeader title={c.applications.title} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {c.applications.applicable.map((item) => (
              <li key={item.title} className="rounded-xl border border-surface-200 bg-white p-5">
                <h3 className="font-semibold text-surface-900">{item.title}</h3>
                <p className="mt-1 text-sm text-surface-600">{item.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-surface-500">{c.applications.note}</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <SectionHeader title={c.deliverables.title} />
          <ul className="mt-6 space-y-2">
            {c.deliverables.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-surface-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-surface-900 text-white">
        <div className="container-main">
          <SectionHeader title={c.process.title} align="center" />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.process.steps.map((step) => (
              <li key={step.step} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <span className="text-sm font-bold text-brand-300">Step {step.step}</span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-surface-400">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding section-alt">
        <div className="container-main max-w-3xl text-center">
          <SectionHeader title={c.portfolio.title} align="center" />
          <div className="mt-6 rounded-2xl border border-dashed border-surface-300 bg-white p-8">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              {c.portfolio.statusLabel}
            </span>
            <p className="mt-4 text-sm text-surface-600">{c.portfolio.emptyNote}</p>
            <Button href={lp("/products")} variant="outline" className="mt-6 min-h-11">
              Portfolio
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <SectionHeader title={c.faq.title} />
          <dl className="mt-8 space-y-4">
            {c.faq.items.map((item) => (
              <div key={item.q} className="rounded-xl border border-surface-200 p-5">
                <dt className="font-semibold text-surface-900">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-surface-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-padding bg-brand-950 text-white">
        <div className="container-main max-w-2xl text-center">
          <h2 className="text-2xl font-bold">{c.finalCta.title}</h2>
          <p className="mt-4 text-brand-100">{c.finalCta.description}</p>
          <Button href={lp(c.finalCta.ctaHref)} variant="primary" size="lg" className="mt-8 min-h-11">
            {c.finalCta.cta}
          </Button>
        </div>
      </section>
    </>
  );
}
