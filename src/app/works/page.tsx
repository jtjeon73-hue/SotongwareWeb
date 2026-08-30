import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { getVisibleProducts, getProductCountTier, getWorksSectionCopy } from "@/lib/product-catalog";
import { createPageMetadata } from "@/lib/page-metadata";
import { Suspense } from "react";

export const metadata = createPageMetadata({
  title: "포트폴리오",
  description: "SotongWare가 제작·검증한 디지털 결과물 — 앱, 전자책, 교육, 콘텐츠, 자동화",
  path: "/works",
});

export default function WorksPage() {
  const tier = getProductCountTier(getVisibleProducts().length);
  const copy = getWorksSectionCopy(tier);

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={`${copy.description} 모든 결과물은 중앙 Product 데이터에서 자동 표시됩니다.`}
        />
        <Suspense fallback={<p className="text-surface-600">로딩 중...</p>}>
          <ProductCatalog />
        </Suspense>
      </div>
    </div>
  );
}
