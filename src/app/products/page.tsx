import { Suspense } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "디지털 상품",
  description: "SotongWare 앱, 전자책, 교육, 콘텐츠, 자동화, 마케팅 상품 통합 카탈로그",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Product Catalog"
          title="디지털 상품"
          description="앱, 전자책, 교육, 콘텐츠, 자동화, 마케팅 — SotongWare의 모든 디지털 상품을 한곳에서 탐색합니다."
        />
        <Suspense fallback={<p className="text-surface-600">로딩 중...</p>}>
          <ProductCatalog />
        </Suspense>
      </div>
    </div>
  );
}
