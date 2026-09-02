import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getVisibleProducts } from "@/lib/product-catalog";
import type { HomeDictionary } from "@/i18n/types";
import type { ProductStatus } from "@/types/product";

interface ResultsSectionProps {
  dict: HomeDictionary;
}

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

export function ResultsSection({ dict }: ResultsSectionProps) {
  const { results } = dict;
  const products = getVisibleProducts();

  return (
    <section className="section-padding bg-white" aria-labelledby="results-heading">
      <div className="container-main">
        <SectionHeader
          id="results-heading"
          eyebrow={results.eyebrow}
          title={results.title}
          description={results.description}
        />

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-300 bg-surface-50 p-8 text-center">
            <h3 className="text-lg font-semibold text-surface-800">{results.emptyTitle}</h3>
            <p className="mt-2 text-sm text-surface-600">{results.emptyDescription}</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <article className="flex h-full flex-col rounded-2xl border border-surface-200 bg-surface-50/50 p-5 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-surface-600 ring-1 ring-surface-200">
                      {product.type}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      {statusLabel(product.status, results.statusLabels)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-bold text-surface-900">{product.title}</h3>
                  {product.subtitle && (
                    <p className="mt-1 text-sm text-surface-500">{product.subtitle}</p>
                  )}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex min-h-10 items-center text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      {results.viewDetail} →
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {products.length > 0 && (
          <div className="mt-8 text-center">
            <Button href="/products" variant="outline" className="min-h-11">
              {results.viewAll}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
