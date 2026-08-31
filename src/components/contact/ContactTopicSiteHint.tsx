"use client";

import { useSearchParams } from "next/navigation";
import { getBusinessById } from "@/data/businesses";
import { canExposeExternalSiteLink } from "@/data/business-access";
import { getPublicExternalSiteUrl } from "@/lib/business-sites";
import { Button } from "@/components/ui/Button";
import { getContactProductionStatus } from "@/config/platform-status";

const TOPIC_TO_BUSINESS: Record<string, string> = {
  automation: "automation",
  quote: "automation",
  app: "app",
  ebook: "ebook",
  website: "marketing",
  knowledge: "knowledge",
  content: "content",
  marketing: "marketing",
};

const TOPIC_LABELS: Record<string, string> = {
  automation: "산업자동화",
  quote: "산업자동화",
  app: "앱 제작",
  ebook: "전자책",
  website: "웹사이트",
  knowledge: "지식·교육",
  content: "콘텐츠",
  marketing: "마케팅",
  general: "기타",
};

export function ContactTopicSiteHint() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") ?? undefined;
  const businessId = topic ? TOPIC_TO_BUSINESS[topic] : undefined;
  const area = businessId ? getBusinessById(businessId) : undefined;
  const canShowExternal = area ? canExposeExternalSiteLink(area.id) : false;
  const siteUrl = area && canShowExternal ? getPublicExternalSiteUrl(area) : undefined;
  const contactStatus = getContactProductionStatus();

  if (!topic || !area) return null;

  const topicLabel = TOPIC_LABELS[topic] ?? area.titleKo;

  return (
    <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50/60 p-4">
      <p className="text-sm font-semibold text-surface-900">
        {topicLabel} 관련 안내
      </p>
      <p className="mt-1 text-sm leading-relaxed text-surface-600">
        {contactStatus !== "active"
          ? `온라인 문의 접수 서비스를 준비 중입니다. ${canShowExternal && siteUrl ? `${area.titleKo} 전문 사이트에서 서비스를 먼저 확인해 보세요.` : `${area.titleKo} 서비스는 SotongWare 포털 또는 내부 소개 페이지에서 확인해 주세요.`}`
          : canShowExternal && siteUrl
            ? `${area.titleKo} 전문 사이트에서 서비스 상세를 확인할 수 있습니다.`
            : `${area.titleKo} 회원·프리미엄 콘텐츠는 SotongWare 포털에서 이용할 수 있습니다.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {siteUrl ? (
          <Button href={siteUrl} variant="primary" external className="min-h-11">
            {area.externalSiteLabel ?? `${area.titleKo} 전문 사이트 ↗`}
          </Button>
        ) : (
          <Button href="/signup?redirect=/dashboard" variant="primary" className="min-h-11">
            회원 포털에서 보기
          </Button>
        )}
        <Button href={area.internalPath} variant="outline" className="min-h-11">
          서비스 소개
        </Button>
      </div>
    </div>
  );
}
