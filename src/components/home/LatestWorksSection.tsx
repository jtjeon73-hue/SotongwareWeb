import { allProducts } from "@/data/products";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { WorksEmptyState } from "@/components/shared/WorksEmptyState";
import { Button } from "@/components/ui/Button";

export function LatestWorksSection() {
  const visibleProducts = allProducts.filter((p) => p.status !== "draft");
  const hasProducts = visibleProducts.length > 0;

  return (
    <section className="section-padding section-alt" aria-labelledby="latest-works-heading">
      <div className="container-main">
        <SectionHeader
          id="latest-works-heading"
          eyebrow="SotongWare Works"
          title="실제로 만들고 있는 결과물"
          description="아이디어만 보여드리지 않습니다. 실제 제작하고 검증한 결과물을 공개합니다."
        />

        {hasProducts ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/products" variant="primary">
                디지털 상품 보기
              </Button>
              <Button href="/works" variant="outline">
                포트폴리오 전체
              </Button>
            </div>
          </>
        ) : (
          <WorksEmptyState compact />
        )}
      </div>
    </section>
  );
}
