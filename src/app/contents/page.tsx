import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessSiteBanner } from "@/components/business/BusinessSiteBanner";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { contents, contentCategories } from "@/data/contents";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "콘텐츠",
  description: "AI 음악, Shorts, 영상, 만화 — SotongWare 콘텐츠 사업",
  path: "/contents",
});

export default function ContentPage() {
  const published = contents.filter((c) => c.status !== "draft");

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Content"
          title="콘텐츠"
          description="AI 음악, YouTube Shorts, 영상, 만화 — 콘텐츠 자체 수익과 제작 대행 두 가지 사업 흐름을 지원합니다."
        />

        <BusinessSiteBanner businessId="content" />

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contentCategories.map((cat) => (
            <div key={cat.id} className="rounded-xl border border-surface-200 p-4">
              <p className="font-semibold text-surface-900">{cat.label}</p>
            </div>
          ))}
        </div>

        {published.length > 0 ? (
          <ProductGrid products={published} />
        ) : (
          <ProductEmptyState
            type="content"
            title="콘텐츠가 준비되고 있습니다"
            description="음악, Shorts, 영상 등 제작·검수 완료 후 등록됩니다. YouTube 링크는 실제 업로드 후에만 표시됩니다."
          />
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact?topic=content" variant="primary">콘텐츠 제작 의뢰</Button>
          <Link href="/marketing" className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700">
            마케팅 서비스 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
