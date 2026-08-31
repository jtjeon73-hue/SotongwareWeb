import { getBusinessById } from "@/data/businesses";
import { getExternalSiteDisplayName } from "@/lib/business-sites";
import type { ProductType } from "@/types/product";
import { BusinessExternalSiteLink, BusinessSiteStatusBadge } from "./BusinessActions";

export function BusinessSiteBanner({ businessId }: { businessId: ProductType }) {
  const area = getBusinessById(businessId);
  if (!area || area.siteStatus === "coming-soon") return null;

  const siteName = getExternalSiteDisplayName(area);

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-surface-900">{siteName}</p>
        <p className="mt-1 text-sm text-surface-600">
          {area.tagline}. SotongWare {area.titleKo} 채널의 실제 운영 서비스입니다.
        </p>
        <div className="mt-2">
          <BusinessSiteStatusBadge status={area.siteStatus} />
        </div>
      </div>
      <BusinessExternalSiteLink area={area} className="shrink-0" />
    </div>
  );
}
