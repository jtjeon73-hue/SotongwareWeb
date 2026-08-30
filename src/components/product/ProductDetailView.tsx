import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { SotongProduct } from "@/types/product";
import { formatPrice } from "@/lib/products";
import { RevenueStatusBadges } from "@/components/product/ProductBadges";
import { CommerceConversionPanel } from "@/components/product/CommerceConversionPanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";
import { getRelatedProducts } from "@/data/products";
import { StructuredData } from "@/components/common/StructuredData";
import { productJsonLd } from "@/lib/structured-data";
import { canInstallFromStore } from "@/lib/commerce";
import { isContactSubmissionAvailable } from "@/config/platform-status";

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
  const isApp = product.type === "app";
  const contactAvailable = isContactSubmissionAvailable();
  const storeInstallAvailable = canInstallFromStore(product);

  return (
    <>
      <ProductViewTracker product={product} />
      <StructuredData data={productJsonLd(product)} />
      <div className="section-padding bg-white">
        <div className="container-main max-w-4xl">
          <Link href={backHref} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            ← {backLabel}
          </Link>

          <header className="mt-6">
            <RevenueStatusBadges product={product} className="gap-2" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="mt-2 text-lg text-brand-600">{product.subtitle}</p>
            )}
            <p className="mt-4 text-base leading-relaxed text-surface-600">
              {product.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-600">
              <span className="text-xl font-bold text-surface-900">{formatPrice(product)}</span>
              {product.category && <span>{product.category}</span>}
              {product.appMeta?.version && <span>버전 {product.appMeta.version}</span>}
              {product.appMeta?.os && <span>지원 OS: {product.appMeta.os.join(", ")}</span>}
              {product.updatedAt && <span>업데이트: {product.updatedAt}</span>}
            </div>
          </header>

          {children}

          <CommerceConversionPanel product={product} />

          <div className="mt-8 flex flex-wrap gap-3">
            {storeInstallAvailable && product.storeLinks?.playStore && (
              <Button href={product.storeLinks.playStore} variant="primary" external>
                Google Play에서 받기
              </Button>
            )}
            {contactAvailable && isApp && (
              <Button href={`/contact?topic=app&product=${product.slug}`} variant="primary">
                앱 문의
              </Button>
            )}
            {contactAvailable && (product.accessMode === "inquiry" || product.accessMode === "paid") && (
              <Button href={`/contact?product=${product.slug}`} variant="primary">
                {product.type === "automation" ? "견적 요청" : "구매·상담"}
              </Button>
            )}
            {contactAvailable && isApp && (
              <Button href="/contact?topic=app" variant="outline">
                앱 제작 문의
              </Button>
            )}
            <Button href="/products" variant="outline">
              다른 상품 보기
            </Button>
          </div>

          {isApp && related.length === 0 && (
            <section className="mt-10 rounded-xl border border-surface-200 bg-surface-50 p-5">
              <h2 className="text-sm font-semibold text-surface-900">관련 서비스</h2>
              <p className="mt-2 text-sm text-surface-600">
                앱 개발·배포·스토어 등록까지 SotongWare 앱 개발 서비스를 이용할 수 있습니다.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/services/app-development" variant="outline">
                  앱 개발 서비스
                </Button>
                {contactAvailable && (
                  <Button href="/contact?topic=app" variant="outline">
                    제작 문의
                  </Button>
                )}
              </div>
            </section>
          )}

          <RelatedProducts products={related} />
        </div>
      </div>
    </>
  );
}
