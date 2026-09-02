import { RedirectToLocale } from "@/components/locale/RedirectToLocale";
import { WORK_SLUGS } from "@/i18n/routes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return WORK_SLUGS.map((slug) => ({ slug }));
}

export default async function WorksSlugRedirect({ params }: Props) {
  const { slug } = await params;
  return <RedirectToLocale path={`/works/${slug}`} />;
}
