import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { Button } from "@/components/ui/Button";
import { ebooks } from "@/data/ebooks";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "전자책",
  description: "SotongWare 전자책 — 기획, 제작, 다중 플랫폼 판매",
  path: "/ebooks",
});

export default function EbooksPage() {
  const published = ebooks.filter((e) => e.status !== "draft");

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="E-books"
          title="전자책"
          description="SotongWare에서 제작한 전자책을 상품으로 판매합니다. 외부 플랫폼 링크는 실제 등록 후에만 표시됩니다."
        />
        {published.length > 0 ? (
          <ProductGrid products={published} />
        ) : (
          <ProductEmptyState
            type="ebook"
            title="첫 전자책이 준비되고 있습니다"
            description="기획·집필·편집·검수가 완료되는 순서대로 등록됩니다."
          />
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact?topic=ebook" variant="primary">전자책 제작 의뢰</Button>
          <Button href="/knowledge" variant="outline">관련 교육 콘텐츠</Button>
        </div>
      </div>
    </div>
  );
}
