import { getBusinessById } from "@/data/businesses";
import {
  canExposeExternalSiteLink,
  EXTERNAL_SITE_MEMBER_NOTICE,
} from "@/data/business-access";
import { getExternalSiteDisplayName } from "@/lib/business-sites";
import type { ProductType } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { BusinessExternalSiteLink, BusinessSiteStatusBadge } from "./BusinessActions";

export function BusinessSiteBanner({ businessId }: { businessId: ProductType }) {
  const area = getBusinessById(businessId);
  if (!area || area.siteStatus === "coming-soon") return null;

  const siteName = getExternalSiteDisplayName(area);
  const showExternalLink = canExposeExternalSiteLink(businessId);

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-surface-900">{siteName}</p>
        <p className="mt-1 text-sm text-surface-600">
          {area.tagline}. SotongWare {area.titleKo} 채널의 실제 운영 서비스입니다.
        </p>
        {!showExternalLink && (
          <p className="mt-2 text-xs leading-relaxed text-surface-500">
            {EXTERNAL_SITE_MEMBER_NOTICE}
          </p>
        )}
        <div className="mt-2">
          <BusinessSiteStatusBadge status={area.siteStatus} />
        </div>
      </div>
      {showExternalLink ? (
        <BusinessExternalSiteLink area={area} className="shrink-0" />
      ) : (
        <Button href="/signup?redirect=/dashboard" variant="primary" className="min-h-11 shrink-0">
          회원 포털에서 이용하기
        </Button>
      )}
    </div>
  );
}
