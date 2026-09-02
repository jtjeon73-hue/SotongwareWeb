import { Button } from "@/components/ui/Button";
import type { HomeDictionary } from "@/i18n/types";

interface HubFinalCtaSectionProps {
  dict: HomeDictionary;
}

export function HubFinalCtaSection({ dict }: HubFinalCtaSectionProps) {
  const { finalCta } = dict;
  const [primary, ...others] = finalCta.actions;

  return (
    <section className="section-padding bg-brand-950 text-white" aria-labelledby="final-cta-heading">
      <div className="container-main max-w-3xl text-center">
        <h2 id="final-cta-heading" className="text-2xl font-bold sm:text-3xl">
          {finalCta.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-brand-100">{finalCta.description}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button href={primary.href} variant="primary" size="lg" className="min-h-11 w-full sm:w-auto">
            {primary.label}
          </Button>
          {others.map((action) => (
            <Button
              key={action.href + action.label}
              href={action.href}
              variant="secondary"
              size="lg"
              className="min-h-11 w-full !border-white/25 !bg-white/10 !text-white hover:!bg-white/20 sm:w-auto"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
