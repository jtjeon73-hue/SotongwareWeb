import type { BusinessConversion } from "@/types/commerce";
import { getBusinessById } from "@/data/businesses";
import { canExposeExternalSiteLink } from "@/data/business-access";
import { getPublicExternalSiteUrl } from "@/lib/business-sites";
import { isContactSubmissionAvailable } from "@/config/platform-status";

/** 6대 사업 Main Conversion 정의 */
export const businessConversions: BusinessConversion[] = [
  {
    businessId: "automation",
    mainConversion: "quote_inquiry",
    label: "견적 문의",
    href: "/contact?topic=automation",
    status: "preparing",
  },
  {
    businessId: "app",
    mainConversion: "install_or_inquiry",
    label: "설치 / 앱 제작 문의",
    href: "/contact?topic=app",
    status: "preparing",
  },
  {
    businessId: "ebook",
    mainConversion: "purchase",
    label: "구매",
    status: "preparing",
  },
  {
    businessId: "knowledge",
    mainConversion: "free_content",
    label: "무료 콘텐츠 / 회원 / 구독",
    status: "active",
  },
  {
    businessId: "marketing",
    mainConversion: "consultation",
    label: "상담",
    href: "/contact?topic=marketing",
    status: "preparing",
  },
  {
    businessId: "content",
    mainConversion: "play_or_inquiry",
    label: "재생 / 제작 문의",
    href: "/contact?topic=content",
    status: "preparing",
  },
];

export function getConversionByBusinessId(id: string): BusinessConversion | undefined {
  const base = businessConversions.find((c) => c.businessId === id);
  if (!base) return undefined;

  if (id === "knowledge") {
    const area = getBusinessById("knowledge");
    if (!area) return base;
    if (canExposeExternalSiteLink("knowledge")) {
      const siteUrl = getPublicExternalSiteUrl(area);
      return {
        ...base,
        href: siteUrl,
        status: siteUrl ? "active" : "preparing",
      };
    }
    return {
      ...base,
      href: "/signup?redirect=/dashboard",
      status: "active",
    };
  }

  if (id === "content") {
    const area = getBusinessById("content");
    if (!area) return base;
    if (!canExposeExternalSiteLink("content")) {
      return {
        ...base,
        href: "/signup?redirect=/dashboard",
        status: "active",
      };
    }
  }

  if (base.href?.startsWith("/contact") && !isContactSubmissionAvailable()) {
    return { ...base, status: "preparing" };
  }

  return base;
}
