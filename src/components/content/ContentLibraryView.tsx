"use client";

import { Suspense, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { ContentUiCategoryId } from "@/data/service-catalog";
import {
  contentUiCategories,
  contentUiCategoryLabels,
  formatIdToUiCategory,
  getContentCatalogByUiCategory,
  getCustomerLiveContents,
  getPreparingContents,
} from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { ComingSoonCta, MembershipGate } from "@/components/access/MembershipGate";
import { PreviewPersonaBar, usePreviewPersona } from "@/components/access/PreviewPersonaBar";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { isCustomerLiveContent } from "@/lib/content-publication-gate";
import { personaToTier, tierMeetsRequirement } from "@/types/access-tier";

const TONE: Record<string, string> = {
  rose: "from-rose-200 via-pink-50 to-white",
  sky: "from-sky-200 via-cyan-50 to-white",
  amber: "from-amber-200 via-orange-50 to-white",
  violet: "from-violet-200 via-fuchsia-50 to-white",
  emerald: "from-emerald-200 via-teal-50 to-white",
  slate: "from-slate-300 via-slate-100 to-white",
};

function uiLabelForItem(
  formatId: Parameters<typeof formatIdToUiCategory>[0],
  locale: Locale,
): string {
  const ui = formatIdToUiCategory(formatId);
  if (!ui) return locale === "en" ? "Other" : "기타";
  return contentUiCategoryLabels[ui][locale];
}

function ContentCard({
  item,
  locale,
  tier,
}: {
  item: ReturnType<typeof getContentCatalogByUiCategory>[number];
  locale: Locale;
  tier: ReturnType<typeof personaToTier>;
}) {
  const canOpen = tierMeetsRequirement(tier, item.accessTier);
  const live = isCustomerLiveContent(item);
  const showPoster =
    Boolean(item.media.poster) && (live || item.media.source === "public_asset");

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
      <div
        className={`relative aspect-video min-w-0 bg-gradient-to-br ${TONE[item.coverTone]}`}
        data-content-visual="cover"
      >
        {showPoster ? (
          // eslint-disable-next-line @next/next/no-img-element -- public poster for live or preparing preview
          <img
            src={item.media.poster}
            alt={item.media.alt[locale]}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800 ring-1 ring-rose-100">
          {uiLabelForItem(item.formatId, locale)}
        </span>
        {!live ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-amber-50/95 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200">
            {locale === "en" ? "Preview · preparing" : "Preview · 준비 중"}
          </span>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          <AccessBadge tier={item.accessTier} locale={locale} />
          <OpsStatusBadge status={item.status} locale={locale} />
        </div>
        <h3 className="mt-3 min-w-0 text-base font-bold text-surface-900">
          <LocalizedLink href={`/contents/${item.slug}`} className="hover:text-rose-700">
            {item.title[locale]}
          </LocalizedLink>
        </h3>
        <p className="mt-2 min-w-0 flex-1 break-words text-sm text-surface-600">{item.summary[locale]}</p>
        <p className="mt-2 text-xs text-surface-500">
          {item.theme[locale]} · {item.channel[locale]}
        </p>
        <div className="mt-4">
          {canOpen ? (
            <LocalizedLink
              href={`/contents/${item.slug}`}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700"
            >
              {live
                ? locale === "en"
                  ? "Open"
                  : "열기"
                : locale === "en"
                  ? "View preparing card"
                  : "준비 중 카드 보기"}
            </LocalizedLink>
          ) : (
            <MembershipGate locale={locale} className="!p-3" />
          )}
        </div>
      </div>
    </article>
  );
}

function ContentLibraryInner({ locale }: { locale: Locale }) {
  const [category, setCategory] = useState<ContentUiCategoryId | "all">("all");
  const persona = usePreviewPersona();
  const tier = personaToTier(persona);

  const liveItems = useMemo(() => {
    const live = getCustomerLiveContents();
    if (category === "all") return live;
    return live.filter((c) => formatIdToUiCategory(c.formatId) === category);
  }, [category]);

  const preparingItems = useMemo(() => {
    const prep = getPreparingContents();
    if (category === "all") return prep;
    return prep.filter((c) => formatIdToUiCategory(c.formatId) === category);
  }, [category]);

  const filteredAll = useMemo(
    () => (category === "all" ? getContentCatalogByUiCategory("all") : getContentCatalogByUiCategory(category)),
    [category],
  );

  const emptyLive = liveItems.length === 0;
  const emptyAll = filteredAll.length === 0;

  return (
    <div className="min-w-0 overflow-x-hidden bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_40%,#f8fbff_100%)]">
      <div className="section-padding">
        <div className="container-main min-w-0">
          <SectionHeader
            eyebrow={locale === "en" ? "Content" : "콘텐츠"}
            title={
              locale === "en"
                ? "Watch, listen, read, and play — SotongWare content"
                : "보고, 듣고, 읽고, 즐기는 SotongWare 콘텐츠"
            }
            description={
              locale === "en"
                ? "Shorts, music, comics, video, images, and games. Only reviewed, approved works go live—no fake view counts."
                : "쇼츠·음악·만화·영상·이미지·게임. 검수·승인된 작품만 운영중으로 올리며, 가짜 조회수는 표시하지 않습니다."
            }
          />

          <div className="mt-6">
            <PreviewPersonaBar locale={locale} />
          </div>

          <div
            className="mt-8 flex min-w-0 flex-wrap gap-2"
            role="tablist"
            aria-label={locale === "en" ? "Categories" : "콘텐츠 분류"}
            data-content-ui-categories="all-shorts-music-comic-video-image-game"
          >
            <button
              type="button"
              role="tab"
              aria-selected={category === "all"}
              onClick={() => setCategory("all")}
              className={`min-h-11 min-w-0 rounded-full px-4 text-sm font-medium ${
                category === "all" ? "bg-rose-600 text-white" : "border border-rose-200 bg-white text-rose-900"
              }`}
            >
              {locale === "en" ? "All" : "전체"}
            </button>
            {contentUiCategories.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={category === id}
                onClick={() => setCategory(id)}
                className={`min-h-11 min-w-0 rounded-full px-4 text-sm font-medium ${
                  category === id
                    ? "bg-rose-600 text-white"
                    : "border border-rose-200 bg-white text-rose-900 hover:bg-rose-50"
                }`}
              >
                {contentUiCategoryLabels[id][locale]}
              </button>
            ))}
          </div>

          {emptyLive ? (
            <div
              className="mt-8 min-w-0 rounded-2xl border border-dashed border-rose-200 bg-white/80 p-6"
              data-content-empty-live="true"
            >
              <p className="text-base font-semibold text-surface-900">
                {locale === "en"
                  ? "No published content yet"
                  : "아직 공개된 콘텐츠가 없습니다"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-surface-600">
                {locale === "en"
                  ? "Live works appear here after media, rights review, and approval. Preparing previews below are not finished products."
                  : "미디어·권리 검수·승인 후 운영중 콘텐츠가 이 자리에 올라갑니다. 아래 Preview는 완성본이 아닙니다."}
              </p>
            </div>
          ) : (
            <section className="mt-8" aria-label={locale === "en" ? "Live content" : "운영중 콘텐츠"}>
              <h2 className="text-lg font-bold text-surface-900">
                {locale === "en" ? "Live" : "운영중"}
              </h2>
              <div className="mt-4 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {liveItems.map((item) => (
                  <ContentCard key={item.slug} item={item} locale={locale} tier={tier} />
                ))}
              </div>
            </section>
          )}

          {preparingItems.length > 0 ? (
            <section className="mt-10" aria-label={locale === "en" ? "Preparing previews" : "준비 중 Preview"}>
              <h2 className="text-lg font-bold text-surface-900">
                {locale === "en" ? "Preparing · Preview" : "준비 중 · Preview"}
              </h2>
              <p className="mt-1 text-sm text-surface-600">
                {locale === "en"
                  ? "Honest placeholders for formats in production—not live media."
                  : "제작·검수 중인 형식 자리 표시입니다. 실미디어가 아닙니다."}
              </p>
              <div className="mt-4 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {preparingItems.map((item) => (
                  <ContentCard key={item.slug} item={item} locale={locale} tier={tier} />
                ))}
              </div>
            </section>
          ) : null}

          {emptyAll ? (
            <p className="mt-8 text-sm text-surface-600">
              {locale === "en" ? "No items in this category yet." : "이 분류에 아직 항목이 없습니다."}
            </p>
          ) : null}

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
