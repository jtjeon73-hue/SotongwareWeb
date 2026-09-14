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

export type KnowledgeThemeId = "ai" | "electrical" | "plc" | "rural" | "hobby" | "other";

export interface KnowledgeSiteItem extends AdminMeta {
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

export type ContentFormatId =
  | "shorts"
  | "comic"
  | "comicVideo"
  | "music"
  | "video"
  | "image"
  | "other";

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
}
