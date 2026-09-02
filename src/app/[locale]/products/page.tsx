import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { pageLabels } from "@/i18n/page-labels";
import { ProductsPageView } from "@/views/ProductsPageView";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].products;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/products" });
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  return <ProductsPageView locale={locale} />;
}
