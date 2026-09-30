import type { AccessTier, OpsStatus } from "@/types/access-tier";
import type { Locale } from "@/i18n/config";

export type LocalizedText = Record<Locale, string>;

export interface AdminMeta {
  /** Future admin fields — static preview only for now */
  sortOrder: number;
  updatedAt: string;
  featured?: boolean;
}

export interface EbookTocItem {
  id: string;
  title: LocalizedText;
  accessTier: AccessTier;
}

export interface EbookPage {
  /** Mock page body — never a PDF/EPUB asset URL */
  paragraphs: LocalizedText[];
}

export interface EbookChapter {
  id: string;
  title: LocalizedText;
  accessTier: AccessTier;
  /**
   * free: inline preview pages.
   * premium: always [] in the public catalog — body lives in private artifacts / future Callable.
   */
  pages: EbookPage[];
}

export interface EbookCatalogItem extends AdminMeta {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  category: LocalizedText;
  accessTier: AccessTier;
  status: OpsStatus;
  author: LocalizedText;
  coverTone: "amber" | "sky" | "emerald" | "violet";
  toc: EbookTocItem[];
  chapters: EbookChapter[];
  priceNote: LocalizedText;
}

export type KnowledgeThemeId =
  | "ai"
  | "electrical"
  | "plc"
  | "rural"
  | "hobby"
  | "other"
  | "mobility"
  | "finance"
  | "language"
  | "health"
  | "dev"
  | "life";

export type KnowledgeDisclaimerType = "ymyl_health" | "ymyl_finance";

export interface KnowledgeSiteItem extends AdminMeta {
  id: string;
  /** Former preview slug or upstream site id — admin / redirect only */
  legacySiteId?: string;
  slug: string;
  name: LocalizedText;
  themeId: KnowledgeThemeId;
  description: LocalizedText;
  status: OpsStatus;
  accessTier: AccessTier;
  featuredContent: LocalizedText;
  /** Internal relative path or preview placeholder — never requires live Auth */
  openHref?: string;
  urlNote: LocalizedText;
  /** Live public hub URL — customer CTA opens this site */
  externalUrl: string;
  /** Planned member perks — not delivered locks */
  memberBenefits?: LocalizedText[];
  disclaimerType?: KnowledgeDisclaimerType;
  /** Admin-only repo hint — never shown in customer UI */
  sourceRepo?: string;
}

export interface KnowledgeContentItem extends AdminMeta {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  themeId: KnowledgeThemeId;
  siteSlug?: string;
  accessTier: AccessTier;
  status: OpsStatus;
  format: LocalizedText;
}

/** Internal catalog format — comicVideo stays distinct from video. */
export type ContentFormatId =
  | "shorts"
  | "comic"
  | "comicVideo"
  | "music"
  | "video"
  | "image"
  | "game"
  | "other";

/** Customer-facing hub tabs — comicVideo + video collapse to "video". */
export type ContentUiCategoryId =
  | "shorts"
  | "music"
  | "comic"
  | "video"
  | "image"
  | "game";

export type ContentMediaKind =
  | "shortVideo"
  | "audio"
  | "comic"
  | "video"
  | "image"
  | "game";

/**
 * Media source contract.
 * - none: no playable media (placeholders)
 * - public_asset: path under site public/ only (never private Storage URL)
 * - external_embed: public embed id/url allowlisted later (YouTube etc.)
 * - protected_ref: opaque assetRef for Phase 4 entitlement fetch — not a URL
 */
export type ContentMediaSource = "none" | "public_asset" | "external_embed" | "protected_ref";

export interface ContentMediaMeta {
  kind: ContentMediaKind;
  source: ContentMediaSource;
  /** Public path or public embed handle — NEVER a private Storage/signed URL */
  publicSrc?: string;
  /** Opaque id for future server authorization — not a URL */
  assetRef?: string;
  /** Public poster/thumbnail path when applicable */
  poster?: string;
  aspectRatio?: string;
  durationSeconds?: number;
  alt: LocalizedText;
  caption?: LocalizedText;
}

export type ContentRightsStatus = "unchecked" | "cleared" | "restricted" | "blocked";

/** Internal provenance — customer AI badge policy is not fixed in Phase 1 */
export type ContentAiProvenance = "none" | "aiAssisted" | "aiGenerated";

export interface ContentPublicationMeta {
  rightsStatus: ContentRightsStatus;
  aiProvenance: ContentAiProvenance;
  reviewed: boolean;
  approvedForPublic: boolean;
  publishedAt?: string;
}

export interface ContentRelatedMeta {
  knowledgeSlugs?: string[];
  ebookSlugs?: string[];
  appSlugs?: string[];
}

/** Phase 1 launch metadata only — no executable game bundle yet */
export interface ContentGameMeta {
  launchMode: "embedded" | "route";
  playPath?: string;
  supportsTouch: boolean;
  supportsKeyboard: boolean;
  guestPlayAllowed: boolean;
  localScore: boolean;
  memberRankingFuture: boolean;
}

export type ContentRendererId =
  | "shortVideo"
  | "audio"
  | "comic"
  | "video"
  | "image"
  | "game"
  | "preparing";

/** Ordered comic page — public path only; text overlays stay out of the bitmap when possible */
export interface ContentComicPanel {
  order: number;
  src: string;
  alt: LocalizedText;
}

export interface ContentCatalogItem extends AdminMeta {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  formatId: ContentFormatId;
  theme: LocalizedText;
  accessTier: AccessTier;
  status: OpsStatus;
  channel: LocalizedText;
  coverTone: "rose" | "sky" | "amber" | "violet" | "emerald" | "slate";
  media: ContentMediaMeta;
  publication: ContentPublicationMeta;
  related?: ContentRelatedMeta;
  game?: ContentGameMeta;
  /** Optional series bucket for multi-IP catalogs (e.g. sotong-cat) */
  seriesId?: string;
  episode?: number;
  /** Comic reader panels — public web paths under /contents/... */
  comicPanels?: ContentComicPanel[];
}
