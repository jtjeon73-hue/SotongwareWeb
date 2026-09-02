"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { AccessMode, ProductType } from "@/types/product";
import { filterProducts } from "@/data/products";
import {
  getVisibleProducts,
  getProductCountTier,
  getFeaturedProducts,
  getPreparingProducts,
  getRecentlyUpdatedProducts,
} from "@/lib/product-catalog";
import { getProductSearchText } from "@/lib/product-i18n";
import { useLocale } from "@/contexts/LocaleProvider";
import {
  catalogUi,
  getMerchandiseTitle,
  pipelineVentures,
  ACCESS_LABELS,
} from "@/i18n/product-labels";
import { ProductGrid } from "./ProductGrid";
import { ProductsEmptyState } from "@/components/shared/ProductsEmptyState";
import { ProductCard } from "./ProductCard";
import { FeaturedProductShowcase } from "./FeaturedProductShowcase";
import { LocalizedLink } from "@/components/locale/LocalizedLink";

interface ProductCatalogProps {
  initialType?: ProductType | "all";
  initialAccess?: AccessMode | "all";
  skipFeaturedShowcase?: boolean;
}

export function ProductCatalog({
  initialType = "all",
  initialAccess = "all",
  skipFeaturedShowcase = false,
}: ProductCatalogProps) {
  const { locale } = useLocale();
  const ui = catalogUi[locale];
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") as ProductType | null;
  const urlAccess = searchParams.get("access") as AccessMode | null;

  const [type, setType] = useState<ProductType | "all">(initialType);
  const [accessMode, setAccessMode] = useState<AccessMode | "all">(initialAccess);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (urlType) setType(urlType);
    if (urlAccess) setAccessMode(urlAccess);
  }, [urlType, urlAccess]);

  const allVisible = useMemo(() => getVisibleProducts(), []);
  const tier = getProductCountTier(allVisible.length);

  const products = useMemo(() => {
    const base = filterProducts({ type, accessMode, query: "" });
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter((p) => getProductSearchText(p, locale).includes(q));
  }, [type, accessMode, query, locale]);

  const showMerchandising = type === "all" && !query.trim() && tier !== "empty" && !skipFeaturedShowcase;
  const featured = getFeaturedProducts(allVisible);
  const isSingleFeatured = !skipFeaturedShowcase && tier === "single" && featured.length === 1;

  const typeOptions: { value: ProductType | "all"; label: string }[] = [
    { value: "all", label: ui.types.all },
    { value: "app", label: ui.types.app },
    { value: "ebook", label: ui.types.ebook },
    { value: "knowledge", label: ui.types.knowledge },
    { value: "content", label: ui.types.content },
    { value: "automation", label: ui.types.automation },
    { value: "marketing", label: ui.types.marketing },
  ];

  const accessOptions: { value: AccessMode | "all"; label: string }[] = [
    { value: "all", label: ui.accessAll },
    { value: "free", label: ACCESS_LABELS[locale].free },
    { value: "paid", label: ACCESS_LABELS[locale].paid },
    { value: "subscription", label: ACCESS_LABELS[locale].subscription },
    { value: "inquiry", label: ACCESS_LABELS[locale].inquiry },
  ];

  return (
    <div>
      {showMerchandising && (
        <div className="mb-8 space-y-8">
          {isSingleFeatured ? (
            <FeaturedProductShowcase product={featured[0]} locale={locale} />
          ) : (
            <MerchandiseSection
              locale={locale}
              title={getMerchandiseTitle(locale, tier, "featured")}
              description={
                tier === "single" ? ui.featuredDescriptionSingle : ui.featuredDescriptionMulti
              }
              products={featured}
            />
          )}

          <VenturePipeline locale={locale} />

          {getPreparingProducts(allVisible).length > 0 && !isSingleFeatured && (
            <MerchandiseSection
              locale={locale}
              title={getMerchandiseTitle(locale, tier, "preparing")}
              description={ui.preparingDescription}
              products={getPreparingProducts(allVisible)}
              compact
            />
          )}
          {tier === "many" && getRecentlyUpdatedProducts(allVisible, 3).length > 0 && (
            <MerchandiseSection
              locale={locale}
              title={getMerchandiseTitle(locale, tier, "recent")}
              products={getRecentlyUpdatedProducts(allVisible, 3)}
              compact
            />
          )}
        </div>
      )}

      <div className="mb-6 space-y-4 rounded-xl border border-surface-200 bg-white p-4 sm:p-5">
        <div>
          <label htmlFor="product-search" className="sr-only">
            {ui.searchLabel}
          </label>
          <input
            id="product-search"
            type="search"
            placeholder={ui.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-surface-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs font-semibold uppercase tracking-wider text-surface-500 sm:w-auto sm:self-center">
            {ui.typeLabel}
          </span>
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`min-h-11 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:min-h-0 ${
                type === opt.value
                  ? "bg-brand-600 text-white"
                  : "bg-surface-100 text-surface-700 hover:bg-surface-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs font-semibold uppercase tracking-wider text-surface-500 sm:w-auto sm:self-center">
            {ui.accessLabel}
          </span>
          {accessOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAccessMode(opt.value)}
              className={`min-h-11 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:min-h-0 ${
                accessMode === opt.value
                  ? "bg-brand-600 text-white"
                  : "bg-surface-100 text-surface-700 hover:bg-surface-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-surface-600">{ui.productCount(products.length)}</p>
          <ProductGrid products={products} />
        </>
      ) : (
        <ProductsEmptyState />
      )}
    </div>
  );
}

function VenturePipeline({ locale }: { locale: "ko" | "en" }) {
  const ui = catalogUi[locale];
  const items = pipelineVentures[locale];

  return (
    <section aria-labelledby="venture-pipeline-heading">
      <h2 id="venture-pipeline-heading" className="text-lg font-bold text-surface-900">
        {ui.pipelineTitle}
      </h2>
      <p className="mt-1 text-sm text-surface-600">{ui.pipelineDescription}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <LocalizedLink
            key={item.id}
            href={item.href}
            className="rounded-xl border border-dashed border-surface-300 bg-surface-50/80 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/30"
          >
            <p className="font-semibold text-surface-900">{item.label}</p>
            <p className="mt-1 text-xs font-medium text-amber-700">{item.status}</p>
          </LocalizedLink>
        ))}
      </div>
    </section>
  );
}

function MerchandiseSection({
  locale,
  title,
  description,
  products,
  compact,
}: {
  locale: "ko" | "en";
  title: string;
  description?: string;
  products: ReturnType<typeof getFeaturedProducts>;
  compact?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-surface-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-surface-600">{description}</p>}
      <div className={`mt-4 grid gap-4 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}
