import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { worksCopy } from "@/i18n/page-labels";
import { getProductCountTier, getVisibleProducts } from "@/lib/product-catalog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCatalog } from "@/components/product/ProductCatalog";

export function WorksPageView({ locale }: { locale: Locale }) {
  const tier = getProductCountTier(getVisibleProducts().length);
  const copy = worksCopy[locale][tier];
  const loading = locale === "en" ? "Loading…" : "로딩 중…";

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={`${copy.description} ${copy.catalogNote}`}
        />
        <Suspense fallback={<p className="text-surface-600">{loading}</p>}>
          <ProductCatalog />
        </Suspense>
      </div>
    </div>
  );
}
