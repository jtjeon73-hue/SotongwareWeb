"use client";

import { Suspense, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ContentFormatId } from "@/data/service-catalog";
import { contentFormatLabels, contentFormats, getContentCatalog } from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { ComingSoonCta, MembershipGate } from "@/components/access/MembershipGate";
import { PreviewPersonaBar, usePreviewPersona } from "@/components/access/PreviewPersonaBar";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { personaToTier, tierMeetsRequirement } from "@/types/access-tier";

const TONE: Record<string, string> = {
  rose: "from-rose-200 via-pink-50 to-white",
  sky: "from-sky-200 via-cyan-50 to-white",
  amber: "from-amber-200 via-orange-50 to-white",
  violet: "from-violet-200 via-fuchsia-50 to-white",
  emerald: "from-emerald-200 via-teal-50 to-white",
  slate: "from-slate-300 via-slate-100 to-white",
};

function ContentLibraryInner({ locale }: { locale: Locale }) {
  const [format, setFormat] = useState<ContentFormatId | "all">("all");
  const persona = usePreviewPersona();
  const tier = personaToTier(persona);
  const items = useMemo(
    () => (format === "all" ? getContentCatalog() : getContentCatalog(format)),
    [format],
  );

  return (
    <div className="bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_40%,#f8fbff_100%)]">
      <div className="section-padding">
        <div className="container-main">
          <SectionHeader
            eyebrow={locale === "en" ? "Media library" : "미디어 라이브러리"}
            title={locale === "en" ? "Content results & channels" : "콘텐츠 결과물 · 채널"}
            description={
              locale === "en"
                ? "Browse formats and themes first. No fake view or subscriber counts—only honest status and access tiers."
                : "형식·테마로 먼저 탐색합니다. 가짜 조회수·구독자 수는 표시하지 않으며, 상태와 공개등급만 분명히 보여줍니다."
            }
          />

          <div className="mt-6">
            <PreviewPersonaBar locale={locale} />
          </div>

          <div
            className="mt-8 flex flex-wrap gap-2"
            role="tablist"
            aria-label={locale === "en" ? "Formats" : "콘텐츠 형식"}
          >
            <button
              type="button"
              role="tab"
              aria-selected={format === "all"}
              onClick={() => setFormat("all")}
              className={`min-h-10 rounded-full px-4 text-sm font-medium ${
                format === "all" ? "bg-rose-600 text-white" : "border border-rose-200 bg-white text-rose-900"
              }`}
            >
              {locale === "en" ? "All" : "전체"}
            </button>
            {contentFormats.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={format === id}
                onClick={() => setFormat(id)}
                className={`min-h-10 rounded-full px-4 text-sm font-medium ${
                  format === id
                    ? "bg-rose-600 text-white"
                    : "border border-rose-200 bg-white text-rose-900 hover:bg-rose-50"
                }`}
              >
                {contentFormatLabels[id][locale]}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const canOpen = tierMeetsRequirement(tier, item.accessTier);
              return (
                <article
                  key={item.slug}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm"
                >
                  <div className={`relative aspect-video bg-gradient-to-br ${TONE[item.coverTone]}`}>
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800 ring-1 ring-rose-100">
                      {contentFormatLabels[item.formatId][locale]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex flex-wrap gap-1.5">
                      <AccessBadge tier={item.accessTier} locale={locale} />
                      <OpsStatusBadge status={item.status} locale={locale} />
                    </div>
                    <h3 className="mt-3 text-base font-bold text-surface-900">
                      <LocalizedLink href={`/contents/${item.slug}`} className="hover:text-rose-700">
                        {item.title[locale]}
                      </LocalizedLink>
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-surface-600">{item.summary[locale]}</p>
                    <p className="mt-2 text-xs text-surface-500">
                      {item.theme[locale]} · {item.channel[locale]}
                    </p>
                    <div className="mt-4">
                      {canOpen ? (
                        <LocalizedLink
                          href={`/contents/${item.slug}`}
                          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700"
                        >
                          {locale === "en" ? "View / play preview" : "보기 · 재생 Preview"}
                        </LocalizedLink>
                      ) : (
                        <MembershipGate locale={locale} className="!p-3" />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10">
            <ComingSoonCta
              locale={locale}
              label={
                locale === "en"
                  ? "Live purchase / subscription hooks later"
                  : "실제 구매·구독 연결은 정식 오픈 후"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentLibraryView({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={null}>
      <ContentLibraryInner locale={locale} />
    </Suspense>
  );
}
