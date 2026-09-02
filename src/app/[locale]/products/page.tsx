import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { pageLabels } from "@/i18n/page-labels";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCatalog } from "@/components/product/ProductCatalog";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].products;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/products" });
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].products;
  const loading = locale === "en" ? "Loading…" : "로딩 중…";

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Product Catalog"
          title={l.title}
          description={l.description}
        />
        <Suspense fallback={<p className="text-surface-600">{loading}</p>}>
          <ProductCatalog />
        </Suspense>
      </div>
    </div>
  );
}
