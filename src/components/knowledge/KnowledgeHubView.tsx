import type { Locale } from "@/i18n/config";
import type { KnowledgeThemeId } from "@/data/service-catalog";
import {
  getKnowledgeContents,
  getKnowledgeSites,
  knowledgeThemeLabels,
} from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { MembershipGate } from "@/components/access/MembershipGate";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Suspense } from "react";
import { KnowledgeThemeFilter } from "@/components/knowledge/KnowledgeThemeFilter";
import { KnowledgeMemberRail } from "@/components/knowledge/KnowledgeMemberRail";
import { KnowledgeSiteVisual } from "@/components/knowledge/KnowledgeSiteVisual";

export function KnowledgeHubView({
  locale,
  themeFilter,
}: {
  locale: Locale;
  themeFilter?: KnowledgeThemeId;
}) {
  const sites = getKnowledgeSites().filter((s) => !themeFilter || s.themeId === themeFilter);
  const contents = getKnowledgeContents(themeFilter);

  return (
    <div className="min-w-0 bg-[linear-gradient(180deg,#f3fbf7_0%,#ffffff_40%,#f8fbff_100%)]">
      <div className="section-padding">
        <div className="container-main min-w-0">
          <SectionHeader
            eyebrow={locale === "en" ? "Knowledge portal" : "지식·교육 포털"}
            title={locale === "en" ? "Explore themes & linked sites" : "테마와 연동 사이트 탐색"}
            description={
              locale === "en"
                ? "Browse the 12 free public hubs first. Basic members also get a unified learning rail that connects them — sign-in is never required to explore the hubs."
                : "12개 무료 공개 허브를 먼저 탐색하세요. Basic 회원은 허브들을 하나로 엮은 통합 학습 레일도 읽을 수 있으며, 허브 탐색에는 로그인이 필요하지 않습니다."
            }
          />

          <div
            className="mt-10 flex min-w-0 flex-wrap items-center gap-2"
            data-knowledge-section="public-hubs"
          >
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
              {locale === "en" ? "[Public hubs]" : "[공개 전문관]"}
            </span>
            <p className="min-w-0 text-sm text-surface-600">
              {locale === "en"
                ? "Free for everyone — 12 theme hubs and featured content."
                : "누구나 무료 — 12개 테마 허브와 대표 콘텐츠."}
            </p>
          </div>

          <section className="mt-6" aria-labelledby="knowledge-themes-heading">
            <h2 id="knowledge-themes-heading" className="text-lg font-bold text-surface-900">
              {locale === "en" ? "Themes" : "테마 카테고리"}
            </h2>
            <div className="mt-4">
              <Suspense fallback={null}>
                <KnowledgeThemeFilter locale={locale} active={themeFilter} />
              </Suspense>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="knowledge-sites-heading">
            <h2 id="knowledge-sites-heading" className="text-lg font-bold text-surface-900">
              {locale === "en" ? "Linked sites" : "연동 사이트"}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map((site) => (
                <article
                  key={site.slug}
                  className="flex h-full min-w-0 flex-col rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <KnowledgeSiteVisual slug={site.slug} />
                    <div className="flex min-w-0 flex-1 flex-wrap content-start gap-1.5">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
                        {knowledgeThemeLabels[site.themeId][locale]}
                      </span>
                      <OpsStatusBadge status={site.status} locale={locale} />
                      <AccessBadge tier={site.accessTier} locale={locale} />
                    </div>
                  </div>
                  <h3 className="mt-3 min-w-0 break-words text-base font-bold text-surface-900">
                    {site.name[locale]}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">{site.description[locale]}</p>
                  <div className="mt-4">
                    <LocalizedLink
                      href={`/knowledge/sites/${site.slug}`}
                      className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white hover:bg-emerald-700 sm:w-auto"
                    >
                      {locale === "en" ? "Site details" : "상세 보기"}
                    </LocalizedLink>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="knowledge-content-heading">
            <h2 id="knowledge-content-heading" className="text-lg font-bold text-surface-900">
              {locale === "en" ? "Featured learning content" : "대표 학습 콘텐츠"}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {contents.map((item) => (
                <article key={item.id} className="min-w-0 rounded-2xl border border-surface-200 bg-white p-5">
                  <div className="flex flex-wrap gap-1.5">
                    <AccessBadge tier={item.accessTier} locale={locale} />
                    <OpsStatusBadge status={item.status} locale={locale} />
                    <span className="rounded-full bg-surface-50 px-2.5 py-0.5 text-[11px] font-medium text-surface-600 ring-1 ring-surface-200">
                      {item.format[locale]}
                    </span>
                  </div>
                  <h3 className="mt-3 font-bold text-surface-900">{item.title[locale]}</h3>
                  <p className="mt-2 text-sm text-surface-600">{item.summary[locale]}</p>
                  {item.siteSlug ? (
                    <LocalizedLink
                      href={`/knowledge/sites/${item.siteSlug}`}
                      className="mt-3 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      {locale === "en" ? "Related site →" : "관련 사이트 →"}
                    </LocalizedLink>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <div
            className="mt-14 flex min-w-0 flex-wrap items-center gap-2"
            data-knowledge-section="member-benefits"
          >
            <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">
              {locale === "en" ? "[Basic member benefit]" : "[Basic 회원 혜택]"}
            </span>
            <p className="min-w-0 text-sm text-surface-600">
              {locale === "en"
                ? "Unified learning rail — read after the server verifies an active Basic term."
                : "통합 학습 레일 — 서버가 활성 Basic 이용권을 확인한 뒤 열람합니다."}
            </p>
          </div>

          <KnowledgeMemberRail locale={locale} />

          <section className="mt-12 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-surface-900">
              {locale === "en" ? "Member portal role" : "회원 포털의 역할"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-surface-600">
              {locale === "en"
                ? "After launch, the dashboard manages your courses, materials, library, purchases, passes, and continue-watching—not the first discovery step."
                : "정식 오픈 후 대시보드는 내 강의·자료·서재·구매/구독·이용권·이어보기 관리 허브입니다. 첫 탐색 진입점은 이 공개 포털입니다."}
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-surface-700 sm:grid-cols-2 lg:grid-cols-3">
              {(locale === "en"
                ? ["My courses", "My materials", "My library", "Purchases / subscriptions", "Passes", "Continue"]
                : ["내 강의", "내 자료", "내 서재", "구매/구독", "이용권", "이어보기"]
              ).map((label) => (
                <li key={label} className="rounded-lg border border-surface-100 bg-surface-50 px-3 py-2">
                  {label}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <MembershipGate locale={locale} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
