import type { Locale } from "@/i18n/config";
import type { EbookCatalogItem } from "@/data/service-catalog";
import { getEbookCatalog } from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
  const readLabel = locale === "en" ? "Read" : "읽기";
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
                ? "Browse covers and summaries, then read free previews in the web reader. PDF/EPUB files are not exposed as public URLs."
                : "표지와 요약을 살펴보고 웹 리더에서 무료 미리보기를 읽습니다. PDF/EPUB 공개 URL은 제공하지 않습니다."
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <EbookCard key={book.slug} book={book} locale={locale} />
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-surface-500">
            {locale === "en"
              ? "Free preview chapters are open to everyone. Premium chapters require a membership or purchase. We do not claim screen capture can be fully blocked on the web."
              : "무료 미리보기 챕터는 누구나 열 수 있습니다. 프리미엄 챕터는 회원 또는 구매가 필요합니다. 웹에서 화면 캡처를 완전히 막을 수 있다고 주장하지 않습니다."}
          </p>
        </div>
      </div>
    </div>
  );
}
