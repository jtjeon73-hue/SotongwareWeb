import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getSiteDictionary } from "@/i18n/get-dictionary";
import { localizePath } from "@/i18n/localized-path";
import { businessAreas } from "@/data/businesses";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export function AboutPageView({ locale }: { locale: Locale }) {
  const p = getSiteDictionary(locale).pages.about;

  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-4xl">
        <SectionHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

        <div className="mt-8 rounded-2xl border border-surface-200 bg-surface-50 p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-surface-500">
            {p.journeyTitle}
          </p>
          <ul className="mt-6 space-y-4">
            {p.blocks.map((block, index) => (
              <li key={block.titleEn} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-base font-semibold text-surface-900">
                    {block.title}
                    <span className="ml-2 text-xs font-normal text-surface-500">{block.titleEn}</span>
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-surface-600">{block.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-bold text-surface-900">{p.servicesTitle}</h2>
          <p className="mt-2 text-sm text-surface-600">{p.servicesDescription}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {businessAreas.map((area) => (
              <li key={area.id} className="rounded-xl border border-surface-200 p-4">
                <Link
                  href={localizePath(area.internalPath, locale)}
                  className="font-semibold text-surface-900 hover:text-brand-700"
                >
                  {locale === "en" ? area.title : area.titleKo}
                </Link>
                <p className="mt-1 text-sm text-surface-600">{area.tagline}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={localizePath("/contact", locale)} variant="primary">
            {p.ctaContact}
          </Button>
          <Button href={localizePath("/products", locale)} variant="outline">
            {p.ctaProducts}
          </Button>
          <Button href={localizePath("/", locale)} variant="outline">
            {getSiteDictionary(locale).common.backHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
