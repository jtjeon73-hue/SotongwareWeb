import { RedirectToLocale } from "@/components/locale/RedirectToLocale";
import { contentCatalogSlugs } from "@/data/service-catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return contentCatalogSlugs().map((slug) => ({ slug }));
}

export default async function ContentDetailRedirect({ params }: PageProps) {
  const { slug } = await params;
  return <RedirectToLocale path={`/contents/${slug}`} />;
}
