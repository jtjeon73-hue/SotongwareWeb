import { notFound } from "next/navigation";
import { allProducts, getProductBySlug } from "@/data/products";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { createPageMetadata } from "@/lib/page-metadata";
import { hasValidUrl } from "@/lib/products";

/** static export 빌드용 — 실제 상품 없을 때만 사용, always notFound */
const BUILD_PLACEHOLDER = "__build__";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const slugs = allProducts
    .filter((p) => p.status !== "draft")
    .map((p) => ({ slug: p.slug }));
  if (slugs.length === 0) return [{ slug: BUILD_PLACEHOLDER }];
  return slugs;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (slug === BUILD_PLACEHOLDER) return { title: "상품" };
  const product = getProductBySlug(slug);
  if (!product) return { title: "상품" };
  return createPageMetadata({
    title: product.title,
    description: product.description,
    path: `/products/${slug}`,
  });
}

function ProductExtraContent({ product }: { product: ReturnType<typeof getProductBySlug> }) {
  if (!product) return null;

  if (product.type === "app" && product.appMeta) {
    return (
      <div className="mt-10 space-y-6">
        {product.appMeta.features?.map((f) => (
          <p key={f} className="text-sm text-surface-700">• {f}</p>
        ))}
        {product.appMeta.version && <p className="text-sm text-surface-600">버전: {product.appMeta.version}</p>}
        {product.appMeta.os && <p className="text-sm text-surface-600">지원 OS: {product.appMeta.os.join(", ")}</p>}
      </div>
    );
  }

  if (product.type === "ebook" && product.ebookMeta) {
    return (
      <div className="mt-10 space-y-4 text-sm text-surface-700">
        {product.ebookMeta.author && <p>저자: {product.ebookMeta.author}</p>}
        {product.ebookMeta.tableOfContents && (
          <ol className="list-decimal pl-5">
            {product.ebookMeta.tableOfContents.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        )}
      </div>
    );
  }

  if (product.type === "knowledge") {
    return (
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Paywall·결제·회원 연동 준비 중
      </div>
    );
  }

  if (product.type === "content" && product.contentMeta) {
    return (
      <div className="mt-8 text-sm text-surface-600">
        {product.contentMeta.commissionAvailable && (
          <p className="font-medium text-brand-700">제작 의뢰 가능</p>
        )}
        {hasValidUrl(product.contentMeta.embedUrl) && (
          <a href={product.contentMeta.embedUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
            콘텐츠 보기 ↗
          </a>
        )}
      </div>
    );
  }

  return null;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  if (slug === BUILD_PLACEHOLDER) notFound();

  const product = getProductBySlug(slug);
  if (!product || product.status === "draft") notFound();

  const backMap: Record<string, { href: string; label: string }> = {
    app: { href: "/apps", label: "앱 목록" },
    ebook: { href: "/ebooks", label: "전자책 목록" },
    knowledge: { href: "/knowledge", label: "지식·교육" },
    content: { href: "/contents", label: "콘텐츠" },
    marketing: { href: "/marketing", label: "마케팅" },
    automation: { href: "/automation", label: "산업자동화" },
  };
  const back = backMap[product.type] ?? { href: "/products", label: "상품 목록" };

  return (
    <ProductDetailView product={product} backHref={back.href} backLabel={back.label}>
      <ProductExtraContent product={product} />
    </ProductDetailView>
  );
}
