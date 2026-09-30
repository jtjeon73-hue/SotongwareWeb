import type { Locale } from "@/i18n/config";
import type { ContentCatalogItem, ContentRendererId } from "@/data/service-catalog";
import {
  contentUiCategoryLabels,
  formatIdToUiCategory,
  getEbookBySlug,
  getKnowledgeSiteBySlug,
  hasRelatedLinks,
  relatedLinkTargets,
} from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { ComingSoonCta, MembershipGate } from "@/components/access/MembershipGate";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { PreviewPersonaBar } from "@/components/access/PreviewPersonaBar";
import { ComicPanelReader } from "@/components/content/ComicPanelReader";
import { isPreviewPersonaEnabled } from "@/lib/access-tier";
import {
  getOrderedComicPanels,
  isCustomerLiveContent,
  resolveContentRenderer,
} from "@/lib/content-publication-gate";
import { Suspense } from "react";

const TONE: Record<string, string> = {
  rose: "from-rose-200 via-pink-50 to-white",
  sky: "from-sky-200 via-cyan-50 to-white",
  amber: "from-amber-200 via-orange-50 to-white",
  violet: "from-violet-200 via-fuchsia-50 to-white",
  emerald: "from-emerald-200 via-teal-50 to-white",
  slate: "from-slate-300 via-slate-100 to-white",
};

function PreparingStage({ locale, renderer }: { locale: Locale; renderer: ContentRendererId }) {
  return (
    <div
      className="mt-6 min-w-0 rounded-2xl border border-dashed border-rose-200 bg-white p-6 text-center"
      data-content-renderer={renderer}
      data-content-stage="preparing"
    >
      <p className="text-sm font-semibold text-surface-800">
        {locale === "en" ? "Preparing" : "준비 중"}
      </p>
      <p className="mt-2 text-sm text-surface-600">
        {locale === "en"
          ? "This work opens after media review and publication approval."
          : "미디어 검수와 공개 승인 후에 이용할 수 있습니다."}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <ComingSoonCta locale={locale} label={locale === "en" ? "Open when published" : "공개 후 이용"} />
      </div>
    </div>
  );
}

function ContentMediaStage({ item, locale }: { item: ContentCatalogItem; locale: Locale }) {
  const panels = getOrderedComicPanels(item);
  const live = isCustomerLiveContent(item);
  const renderer = resolveContentRenderer(item);
  const allowDevPreview = isPreviewPersonaEnabled();

  /** Dev/local only: preview public_asset comic without claiming live. Hidden in production builds. */
  const preparingComicPreview =
    allowDevPreview &&
    item.formatId === "comic" &&
    !live &&
    item.media.source === "public_asset" &&
    panels.length > 0;

  if (preparingComicPreview) {
    return (
      <div className="min-w-0" data-content-stage="preparing-preview">
        <div
          className="mt-6 min-w-0 rounded-2xl border border-dashed border-amber-200 bg-amber-50/80 p-4 text-center"
          data-content-renderer="preparing"
          data-dev-only-preview="true"
        >
          <p className="text-sm font-semibold text-amber-950">
            {locale === "en" ? "Local preview · not published" : "로컬 미리보기 · 아직 공개 전"}
          </p>
          <p className="mt-1 text-sm text-amber-900/80">
            {locale === "en"
              ? "Dev-only review. Live requires rights, review, and approval."
              : "개발 검수용입니다. 운영 공개는 권리·검수·승인 후에만 진행합니다."}
          </p>
        </div>
        <ComicPanelReader panels={panels} locale={locale} title={item.title[locale]} />
      </div>
    );
  }

  if (renderer === "preparing") {
    return <PreparingStage locale={locale} renderer={renderer} />;
  }

  if (renderer === "comic") {
    if (panels.length < 1 || !live) {
      return <PreparingStage locale={locale} renderer="preparing" />;
    }
    return <ComicPanelReader panels={panels} locale={locale} title={item.title[locale]} />;
  }

  return (
    <div
      className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-rose-100 bg-white"
      data-content-renderer={renderer}
      data-content-stage="live-slot"
    >
      <div className="aspect-video min-w-0 bg-surface-100" />
      <p className="p-4 text-sm text-surface-600">
        {locale === "en" ? `Renderer slot: ${renderer}` : `렌더러 슬롯: ${renderer}`}
      </p>
    </div>
  );
}

function RelatedLinks({ item, locale }: { item: ContentCatalogItem; locale: Locale }) {
  if (!hasRelatedLinks(item)) return null;
  const targets = relatedLinkTargets(item);
  const links: { href: string; label: string }[] = [];
  for (const slug of targets.knowledge) {
    const site = getKnowledgeSiteBySlug(slug);
    if (!site) continue;
    links.push({
      href: `/knowledge/sites/${slug}`,
      label: site.name[locale],
    });
  }
  for (const slug of targets.ebooks) {
    const book = getEbookBySlug(slug);
    if (!book) continue;
    links.push({
      href: `/ebooks/${slug}`,
      label: book.title[locale],
    });
  }
  for (const slug of targets.apps) {
    links.push({
      href: `/apps`,
      label: locale === "en" ? `App: ${slug}` : `앱: ${slug}`,
    });
  }
  const shown = links.slice(0, 2);
  if (shown.length === 0) return null;

  return (
    <div className="mt-6 min-w-0" data-content-related="true">
      <h2 className="text-sm font-semibold text-surface-800">
        {locale === "en" ? "Related" : "관련"}
      </h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {shown.map((l) => (
          <li key={l.href + l.label}>
            <LocalizedLink
              href={l.href}
              className="inline-flex min-h-11 items-center rounded-lg border border-rose-200 bg-white px-3 text-sm font-medium text-rose-800 hover:bg-rose-50"
            >
              {l.label}
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContentDetailView({ item, locale }: { item: ContentCatalogItem; locale: Locale }) {
  const ui = formatIdToUiCategory(item.formatId);
  const formatLabel = ui ? contentUiCategoryLabels[ui][locale] : item.formatId;
  const live = isCustomerLiveContent(item);
  /** Prefer full poster (publicSrc) over card thumbnail so hero is not over-cropped. */
  const coverSrc =
    live || item.media.source === "public_asset"
      ? item.media.publicSrc || item.media.poster || null
      : null;
  const showMembershipGate = item.accessTier !== "free";

  return (
    <div className="min-w-0 overflow-x-hidden bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_50%)]">
      <div className="section-padding">
        <div className="container-main max-w-3xl min-w-0">
          <LocalizedLink href="/contents" className="text-sm font-medium text-rose-700">
            ← {locale === "en" ? "Content library" : "콘텐츠 라이브러리"}
          </LocalizedLink>
          <div
            className={`mt-6 flex min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br p-3 sm:p-5 ${TONE[item.coverTone]}`}
            data-content-detail-cover="true"
            data-content-hero-fit="contain"
          >
            {coverSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverSrc}
                alt={item.media.alt[locale]}
                width={1080}
                height={1350}
                className="h-auto w-full max-h-[min(70vh,36rem)] max-w-md object-contain object-center sm:max-h-[min(72vh,40rem)] sm:max-w-lg"
              />
            ) : (
              <div className="aspect-[4/5] w-full max-w-md" aria-hidden />
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800 ring-1 ring-rose-200">
              {formatLabel}
            </span>
            <AccessBadge tier={item.accessTier} locale={locale} />
            <OpsStatusBadge status={item.status} locale={locale} />
          </div>
          <h1 className="mt-4 min-w-0 break-words text-3xl font-bold tracking-tight text-surface-950">
            {item.title[locale]}
          </h1>
          <p className="mt-3 min-w-0 break-words text-base leading-relaxed text-surface-700">
            {item.summary[locale]}
          </p>
          <p className="mt-3 text-sm text-surface-500">
            {item.theme[locale]} · {item.channel[locale]}
          </p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <PreviewPersonaBar locale={locale} />
            </Suspense>
          </div>
          <ContentMediaStage item={item} locale={locale} />
          <RelatedLinks item={item} locale={locale} />
          {showMembershipGate ? (
            <div className="mt-6">
              <MembershipGate locale={locale} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
