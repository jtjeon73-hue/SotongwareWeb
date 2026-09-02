import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import type { HomeDictionary } from "@/i18n/types";
import { CapabilityVisual } from "./CapabilityVisual";

interface CapabilitiesSectionProps {
  dict: HomeDictionary;
}

export function CapabilitiesSection({ dict }: CapabilitiesSectionProps) {
  const { capabilities } = dict;

  return (
    <section className="section-padding bg-white" aria-labelledby="capabilities-heading">
      <div className="container-main">
        <SectionHeader
          id="capabilities-heading"
          eyebrow={capabilities.eyebrow}
          title={capabilities.title}
          description={capabilities.description}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {capabilities.items.map((item) => (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-surface-200 bg-surface-50/50 p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <CapabilityVisual type={item.id} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-surface-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-surface-600">{item.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-surface-600 ring-1 ring-surface-200"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <LocalizedLink
                    href={`/capabilities/${item.slug}`}
                    className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-brand-700 hover:text-brand-800"
                  >
                    {dict.nav.learnMore} →
                  </LocalizedLink>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <LocalizedButton href={capabilities.ctaHref} variant="outline" className="min-h-11">
            {capabilities.cta}
          </LocalizedButton>
        </div>
      </div>
    </section>
  );
}
