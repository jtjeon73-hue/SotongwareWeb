import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { SotongProduct } from "@/types/product";
import { formatPrice } from "@/lib/products";
import { ProductStatusBadge, AccessModeBadge, AppReleaseBadge } from "@/components/product/ProductBadges";
import { StoreLinksPanel } from "@/components/product/StoreLinks";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getRelatedProducts } from "@/data/products";
import { StructuredData } from "@/components/common/StructuredData";
import { productJsonLd } from "@/lib/structured-data";

interface ProductDetailViewProps {
  product: SotongProduct;
  backHref: string;
  backLabel: string;
  children?: React.ReactNode;
}

export function ProductDetailView({
  product,
  backHref,
  backLabel,
  children,
}: ProductDetailViewProps) {
  const related = getRelatedProducts(product);

  return (
    <>
      <StructuredData data={productJsonLd(product)} />
      <div className="section-padding bg-white">
        <div className="container-main max-w-4xl">
          <Link href={backHref} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            ← {backLabel}
          </Link>

          <header className="mt-6">
            <div className="flex flex-wrap gap-2">
              <AccessModeBadge accessMode={product.accessMode} />
              <ProductStatusBadge status={product.status} />
              {product.appMeta?.releaseStatus && (
                <AppReleaseBadge status={product.appMeta.releaseStatus} />
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="mt-2 text-lg text-brand-600">{product.subtitle}</p>
            )}
            <p className="mt-4 text-base leading-relaxed text-surface-600">
              {product.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="text-xl font-bold text-surface-900">{formatPrice(product)}</span>
              {product.category && (
                <span className="text-sm text-surface-500">{product.category}</span>
              )}
            </div>
          </header>

          {children}

          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500">
              외부 링크
            </h2>
            <div className="mt-3">
              <StoreLinksPanel
                storeLinks={product.storeLinks}
                externalLinks={product.externalLinks}
              />
            </div>
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            {product.accessMode === "inquiry" || product.accessMode === "paid" ? (
              <Button href={`/contact?product=${product.slug}`} variant="primary">
                {product.type === "app" ? "앱 문의" : product.type === "automation" ? "견적 요청" : "구매·상담"}
              </Button>
            ) : null}
            <Button href="/products" variant="outline">
              다른 상품 보기
            </Button>
          </div>

          <RelatedProducts products={related} />
        </div>
      </div>
    </>
  );
}
