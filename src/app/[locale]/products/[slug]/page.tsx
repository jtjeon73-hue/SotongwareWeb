import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { allProducts, getProductBySlug } from "@/data/products";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { localizePath } from "@/i18n/localized-path";
import { hasValidUrl } from "@/lib/products";

const BUILD_PLACEHOLDER = "__build__";

type PageProps = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  const slugs = allProducts
    .filter((p) => p.status !== "draft")
    .map((p) => p.slug);
  if (slugs.length === 0) {
    return locales.flatMap((locale) => [{ locale, slug: BUILD_PLACEHOLDER }]);
  }
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  if (slug === BUILD_PLACEHOLDER) return { title: locale === "en" ? "Product" : "상품" };
  const product = getProductBySlug(slug);
  if (!product) return { title: locale === "en" ? "Product" : "상품" };
  return createLocalePageMetadata({
    locale,
    title: product.title,
    description: product.description,
    path: `/products/${slug}`,
  });
}

function ProductExtraContent({
  product,
  locale,
}: {
  product: NonNullable<ReturnType<typeof getProductBySlug>>;
  locale: Locale;
}) {
  if (product.type === "app" && product.appMeta) {
    const featuresTitle = locale === "en" ? "Key features" : "주요 기능";
    const statusTitle = locale === "en" ? "Release status" : "출시 상태";
    const statusText = locale === "en" ? "Google Play Store: preparing for launch" : "Google Play Store: 출시 준비 중";
    return (
      <div className="mt-10 space-y-6">
        {product.appMeta.features?.length ? (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500">{featuresTitle}</h2>
            <ul className="mt-3 space-y-2">
              {product.appMeta.features.map((f) => (
                <li key={f} className="text-sm text-surface-700">
                  • {f}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="text-sm text-surface-600">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500">{statusTitle}</h2>
          <p className="mt-2">{statusText}</p>
        </section>
      </div>
    );
  }

  if (product.type === "ebook" && product.ebookMeta) {
    const authorLabel = locale === "en" ? "Author" : "저자";
    return (
      <div className="mt-10 space-y-4 text-sm text-surface-700">
        {product.ebookMeta.author && (
          <p>
            {authorLabel}: {product.ebookMeta.author}
          </p>
        )}
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
        {locale === "en" ? "Paywall, checkout, and member access in preparation" : "Paywall·결제·회원 연동 준비 중"}
      </div>
    );
  }

  if (product.type === "content" && product.contentMeta) {
    return (
      <div className="mt-8 text-sm text-surface-600">
        {product.contentMeta.commissionAvailable && (
          <p className="font-medium text-brand-700">
            {locale === "en" ? "Production requests available" : "제작 의뢰 가능"}
          </p>
        )}
        {hasValidUrl(product.contentMeta.embedUrl) && (
          <a
            href={product.contentMeta.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            {locale === "en" ? "View content ↗" : "콘텐츠 보기 ↗"}
          </a>
        )}
      </div>
    );
  }

  return null;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (slug === BUILD_PLACEHOLDER) notFound();

  const product = getProductBySlug(slug);
  if (!product || product.status === "draft") notFound();

  const backMap: Record<string, { href: string; label: string }> =
    locale === "en"
      ? {
          app: { href: "/apps", label: "Apps" },
          ebook: { href: "/ebooks", label: "E-books" },
          knowledge: { href: "/knowledge", label: "Knowledge" },
          content: { href: "/contents", label: "Content" },
          marketing: { href: "/marketing", label: "Marketing" },
          automation: { href: "/automation", label: "Automation" },
        }
      : {
          app: { href: "/apps", label: "앱 목록" },
          ebook: { href: "/ebooks", label: "전자책 목록" },
          knowledge: { href: "/knowledge", label: "지식·교육" },
          content: { href: "/contents", label: "콘텐츠" },
          marketing: { href: "/marketing", label: "마케팅" },
          automation: { href: "/automation", label: "산업자동화" },
        };
  const back = backMap[product.type] ?? {
    href: "/products",
    label: locale === "en" ? "Products" : "상품 목록",
  };

  return (
    <ProductDetailView
      product={product}
      backHref={localizePath(back.href, locale)}
      backLabel={back.label}
    >
      <ProductExtraContent product={product} locale={locale} />
    </ProductDetailView>
  );
}
