import { getVisibleProducts, getProductCountTier } from "@/lib/product-catalog";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

/** 메인 홈 — 결과물은 보조 섹션으로만 표시 (전문 사이트 중심) */
export function HomeWorksTeaserSection() {
  const visibleProducts = getVisibleProducts();
  const tier = getProductCountTier(visibleProducts.length);

  if (tier === "empty") return null;

  return (
    <section className="section-padding section-alt" aria-labelledby="works-teaser-heading">
      <div className="container-main max-w-3xl">
        <SectionHeader
          id="works-teaser-heading"
          eyebrow="Works"
          title="실제 제작 사례는 전문 사이트에서"
          description="앱, 전자책, 콘텐츠 등 결과물은 각 전문 사이트에서 확인할 수 있습니다. SotongWare 메인은 서비스 안내와 연결을 중심으로 합니다."
        />
        <div className="flex flex-wrap gap-3">
          <Button href="/#business-hub-heading" variant="primary" className="min-h-11">
            6대 전문 서비스
          </Button>
          {tier !== "single" && (
            <Button href="/products" variant="outline" className="min-h-11">
              디지털 상품 목록
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
