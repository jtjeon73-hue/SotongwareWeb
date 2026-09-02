"use client";

import { getBusinessById } from "@/data/businesses";
import { canExposeExternalSiteLink } from "@/data/business-access";
import { getExternalSiteDisplayName } from "@/lib/business-sites";
import {
  externalSiteMemberNotice,
  getLocalizedBusinessTagline,
} from "@/lib/business-i18n";
import type { ProductType } from "@/types/product";
import { useLocale } from "@/contexts/LocaleProvider";
import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { BusinessExternalSiteLink, BusinessSiteStatusBadge } from "./BusinessActions";

const bannerCopy = {
  ko: {
    channelNote: (titleKo: string) => `SotongWare ${titleKo} 채널의 실제 운영 서비스입니다.`,
    version: (v: string, date: string) => `v${v} · 최종 업데이트 ${date}`,
    portalCta: "회원 포털에서 이용하기",
  },
  en: {
    channelNote: () => "Live channel operated by SotongWare for this business area.",
    version: (v: string, date: string) => `v${v} · Last updated ${date}`,
    portalCta: "Use member portal",
  },
};

export function BusinessSiteBanner({ businessId }: { businessId: ProductType }) {
  const { locale } = useLocale();
  const copy = bannerCopy[locale];
  const area = getBusinessById(businessId);
  if (!area || area.siteStatus === "coming-soon") return null;

  const siteName = getExternalSiteDisplayName(area, locale);
  const tagline = getLocalizedBusinessTagline(area, locale);
  const showExternalLink = canExposeExternalSiteLink(businessId);

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-surface-900">{siteName}</p>
        <p className="mt-1 text-sm text-surface-600">
          {tagline}. {copy.channelNote(area.titleKo)}
        </p>
        <p className="mt-1 text-xs font-medium text-brand-700">
          {copy.version(area.externalSiteVersion, area.externalSiteUpdatedAt)}
        </p>
        {!showExternalLink && (
          <p className="mt-2 text-xs leading-relaxed text-surface-500">{externalSiteMemberNotice[locale]}</p>
        )}
        <div className="mt-2">
          <BusinessSiteStatusBadge status={area.siteStatus} />
        </div>
      </div>
      {showExternalLink ? (
        <BusinessExternalSiteLink area={area} className="shrink-0" />
      ) : (
        <LocalizedButton href="/signup?redirect=/dashboard" variant="primary" className="min-h-11 shrink-0">
          {copy.portalCta}
        </LocalizedButton>
      )}
    </div>
  );
}
