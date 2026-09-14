import type { Locale } from "@/i18n/config";
import type { EbookCatalogItem } from "@/data/service-catalog";
import { getEbookCatalog } from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PreviewPersonaBar } from "@/components/access/PreviewPersonaBar";
import { Suspense } from "react";

const COVER: Record<EbookCatalogItem["coverTone"], string> = {
  amber: "from-amber-200 via-orange-100 to-white",
  sky: "from-sky-200 via-cyan-50 to-white",
  emerald: "from-emerald-200 via-teal-50 to-white",
  violet: "from-violet-200 via-fuchsia-50 to-white",
};

export function EbookCover({ book, locale }: { book: EbookCatalogItem; locale: Locale }) {
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/70 bg-gradient-to-br shadow-md ${COVER[book.coverTone]}`}
      aria-hidden
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-black/10" />
      <div className="flex h-full flex-col justify-between p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-surface-600/80">
          {book.category[locale]}
        </p>
        <div>
          <p className="text-sm font-bold leading-snug text-surface-900">{book.title[locale]}</p>
          <p className="mt-1 text-[11px] text-surface-600">{book.author[locale]}</p>
        </div>
      </div>
    </div>
  );
}

export function EbookCard({ book, locale }: { book: EbookCatalogItem; locale: Locale }) {
  const readLabel = locale === "en" ? "Preview / read" : "미리보기 · 읽기";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <LocalizedLink href={`/ebooks/${book.slug}`} className="block p-4 pb-0">
        <EbookCover book={book} locale={locale} />
      </LocalizedLink>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap gap-1.5">
          <AccessBadge tier={book.accessTier} locale={locale} />
          <OpsStatusBadge status={book.status} locale={locale} />
        </div>
        <h3 className="mt-3 text-base font-bold text-surface-900">
          <LocalizedLink href={`/ebooks/${book.slug}`} className="hover:text-brand-700">
            {book.title[locale]}
          </LocalizedLink>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">{book.summary[locale]}</p>
        <LocalizedLink
          href={`/ebooks/${book.slug}/read`}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {readLabel}
        </LocalizedLink>
      </div>
    </article>
  );
}

export function EbookLibraryView({ locale }: { locale: Locale }) {
  const books = getEbookCatalog();
  return (
    <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_35%,#f5f9fc_100%)]">
      <div className="section-padding">
        <div className="container-main">
          <SectionHeader
            eyebrow={locale === "en" ? "SotongWare Library" : "SotongWare 서재"}
            title={locale === "en" ? "E-book library" : "전자책 서재"}
            description={
              locale === "en"
                ? "Browse covers, summaries, and access tiers—then open the in-site web reader preview. Original PDF/EPUB files are never exposed as public URLs."
                : "표지·요약·공개등급을 살펴보고 SotongWare 자체 Web Reader Preview로 열람합니다. 원본 PDF/EPUB public URL은 노출하지 않습니다."
            }
          />
          <div className="mt-6">
            <Suspense fallback={null}>
              <PreviewPersonaBar locale={locale} />
            </Suspense>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <EbookCard key={book.slug} book={book} locale={locale} />
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-surface-500">
            {locale === "en"
              ? "Architecture note: future entitlement checks, watermarking, and direct-asset blocking are planned. Screen capture cannot be claimed as 100% preventable on the web."
              : "구조 안내: 향후 entitlement 확인·워터마크·직접 자산 차단을 전제로 설계합니다. 웹 캡처를 100% 차단할 수 있다고 표현하지 않습니다."}
          </p>
        </div>
      </div>
    </div>
  );
}
