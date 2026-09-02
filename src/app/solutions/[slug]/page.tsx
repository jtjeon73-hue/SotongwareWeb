import { RedirectToLocale } from "@/components/locale/RedirectToLocale";
import { SOLUTION_SLUGS } from "@/i18n/routes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SOLUTION_SLUGS.map((slug) => ({ slug }));
}

export default async function SolutionSlugRedirect({ params }: Props) {
  const { slug } = await params;
  return <RedirectToLocale path={`/solutions/${slug}`} />;
}
