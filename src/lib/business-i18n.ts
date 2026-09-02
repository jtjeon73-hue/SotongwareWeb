import type { BusinessArea } from "@/types/product";
import type { ProductType } from "@/types/product";
import type { Locale } from "@/i18n/config";

const enBusinessCopy: Record<
  ProductType,
  { tagline: string; externalSiteName: string; externalSiteLabel: string }
> = {
  automation: {
    tagline: "Automation software built for the plant floor",
    externalSiteName: "Industrial automation channel",
    externalSiteLabel: "Industrial automation site ↗",
  },
  app: {
    tagline: "Apps we deploy and operate",
    externalSiteName: "Apps channel site",
    externalSiteLabel: "Apps site ↗",
  },
  ebook: {
    tagline: "Knowledge packaged as e-books",
    externalSiteName: "E-books channel site",
    externalSiteLabel: "E-books site ↗",
  },
  knowledge: {
    tagline: "Learn easily, go deeper over time",
    externalSiteName: "Knowledge & education channel",
    externalSiteLabel: "Knowledge site ↗",
  },
  marketing: {
    tagline: "Marketing for digital products and brands",
    externalSiteName: "Marketing channel site",
    externalSiteLabel: "Marketing site ↗",
  },
  content: {
    tagline: "Content you can watch, listen to, and commission",
    externalSiteName: "Content channel site",
    externalSiteLabel: "Content site ↗",
  },
};

export function getLocalizedBusinessTitle(area: BusinessArea, locale: Locale): string {
  return locale === "en" ? area.title : area.titleKo;
}

export function getLocalizedBusinessTagline(area: BusinessArea, locale: Locale): string {
  if (locale === "en") {
    return enBusinessCopy[area.id]?.tagline ?? area.tagline;
  }
  return area.tagline;
}

export function getLocalizedExternalSiteName(area: BusinessArea, locale: Locale): string {
  if (locale === "en") {
    return enBusinessCopy[area.id]?.externalSiteName ?? area.title;
  }
  return area.externalSiteName ?? area.titleKo;
}

export function getLocalizedExternalSiteLabel(area: BusinessArea, locale: Locale): string {
  if (locale === "en") {
    return enBusinessCopy[area.id]?.externalSiteLabel ?? "Visit dedicated site ↗";
  }
  return area.externalSiteLabel ?? "전문 사이트 방문 ↗";
}

export const externalSiteMemberNotice: Record<Locale, string> = {
  ko: "이 사업의 외부 전문 사이트는 공유 인증이 아직 연동되지 않았습니다. 회원·프리미엄 콘텐츠는 SotongWare 포털에서 이용해 주세요.",
  en: "The external channel for this business is not yet linked to shared sign-in. Member and premium content is available through the SotongWare portal.",
};

export const businessSiteStatusLabels: Record<Locale, Record<"preparing" | "coming-soon", string>> = {
  ko: { preparing: "서비스 확장 중", "coming-soon": "준비 중" },
  en: { preparing: "Expanding service", "coming-soon": "Coming soon" },
};
