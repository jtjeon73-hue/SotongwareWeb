import { RedirectToLocale } from "@/components/locale/RedirectToLocale";
import { services } from "@/data/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceSlugRedirect({ params }: Props) {
  const { slug } = await params;
  return <RedirectToLocale path={`/services/${slug}`} />;
}
