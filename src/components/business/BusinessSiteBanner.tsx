import { getBusinessById } from "@/data/businesses";
import type { ProductType } from "@/types/product";
import { BusinessExternalSiteLink, BusinessSiteStatusBadge } from "./BusinessActions";

export function BusinessSiteBanner({ businessId }: { businessId: ProductType }) {
  const area = getBusinessById(businessId);
  if (!area?.externalSiteUrl || area.siteStatus === "coming-soon") return null;

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-surface-900">{area.titleKo} 전문 사이트</p>
        <p className="mt-1 text-sm text-surface-600">
          SotongWare {area.titleKo} 채널에서 더 자세한 서비스를 확인할 수 있습니다.
        </p>
        <div className="mt-2">
          <BusinessSiteStatusBadge status={area.siteStatus} />
        </div>
      </div>
      <BusinessExternalSiteLink area={area} className="shrink-0" />
    </div>
  );
}
