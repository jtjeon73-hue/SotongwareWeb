import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessSiteBanner } from "@/components/business/BusinessSiteBanner";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { Button } from "@/components/ui/Button";
import { apps } from "@/data/apps";
import { createPageMetadata } from "@/lib/page-metadata";
import { StructuredData } from "@/components/common/StructuredData";
import { serviceJsonLd } from "@/lib/structured-data";

const PAGE_DESCRIPTION = "SotongWare가 제작한 앱 — 전시, 배포, 판매";

export const metadata = createPageMetadata({
  title: "앱개발",
  description: PAGE_DESCRIPTION,
  path: "/apps",
});

export default function AppsPage() {
  const published = apps.filter((a) => a.status !== "draft");

  return (
    <>
      <StructuredData
        data={serviceJsonLd("SotongWare App Marketplace", PAGE_DESCRIPTION, "/apps")}
      />
      <div className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader
            eyebrow="App Marketplace"
            title="앱 마켓플레이스"
            description="SotongWare가 직접 제작한 앱을 전시하고, 출시·배포·판매합니다. Play Store 등록 URL은 실제 등록 후에만 표시됩니다."
          />
          <BusinessSiteBanner businessId="app" />
          {published.length > 0 ? (
            <ProductGrid products={published} />
          ) : (
            <ProductEmptyState
              type="app"
              title="첫 앱이 준비되고 있습니다"
              description="앱 기획·개발·테스트·출시가 완료되는 순서대로 등록됩니다."
            />
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact?topic=app" variant="primary">
              앱 개발 의뢰
            </Button>
            <Button href="/services/app-development" variant="outline">
              앱 개발 서비스
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
