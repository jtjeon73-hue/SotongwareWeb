export type ProductType =
  | "app"
  | "ebook"
  | "knowledge"
  | "content"
  | "marketing"
  | "automation";

export type AccessMode = "free" | "member" | "paid" | "subscription" | "inquiry";

export type ProductStatus = "draft" | "testing" | "ready" | "published" | "archived";

export type AppReleaseStatus =
  | "development"
  | "testing"
  | "ready"
  | "play-store"
  | "live"
  | "update-planned";

export type KnowledgeTier = "free" | "member" | "paid" | "subscription";

export type ContentKind =
  | "music"
  | "shorts"
  | "video"
  | "image"
  | "comic"
  | "ad";

export interface ExternalLink {
  name: string;
  url: string;
}

export interface StoreLinks {
  playStore?: string;
  appStore?: string;
  ebookStores?: ExternalLink[];
  youtube?: string;
}

export interface AppMeta {
  version?: string;
  os?: string[];
  releaseStatus?: AppReleaseStatus;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  screenshots?: string[];
  features?: string[];
  usageGuide?: string;
  changelog?: { version: string; date: string; notes: string }[];
}

export interface EbookMeta {
  author?: string;
  tableOfContents?: string[];
  sampleUrl?: string;
  targetAudience?: string;
  authorBio?: string;
}

export interface KnowledgeMeta {
  contentTier: KnowledgeTier;
  field?: string;
  preview?: string;
}

export interface ContentMeta {
  contentKind?: ContentKind;
  licenseAvailable?: boolean;
  commissionAvailable?: boolean;
  embedUrl?: string;
}

export interface SotongProduct {
  id: string;
  slug: string;
  type: ProductType;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  language?: string;
  status: ProductStatus;
  accessMode: AccessMode;
  price?: number;
  currency?: string;
  /** 가격 미확정 시 "상담 후 결정" 등 */
  priceLabel?: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
  externalLinks?: ExternalLink[];
  storeLinks?: StoreLinks;
  relatedProductIds?: string[];
  appMeta?: AppMeta;
  ebookMeta?: EbookMeta;
  knowledgeMeta?: KnowledgeMeta;
  contentMeta?: ContentMeta;
}

export interface BusinessArea {
  id: ProductType;
  slug: string;
  title: string;
  titleKo: string;
  description: string;
  href: string;
  productsHref: string;
  icon: string;
  ctas: { label: string; href: string; variant?: "primary" | "outline" }[];
}

export interface MarketingTier {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceLabel: string;
}

export interface AutomationCapability {
  id: string;
  title: string;
  description: string;
}
