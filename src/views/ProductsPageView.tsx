import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { catalogUi } from "@/i18n/product-labels";
import {
  getFeaturedProducts,
  getProductCountTier,
  getVisibleProducts,
} from "@/lib/product-catalog";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { FeaturedProductShowcase } from "@/components/product/FeaturedProductShowcase";

export function ProductsPageView({ locale }: { locale: Locale }) {
  const ui = catalogUi[locale];
  const allVisible = getVisibleProducts();
  const tier = getProductCountTier(allVisible.length);
  const featured = getFeaturedProducts(allVisible);
  const showFeatured = tier === "single" && featured.length === 1;

  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-6xl">
        <header className="mb-10 rounded-2xl border border-surface-200 bg-gradient-to-br from-surface-50 via-white to-brand-50/30 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{ui.heroEyebrow}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">{ui.heroTitle}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface-600 sm:text-base">{ui.heroDescription}</p>
        </header>

        {showFeatured && featured[0] && (
          <div className="mb-8">
            <FeaturedProductShowcase product={featured[0]} locale={locale} />
          </div>
        )}

        <Suspense fallback={<p className="text-surface-600">{locale === "en" ? "Loading…" : "로딩 중…"}</p>}>
          <ProductCatalog skipFeaturedShowcase={showFeatured} />
        </Suspense>
      </div>
    </div>
  );
}
