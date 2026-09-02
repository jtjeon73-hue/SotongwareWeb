import Link from "next/link";
import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getVisibleProducts } from "@/lib/product-catalog";
import { pipelineVentures } from "@/i18n/product-labels";
import type { HomeDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/localized-path";
import { getLocalizedProduct } from "@/lib/product-i18n";

interface ResultsSectionProps {
  dict: HomeDictionary;
  locale: Locale;
}

export function ResultsSection({ dict, locale }: ResultsSectionProps) {
  const { results } = dict;
  const products = getVisibleProducts();
  const pipeline = pipelineVentures[locale];
  const hasProducts = products.length > 0;

  return (
    <section className="section-padding bg-gradient-to-b from-surface-50 to-white" aria-labelledby="results-heading">
      <div className="container-main">
        <SectionHeader
          id="results-heading"
          eyebrow={results.eyebrow}
          title={hasProducts ? results.title : results.emptyTitle}
          description={hasProducts ? results.description : results.emptyDescription}
        />

        {hasProducts ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {products.map((product) => {
              const localized = getLocalizedProduct(product, locale);
              return (
                <article
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-md"
                >
                  <div className="border-b border-surface-100 bg-gradient-to-br from-brand-50 to-white p-6">
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold uppercase text-surface-600 ring-1 ring-surface-200">
                      {product.type}
                    </span>
                    <h3 className="mt-4 text-xl font-bold text-surface-900">{localized.title}</h3>
                    {localized.subtitle && (
                      <p className="mt-1 text-sm font-medium text-surface-500">{localized.subtitle}</p>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex-1 text-sm leading-relaxed text-surface-600">{localized.description}</p>
                    <Link
                      href={localizePath(`/products/${product.slug}`, locale)}
                      className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
                    >
                      {results.viewDetail}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pipeline.map((item) => (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl border border-surface-200 bg-white p-5 shadow-sm"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">{item.label}</span>
                <p className="mt-2 text-sm font-medium text-surface-800">{item.status}</p>
                <LocalizedButton href={item.href} variant="outline" className="mt-4 min-h-10 w-full text-sm">
                  {locale === "en" ? "Learn more" : "자세히 보기"}
                </LocalizedButton>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <LocalizedButton href="/products" variant="outline" className="min-h-11">
            {results.viewAll}
          </LocalizedButton>
        </div>
      </div>
    </section>
  );
}
