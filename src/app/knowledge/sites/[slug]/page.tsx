import { RedirectToLocale } from "@/components/locale/RedirectToLocale";
import { knowledgeSiteSlugs } from "@/data/service-catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return knowledgeSiteSlugs().map((slug) => ({ slug }));
}

export default async function KnowledgeSiteRedirect({ params }: PageProps) {
  const { slug } = await params;
  return <RedirectToLocale path={`/knowledge/sites/${slug}`} />;
}
