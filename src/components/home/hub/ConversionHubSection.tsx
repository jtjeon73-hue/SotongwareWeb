import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { HomeDictionary } from "@/i18n/types";

interface ConversionHubSectionProps {
  dict: HomeDictionary;
}

export function ConversionHubSection({ dict }: ConversionHubSectionProps) {
  const { conversion } = dict;

  return (
    <section className="section-padding section-alt" aria-labelledby="conversion-heading">
      <div className="container-main">
        <SectionHeader
          id="conversion-heading"
          eyebrow={conversion.eyebrow}
          title={conversion.title}
          description={conversion.description}
          align="center"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {conversion.items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col rounded-2xl border border-surface-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-surface-900">{item.title}</h3>
                {item.badge && (
                  <span className="shrink-0 rounded-full bg-surface-100 px-2 py-0.5 text-xs font-semibold text-surface-600">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">{item.description}</p>
              <div className="mt-5">
                <Button href={item.ctaHref} variant={item.id === "consult" ? "primary" : "outline"} className="min-h-11">
                  {item.cta}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
