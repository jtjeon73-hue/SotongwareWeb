import type { ProductType } from "@/types/product";

/** 공개 / 회원 무료 / 프리미엄 접근 등급 */
export type AccessLevel = "public" | "member" | "premium";

/** 콘텐츠·사업 공개 상태 */
export type PublicationStatus = "draft" | "published" | "comingSoon";

export type UserRole = "member" | "admin";

export type UserStatus = "active" | "suspended";

export type EntitlementPlan = "free" | "member" | "premium";

export type EntitlementStatus = "active" | "expired" | "revoked";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
}

export interface Entitlement {
  businessId: ProductType;
  plan: EntitlementPlan;
  status: EntitlementStatus;
  grantedAt: string;
  expiresAt?: string | null;
}

/** Firestore memberContents 문서 — 원문은 서버/DB에만 저장 */
export interface MemberContentDocument {
  id: string;
  businessId: ProductType;
  title: string;
  summary: string;
  accessLevel: AccessLevel;
  publicationStatus: PublicationStatus;
  body: string;
  updatedAt: string;
}

/** 정적 카탈로그(미리보기) — 원문(body) 미포함 */
export interface MemberContentPreview {
  id: string;
  businessId: ProductType;
  title: string;
  teaser: string;
  accessLevel: AccessLevel;
  publicationStatus: PublicationStatus;
}

export interface BusinessPortalAccess {
  businessId: ProductType;
  accessLevel: AccessLevel;
  publicationStatus: PublicationStatus;
  memberCtaLabel: string;
  memberCtaHref: string;
}
