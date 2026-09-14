import type { Locale } from "@/i18n/config";
import type { KnowledgeSiteItem } from "@/data/service-catalog";
import { getKnowledgeContents, knowledgeThemeLabels } from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { ComingSoonCta } from "@/components/access/MembershipGate";
import { LocalizedLink } from "@/components/locale/LocalizedLink";

export function KnowledgeSiteView({ site, locale }: { site: KnowledgeSiteItem; locale: Locale }) {
  const related = getKnowledgeContents(site.themeId).filter((c) => c.siteSlug === site.slug);

  return (
    <div className="bg-[linear-gradient(180deg,#f3fbf7_0%,#ffffff_50%)]">
      <div className="section-padding">
        <div className="container-main max-w-3xl">
          <LocalizedLink href="/knowledge" className="text-sm font-medium text-emerald-700">
            ← {locale === "en" ? "Knowledge hub" : "지식·교육 허브"}
          </LocalizedLink>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200">
              {knowledgeThemeLabels[site.themeId][locale]}
            </span>
            <OpsStatusBadge status={site.status} locale={locale} />
            <AccessBadge tier={site.accessTier} locale={locale} />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-surface-950">{site.name[locale]}</h1>
          <p className="mt-3 text-base leading-relaxed text-surface-700">{site.description[locale]}</p>
          <p className="mt-4 text-sm text-surface-600">{site.urlNote[locale]}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ComingSoonCta
              locale={locale}
              label={locale === "en" ? "External site linking later" : "외부 사이트 연동은 이후 단계"}
            />
            <LocalizedLink
              href="/ebooks"
              className="inline-flex min-h-10 items-center rounded-lg border border-surface-200 px-3 text-sm font-medium text-surface-800 hover:bg-surface-50"
            >
              {locale === "en" ? "Related e-book library" : "관련 전자책 서재"}
            </LocalizedLink>
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-bold text-surface-900">
              {locale === "en" ? "Content on this site" : "이 사이트의 콘텐츠"}
            </h2>
            <ul className="mt-4 space-y-3">
              {related.length === 0 ? (
                <li className="rounded-xl border border-dashed border-surface-200 p-4 text-sm text-surface-500">
                  {locale === "en" ? "More content will appear here." : "콘텐츠가 순차적으로 등록됩니다."}
                </li>
              ) : (
                related.map((item) => (
                  <li key={item.id} className="rounded-xl border border-surface-200 bg-white p-4">
                    <div className="flex flex-wrap gap-1.5">
                      <AccessBadge tier={item.accessTier} locale={locale} />
                      <OpsStatusBadge status={item.status} locale={locale} />
                    </div>
                    <p className="mt-2 font-semibold text-surface-900">{item.title[locale]}</p>
                    <p className="mt-1 text-sm text-surface-600">{item.summary[locale]}</p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
