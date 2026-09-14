import { RedirectToLocale } from "@/components/locale/RedirectToLocale";
import { ebookCatalogSlugs } from "@/data/service-catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ebookCatalogSlugs().map((slug) => ({ slug }));
}

export default async function EbookDetailRedirect({ params }: PageProps) {
  const { slug } = await params;
  return <RedirectToLocale path={`/ebooks/${slug}`} />;
}
