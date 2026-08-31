import type { BusinessArea } from "@/types/product";

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

/** 고객 화면용 외부 사이트 표시명 */
export function getExternalSiteDisplayName(area: BusinessArea): string {
  return area.externalSiteName ?? area.titleKo;
}
