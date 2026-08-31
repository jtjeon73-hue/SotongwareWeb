import type { BusinessArea } from "@/types/product";
import { canExposeExternalSiteLink } from "@/data/business-access";

/** Custom Domain이 ACTIVE·HTTPS 검증된 경우에만 subdomain URL 반환 */
export function getExternalSiteUrl(area: BusinessArea): string | undefined {
  if (
    area.customDomainUrl &&
    area.customDomainStatus === "active"
  ) {
    return area.customDomainUrl;
  }
  return area.externalSiteUrl;
}

/**
 * UI에 노출 가능한 외부 사이트 URL
 * 공유 인증 미구현 회원/프리미엄 사업은 직접 링크 비노출
 */
export function getPublicExternalSiteUrl(area: BusinessArea): string | undefined {
  if (!canExposeExternalSiteLink(area.id)) {
    return undefined;
  }
  return getExternalSiteUrl(area);
}

/** 고객 화면용 외부 사이트 표시명 */
export function getExternalSiteDisplayName(area: BusinessArea): string {
  return area.externalSiteName ?? area.titleKo;
}
