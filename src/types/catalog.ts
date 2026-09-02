/**
 * 상품·결제·구독·합법성 확장 모델 — Live PG 연동 전 구조 정의.
 * 특정 결제업체·카드정보 하드코딩 금지.
 */

import type { AccessMode, ProductStatus, ProductType } from "./product";
import type { PaymentProviderId } from "./payment";

export type PublicationStatus =
  | "draft"
  | "review"
  | "approved"
  | "published"
  | "suspended"
  | "archived";

export type ComplianceStatus =
  | "pending_review"
  | "copyright_verified"
  | "ai_disclosure_required"
  | "legal_review_required"
  | "approved"
  | "rejected";

export type RevenueModel =
  | "free"
  | "one_time"
  | "subscription_monthly"
  | "subscription_yearly"
  | "ad_supported"
  | "freemium"
  | "bundle"
  | "enterprise_license"
  | "consultation_quote"
  | "sponsorship"
  | "affiliate"
  | "content_license";

export interface LocaleContent<T = string> {
  ko: T;
  en: T;
}

export interface Price {
  amount: number;
  currency: string;
  /** 가격 미확정 시 표시 라벨 */
  label?: LocaleContent;
  taxIncluded?: boolean;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  type: ProductType;
  title: LocaleContent;
  description: LocaleContent;
  publicationStatus: PublicationStatus;
  complianceStatus: ComplianceStatus;
  productStatus: ProductStatus;
  accessMode: AccessMode;
  revenueModels: RevenueModel[];
  price?: Price;
  localeContent?: {
    seo?: LocaleContent<{ title: string; description: string }>;
  };
}

export interface PaymentAttempt {
  id: string;
  orderId: string;
  provider: PaymentProviderId;
  status: "pending" | "succeeded" | "failed" | "cancelled";
  amount: number;
  currency: string;
  createdAt: string;
  failureReason?: string;
}

export interface Refund {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "rejected";
  reason?: string;
  createdAt: string;
}

export interface CatalogEntitlement {
  id: string;
  userId: string;
  productId: string;
  source: "purchase" | "subscription" | "grant" | "member";
  status: "active" | "expired" | "revoked";
  expiresAt?: string;
}

/** 상품 공개 전 검토 체크리스트 */
export interface ComplianceChecklist {
  productId: string;
  status: ComplianceStatus;
  items: {
    id: string;
    label: LocaleContent;
    required: boolean;
    checked: boolean;
    notes?: string;
  }[];
  reviewedAt?: string;
  approvedBy?: string;
}
