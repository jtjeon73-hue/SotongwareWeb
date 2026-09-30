import type { Locale } from "@/i18n/config";
import type { KnowledgeDisclaimerType, KnowledgeSiteItem } from "@/data/service-catalog";
import { getKnowledgeContents, knowledgeThemeLabels } from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { LocalizedLink } from "@/components/locale/LocalizedLink";

function ymylBanner(locale: Locale, type: KnowledgeDisclaimerType) {
  if (type === "ymyl_health") {
    return locale === "en"
      ? "General health education only—not diagnosis or a substitute for medical care. For emergencies or serious symptoms, seek a medical facility."
      : "일반 건강정보·교육 목적입니다. 진단이나 의료행위를 대체하지 않습니다. 응급·심각 증상이 있으면 의료기관을 이용해 주세요.";
  }
  return locale === "en"
    ? "Educational finance content only. Not personalized investment, tax, or legal advice. Decisions are your responsibility."
    : "교육용 금융 정보입니다. 개인 맞춤 투자·세무·법률 조언이 아니며, 결정과 책임은 이용자에게 있습니다.";
}

export function KnowledgeSiteView({ site, locale }: { site: KnowledgeSiteItem; locale: Locale }) {
  const related = getKnowledgeContents(site.themeId).filter((c) => c.siteSlug === site.slug);

  return (
    <div className="min-w-0 bg-[linear-gradient(180deg,#f3fbf7_0%,#ffffff_50%)]">
      <div className="section-padding">
        <div className="container-main max-w-3xl min-w-0">
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

          {site.disclaimerType ? (
            <div
              role="note"
              className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
            >
              {ymylBanner(locale, site.disclaimerType)}
            </div>
          ) : null}

          <p className="mt-4 text-sm text-surface-600">{site.urlNote[locale]}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={site.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              {locale === "en" ? "Visit live site" : "공개 사이트 방문"}
            </a>
          </div>

          {site.memberBenefits && site.memberBenefits.length > 0 ? (
            <section className="mt-8 rounded-xl border border-dashed border-surface-200 bg-surface-50 p-4">
              <h2 className="text-sm font-bold text-surface-800">
                {locale === "en" ? "Planned member benefits" : "회원 혜택 (준비 중)"}
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-surface-600">
                {site.memberBenefits.map((b) => (
                  <li key={b[locale]}>{b[locale]}</li>
                ))}
              </ul>
            </section>
          ) : null}

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
