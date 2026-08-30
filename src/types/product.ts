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

export type BusinessSiteStatus = "active" | "preparing" | "coming-soon";

export interface BusinessArea {
  id: ProductType;
  slug: string;
  title: string;
  titleKo: string;
  description: string;
  /** SotongWare 내부 사업 소개 경로 */
  href: string;
  internalPath: string;
  productsHref: string;
  icon: string;
  /** 수익·서비스 모델 (카드 태그) */
  revenueModel: string;
  /** 외부 전문 사이트 — 검증된 URL만 */
  externalSiteUrl?: string;
  externalSiteLabel?: string;
  /** 분석·문서용 외부 서비스명 (예: SotongSiteManager) */
  externalSiteName?: string;
  siteStatus: BusinessSiteStatus;
  /** 한 줄 가치 제안 */
  tagline: string;
  /** 대상 고객 */
  audience?: string;
  /** 기술·플랫폼 태그 */
  platforms?: string;
  /** 전환 보조 CTA (구독·출시 준비 등) */
  conversionHints?: string[];
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
