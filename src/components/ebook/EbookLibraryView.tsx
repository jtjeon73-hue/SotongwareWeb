import type { Locale } from "@/i18n/config";
import type { EbookCatalogItem } from "@/data/service-catalog";
import { getEbookCatalog } from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { compactPriceNoteForCard } from "@/lib/ebook-price-note";

const COVER: Record<EbookCatalogItem["coverTone"], string> = {
  amber: "from-amber-200 via-orange-100 to-white",
  sky: "from-sky-200 via-cyan-50 to-white",
  emerald: "from-emerald-200 via-teal-50 to-white",
  violet: "from-violet-200 via-fuchsia-50 to-white",
};

export function EbookCover({
  book,
  locale,
  compact = false,
}: {
  book: EbookCatalogItem;
  locale: Locale;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/70 bg-gradient-to-br shadow-md ${COVER[book.coverTone]}`}
      aria-hidden
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-black/10" />
      {compact ? (
        <div className="flex h-full flex-col justify-end p-2">
          <p className="line-clamp-4 text-[8px] font-bold leading-tight text-surface-900/90">
            {book.title[locale]}
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-surface-600/80">
            {book.category[locale]}
          </p>
          <div>
            <p className="text-sm font-bold leading-snug text-surface-900">{book.title[locale]}</p>
            <p className="mt-1 text-[11px] text-surface-600">{book.author[locale]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function EbookCard({ book, locale }: { book: EbookCatalogItem; locale: Locale }) {
  const readLabel = locale === "en" ? "Read" : "읽기";
  const detailHref = `/ebooks/${book.slug}`;
  const readHref = `/ebooks/${book.slug}/read`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex sm:h-full sm:flex-col">
      {/* Mobile compact horizontal card (<640px) */}
      <div className="flex gap-3 p-3 sm:hidden" data-ebook-card="mobile-compact">
        <LocalizedLink href={detailHref} className="block w-20 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl">
          <EbookCover book={book} locale={locale} compact />
        </LocalizedLink>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="text-sm font-bold leading-snug text-surface-900">
            <LocalizedLink href={detailHref} className="line-clamp-2 hover:text-brand-700">
              {book.title[locale]}
            </LocalizedLink>
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-surface-600">{book.summary[locale]}</p>
          <p
            className="mt-1 text-[11px] font-medium text-brand-800"
            data-ebook-price="mobile-compact"
            title={book.priceNote[locale]}
          >
            {compactPriceNoteForCard(book.priceNote[locale])}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <AccessBadge tier={book.accessTier} locale={locale} />
            <OpsStatusBadge status={book.status} locale={locale} />
          </div>
          <LocalizedLink
            href={readHref}
            className="mt-2 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-brand-600 px-3 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {readLabel}
          </LocalizedLink>
        </div>
      </div>

      {/* sm+ vertical card (existing desktop/tablet look) */}
      <div className="hidden h-full flex-col sm:flex" data-ebook-card="desktop-vertical">
        <LocalizedLink href={detailHref} className="block p-4 pb-0">
          <EbookCover book={book} locale={locale} />
        </LocalizedLink>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap gap-1.5">
            <AccessBadge tier={book.accessTier} locale={locale} />
            <OpsStatusBadge status={book.status} locale={locale} />
          </div>
          <h3 className="mt-3 text-base font-bold text-surface-900">
            <LocalizedLink href={detailHref} className="hover:text-brand-700">
              {book.title[locale]}
            </LocalizedLink>
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">{book.summary[locale]}</p>
          <p className="mt-2 text-xs font-medium text-brand-800">{book.priceNote[locale]}</p>
          <LocalizedLink
            href={readHref}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {readLabel}
          </LocalizedLink>
        </div>
      </div>
    </article>
  );
}

export function EbookLibraryView({ locale }: { locale: Locale }) {
  const books = getEbookCatalog();
  return (
    <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_35%,#f5f9fc_100%)]">
      {/* Local padding: tighter on mobile only — do not change global .section-padding */}
      <div className="py-6 sm:py-16 lg:py-20">
        <div className="container-main">
          <header className="mb-4 max-w-3xl sm:mb-10" data-ebook-library-hero="compact-mobile">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              {locale === "en" ? "SotongWare Library" : "SotongWare 서재"}
            </p>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-surface-900 sm:text-3xl lg:text-4xl">
              {locale === "en" ? "E-book library" : "전자책 서재"}
            </h1>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-surface-600 sm:mt-4 sm:line-clamp-none sm:text-lg">
              {locale === "en"
                ? "Browse covers and summaries, then read free previews in the web reader. PDF/EPUB files are not exposed as public URLs."
                : "표지와 요약을 살펴보고 웹 리더에서 무료 미리보기를 읽습니다. PDF/EPUB 공개 URL은 제공하지 않습니다."}
            </p>
          </header>
          <div className="mt-4 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {books.map((book) => (
              <EbookCard key={book.slug} book={book} locale={locale} />
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-surface-500 sm:mt-8">
            {locale === "en"
              ? "Free preview chapters are open to everyone. Premium chapters require a membership or purchase. We do not claim screen capture can be fully blocked on the web."
              : "무료 미리보기 챕터는 누구나 열 수 있습니다. 프리미엄 챕터는 회원 또는 구매가 필요합니다. 웹에서 화면 캡처를 완전히 막을 수 있다고 주장하지 않습니다."}
          </p>
        </div>
      </div>
    </div>
  );
}
