import type { Locale } from "@/i18n/config";
import type { EbookCatalogItem } from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { EbookCover } from "@/components/ebook/EbookLibraryView";
import { LocalizedButton } from "@/components/locale/LocalizedButton";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { MembershipGate, ComingSoonCta } from "@/components/access/MembershipGate";
import { PreviewPersonaBar } from "@/components/access/PreviewPersonaBar";
import { Suspense } from "react";

export function EbookDetailView({ book, locale }: { book: EbookCatalogItem; locale: Locale }) {
  return (
    <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_40%)]">
      <div className="section-padding">
        <div className="container-main">
          <LocalizedLink
            href="/ebooks"
            className="inline-flex min-h-11 items-center text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            ← {locale === "en" ? "Back to library" : "서재로 돌아가기"}
          </LocalizedLink>

          <div className="mt-6 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <div className="mx-auto w-48 sm:w-56 lg:w-full">
              <EbookCover book={book} locale={locale} />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <AccessBadge tier={book.accessTier} locale={locale} />
                <OpsStatusBadge status={book.status} locale={locale} />
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-surface-600 ring-1 ring-surface-200">
                  {book.category[locale]}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-surface-950 sm:text-3xl">
                {book.title[locale]}
              </h1>
              <p className="mt-2 text-sm text-surface-500">
                {locale === "en" ? "Author" : "저자"} · {book.author[locale]}
              </p>
              <p className="mt-4 text-base leading-relaxed text-surface-700">{book.summary[locale]}</p>
              <p className="mt-3 text-sm font-medium text-brand-800">{book.priceNote[locale]}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <LocalizedButton href={`/ebooks/${book.slug}/read`} variant="primary" className="min-h-11">
                  {locale === "en" ? "Open web reader preview" : "Web Reader Preview 열기"}
                </LocalizedButton>
                <ComingSoonCta
                  locale={locale}
                  label={locale === "en" ? "Purchase coming soon" : "구매·이용권 준비중"}
                />
              </div>

              <div className="mt-6">
                <Suspense fallback={null}>
                  <PreviewPersonaBar locale={locale} />
                </Suspense>
              </div>
            </div>
          </div>

          <section className="mt-12" aria-labelledby="ebook-toc-heading">
            <h2 id="ebook-toc-heading" className="text-lg font-bold text-surface-900">
              {locale === "en" ? "Table of contents" : "목차"}
            </h2>
            <ol className="mt-4 space-y-2">
              {book.toc.map((item, i) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-surface-200 bg-white px-4 py-3"
                >
                  <span className="text-sm font-medium text-surface-800">
                    {i + 1}. {item.title[locale]}
                  </span>
                  <AccessBadge tier={item.accessTier} locale={locale} />
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-10" aria-labelledby="ebook-access-heading">
            <h2 id="ebook-access-heading" className="text-lg font-bold text-surface-900">
              {locale === "en" ? "Access & DRM direction" : "공개범위 · DRM 방향"}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-surface-600">
              <li>
                {locale === "en"
                  ? "No public PDF/EPUB URLs in this preview"
                  : "본 Preview에서 PDF/EPUB public URL 미노출"}
              </li>
              <li>
                {locale === "en"
                  ? "Future: entitlement checks, download/print limits, optional watermark"
                  : "향후: entitlement 확인, 다운로드·인쇄 제한, 워터마크 지원 구조"}
              </li>
              <li>
                {locale === "en"
                  ? "We do not claim 100% protection against screen capture"
                  : "웹 캡처 100% 차단을 주장하지 않습니다"}
              </li>
            </ul>
            <div className="mt-4">
              <MembershipGate locale={locale} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
