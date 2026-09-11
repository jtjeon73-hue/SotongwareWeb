import type { ProductType } from "@/types/product";

/** 공개 / 회원 무료 / 프리미엄 접근 등급 */
export type AccessLevel = "public" | "member" | "premium";

/** 콘텐츠·사업 공개 상태 */
export type PublicationStatus = "draft" | "published" | "comingSoon";

/** Server-stored role — never written by client */
export type UserRole = "member" | "admin";

/** pending = awaiting server-validated consent (fail-closed) */
export type UserStatus = "pending" | "active" | "suspended";

/** Server-owned membership grade; Basic reserved, not activated in Phase 2A */
export type MembershipGradeField = "free" | "basic";

/** UX-facing grade */
export type MembershipUxGrade = "guest" | "free" | "admin";

export type EntitlementPlan = "free" | "member" | "premium";

export type EntitlementStatus = "active" | "expired" | "revoked";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  /** Future Basic reserved; Phase 2A customers are free after consent */
  membershipGrade?: MembershipGradeField;
  locale?: "ko" | "en";
  termsVersion?: string | null;
  termsAcceptedAt?: string | null;
  privacyVersion?: string | null;
  privacyAcceptedAt?: string | null;
  /** Legacy mirror of consent — server-owned only */
  consentAt?: string | null;
  /** Legacy mirror — server-owned only */
  policyVersion?: string | null;
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
