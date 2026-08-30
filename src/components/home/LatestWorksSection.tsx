import { getVisibleProducts, getProductCountTier, getWorksSectionCopy } from "@/lib/product-catalog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductsEmptyState } from "@/components/shared/ProductsEmptyState";
import { Button } from "@/components/ui/Button";

export function LatestWorksSection() {
  const visibleProducts = getVisibleProducts();
  const tier = getProductCountTier(visibleProducts.length);
  const copy = getWorksSectionCopy(tier);
  const displayProducts = visibleProducts.slice(0, tier === "many" ? 6 : visibleProducts.length);

  return (
    <section className="section-padding section-alt" aria-labelledby="latest-works-heading">
      <div className="container-main">
        <SectionHeader
          id="latest-works-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />

        {tier === "empty" ? (
          <ProductsEmptyState compact />
        ) : (
          <>
            {tier === "single" && (
              <p className="mb-4 text-sm font-medium text-brand-700">현재 공개 중인 제품</p>
            )}
            <div
              className={
                tier === "single"
                  ? "max-w-md"
                  : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              }
            >
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products" variant="primary" className="min-h-11">
                디지털 상품 보기
              </Button>
              <Button href="/works" variant="outline" className="min-h-11">
                포트폴리오 전체
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
