import Link from "next/link";
import type { SotongProduct } from "@/types/product";
import { formatPrice } from "@/lib/products";
import { RevenueStatusBadges } from "@/components/product/ProductBadges";
import { CommerceConversionPanel } from "@/components/product/CommerceConversionPanel";
import { ProductCrossSell } from "@/components/product/ProductCrossSell";
import { ProductNextActions } from "@/components/product/ProductNextActions";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { ProductViewTracker } from "@/components/product/ProductViewTracker";
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
              {product.updatedAt && <span>업데이트: {product.updatedAt}</span>}
            </div>
          </header>

          {children}

          <CommerceConversionPanel product={product} />
          <ProductNextActions product={product} />
          <ProductCrossSell product={product} />
          <RelatedProducts products={related} />
        </div>
      </div>
    </>
  );
}
