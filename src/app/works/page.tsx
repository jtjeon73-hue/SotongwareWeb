import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { createPageMetadata } from "@/lib/page-metadata";
import { Suspense } from "react";

export const metadata = createPageMetadata({
  title: "Works",
  description: "SotongWare 결과물 — /products로 통합되었습니다",
  path: "/works",
});

export default function WorksPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Works → Products"
          title="Works"
          description="결과물 카탈로그는 디지털 상품 허브(/products)로 통합되었습니다. 아래에서 전체 상품을 탐색하거나 사업 영역별 페이지로 이동하세요."
        />
        <div className="mb-8 flex flex-wrap gap-3">
          <Link href="/apps" className="rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium hover:border-brand-300">앱</Link>
          <Link href="/ebooks" className="rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium hover:border-brand-300">전자책</Link>
          <Link href="/knowledge" className="rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium hover:border-brand-300">교육</Link>
          <Link href="/contents" className="rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium hover:border-brand-300">콘텐츠</Link>
          <Link href="/automation" className="rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium hover:border-brand-300">자동화</Link>
        </div>
        <Suspense fallback={null}>
          <ProductCatalog />
        </Suspense>
      </div>
    </div>
  );
}
