import { RedirectToLocale } from "@/components/locale/RedirectToLocale";
import { allProducts } from "@/data/products";

const BUILD_PLACEHOLDER = "__build__";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const slugs = allProducts.filter((p) => p.status !== "draft").map((p) => ({ slug: p.slug }));
  if (slugs.length === 0) return [{ slug: BUILD_PLACEHOLDER }];
  return slugs;
}

export default async function ProductSlugRedirect({ params }: Props) {
  const { slug } = await params;
  return <RedirectToLocale path={`/products/${slug}`} />;
}
