import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessSiteBanner } from "@/components/business/BusinessSiteBanner";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductsEmptyState } from "@/components/shared/ProductsEmptyState";
import { Button } from "@/components/ui/Button";
import { getProductsByType } from "@/data/products";
import { isContactSubmissionAvailable } from "@/config/platform-status";
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
  const published = getProductsByType("app");
  const contactAvailable = isContactSubmissionAvailable();

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
            description="SotongWare가 직접 제작한 앱을 전시합니다. Play Store URL은 실제 등록 후에만 활성화됩니다."
          />
          <BusinessSiteBanner businessId="app" />
          {published.length > 0 ? (
            <ProductGrid products={published} />
          ) : (
            <ProductsEmptyState typeLabel="앱" />
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {contactAvailable && (
              <Button href="/contact?topic=app" variant="primary" className="min-h-11">
                앱 개발 의뢰
              </Button>
            )}
            <Button href="/services/app-development" variant="outline" className="min-h-11">
              앱 개발 서비스
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
