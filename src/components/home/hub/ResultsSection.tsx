import Link from "next/link";
import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getVisibleProducts } from "@/lib/product-catalog";
import type { HomeDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { ProductStatus } from "@/types/product";
import { localizePath } from "@/i18n/localized-path";

interface ResultsSectionProps {
  dict: HomeDictionary;
  locale: Locale;
}

const PIPELINE_SLOTS = [
  { type: "app", labelKo: "앱", labelEn: "App" },
  { type: "ebook", labelKo: "전자책", labelEn: "E-book" },
  { type: "automation", labelKo: "자동화", labelEn: "Automation" },
  { type: "content", labelKo: "콘텐츠", labelEn: "Content" },
] as const;

function statusLabel(status: ProductStatus, labels: HomeDictionary["results"]["statusLabels"]): string {
  switch (status) {
    case "testing":
      return labels.testing;
    case "ready":
      return labels.ready;
    case "published":
      return labels.published;
    case "draft":
      return labels.comingSoon;
    default:
      return labels.demo;
  }
}

export function ResultsSection({ dict, locale }: ResultsSectionProps) {
  const { results } = dict;
  const products = getVisibleProducts();

  return (
    <section className="section-padding bg-gradient-to-b from-surface-50 to-white" aria-labelledby="results-heading">
      <div className="container-main">
        <SectionHeader
          id="results-heading"
          eyebrow={results.eyebrow}
          title={results.title}
          description={results.description}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-md lg:col-span-1"
            >
              <div className="border-b border-surface-100 bg-gradient-to-br from-brand-50 to-white p-6">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold uppercase text-surface-600 ring-1 ring-surface-200">
                    {product.type}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    {statusLabel(product.status, results.statusLabels)}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-surface-900">
                  {locale === "en" && product.slug === "electrical-inspection-check"
                    ? "Electrical Inspection Check App"
                    : product.title}
                </h3>
                {product.subtitle && (
                  <p className="mt-1 text-sm font-medium text-surface-500">
                    {locale === "en" && product.slug === "electrical-inspection-check"
                      ? "Field electrical inspection support"
                      : product.subtitle}
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="flex-1 text-sm leading-relaxed text-surface-600">
                  {locale === "en" && product.slug === "electrical-inspection-check"
                    ? "An app supporting checklist and inspection records for electrical facility work—currently in development and validation."
                    : product.description}
                </p>
                <Link
                  href={localizePath(`/products/${product.slug}`, locale)}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  {results.viewDetail}
                </Link>
              </div>
            </article>
          ))}

          {PIPELINE_SLOTS.filter((s) => !products.some((p) => p.type === s.type)).map((slot) => (
            <article
              key={slot.type}
              className="flex flex-col rounded-2xl border border-dashed border-surface-300 bg-surface-50/80 p-6"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                {locale === "en" ? slot.labelEn : slot.labelKo}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-surface-800">
                {locale === "en" ? "Launch preparation" : "출시 준비"}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">
                {results.emptyDescription}
              </p>
              <span className="mt-4 inline-flex w-fit rounded-full bg-surface-200 px-3 py-1 text-xs font-medium text-surface-600">
                {results.statusLabels.ready}
              </span>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <LocalizedButton href="/products" variant="outline" className="min-h-11">
            {results.viewAll}
          </LocalizedButton>
        </div>
      </div>
    </section>
  );
}
