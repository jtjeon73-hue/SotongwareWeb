import { doc, getDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import { isAdminFromClaims } from "@/lib/membership-grade";
import {
  GOLDEN_EBOOK_PRODUCT_ID,
  MEMBERSHIP_PRODUCT_IDS,
} from "@/lib/commerce-policy";
import type { AccessTier } from "@/types/access-tier";
import type { AccessLevel, Entitlement, MemberContentDocument } from "@/types/membership";
import type { ProductType } from "@/types/product";

export function isEntitlementActive(entitlement: Entitlement): boolean {
  if (entitlement.status !== "active") return false;
  if (!entitlement.expiresAt) return true;
  return new Date(entitlement.expiresAt) > new Date();
}

/**
 * Premium access SSOT.
 * Admin custom claims (`role === "admin"`) satisfy premium without a paid entitlement row.
 * Do not pass PreviewPersona / UI flags here — claims come from Auth token only.
 */
export function hasPremiumEntitlement(
  businessId: ProductType,
  entitlements: Entitlement[],
  claims?: Record<string, unknown> | null,
): boolean {
  if (isAdminFromClaims(claims)) return true;
  return entitlements.some(
    (e) => e.businessId === businessId && e.plan === "premium" && isEntitlementActive(e),
  );
}

export function canAccessLevel(
  accessLevel: AccessLevel,
  businessId: ProductType,
  isAuthenticated: boolean,
  entitlements: Entitlement[],
  claims?: Record<string, unknown> | null,
): boolean {
  if (accessLevel === "public") return true;
  if (!isAuthenticated) return false;
  if (accessLevel === "member") return true;
  if (accessLevel === "premium") {
    return hasPremiumEntitlement(businessId, entitlements, claims);
  }
  return false;
}

/**
 * Effective catalog/reader AccessTier from Auth + entitlements.
 * PreviewPersona is intentionally not an input — mock preview merges elsewhere.
 */
export function resolveEffectiveAccessTier(input: {
  isAuthenticated: boolean;
  claims?: Record<string, unknown> | null;
  entitlements: Entitlement[];
  businessId: ProductType;
}): AccessTier {
  if (hasPremiumEntitlement(input.businessId, input.entitlements, input.claims ?? null)) {
    return "premium";
  }
  if (input.isAuthenticated) return "member";
  return "free";
}

/** UI helper — not authoritative; server Callable remains SSOT for premium body. */
export type CommerceProductEntitlementLike = {
  productId: string;
  status: string;
  expiresAt?: string | Date | null;
};

function isRowActive(row: CommerceProductEntitlementLike, now = new Date()): boolean {
  if (row.status !== "active") return false;
  if (row.expiresAt == null || row.expiresAt === "") return true;
  const exp = row.expiresAt instanceof Date ? row.expiresAt : new Date(row.expiresAt);
  return exp.getTime() > now.getTime();
}

export function uiHasActiveMembership(
  rows: CommerceProductEntitlementLike[],
  now = new Date(),
): boolean {
  return rows.some(
    (r) => (MEMBERSHIP_PRODUCT_IDS as readonly string[]).includes(r.productId) && isRowActive(r, now),
  );
}

export function uiHasOwnedEbook(
  rows: CommerceProductEntitlementLike[],
  productId: string = GOLDEN_EBOOK_PRODUCT_ID,
  now = new Date(),
): boolean {
  return rows.some((r) => r.productId === productId && isRowActive(r, now));
}

/** Display-only reader allowance hint (server still gates chapter body). */
export function uiMayReadFullEbook(input: {
  claims?: Record<string, unknown> | null;
  productEntitlements: CommerceProductEntitlementLike[];
  productId?: string;
  now?: Date;
}): boolean {
  if (isAdminFromClaims(input.claims)) return true;
  const now = input.now ?? new Date();
  const productId = input.productId ?? GOLDEN_EBOOK_PRODUCT_ID;
  return (
    uiHasOwnedEbook(input.productEntitlements, productId, now) ||
    uiHasActiveMembership(input.productEntitlements, now)
  );
}

/** Display-only download hint — membership alone is false. */
export function uiMayDownloadEbook(input: {
  claims?: Record<string, unknown> | null;
  productEntitlements: CommerceProductEntitlementLike[];
  productId?: string;
  now?: Date;
}): boolean {
  if (isAdminFromClaims(input.claims)) return true;
  return uiHasOwnedEbook(
    input.productEntitlements,
    input.productId ?? GOLDEN_EBOOK_PRODUCT_ID,
    input.now ?? new Date(),
  );
}

export async function fetchMemberContentBody(
  contentId: string,
): Promise<MemberContentDocument | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const snap = await getDoc(doc(db, "memberContents", contentId));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: snap.id,
    businessId: data.businessId,
    title: data.title ?? "",
    summary: data.summary ?? "",
    accessLevel: data.accessLevel ?? "member",
    publicationStatus: data.publicationStatus ?? "published",
    body: data.body ?? "",
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
}
