import {
  GOLDEN_EBOOK_PRODUCT_ID,
  isMembershipProductId,
} from "../commerce/product-policy";
import type { AuthContext, ProductEntitlementRow } from "./types";

/** Server-only admin check — token.role from verified Firebase Auth. */
export function isAdminFromToken(token: Record<string, unknown> | null | undefined): boolean {
  return Boolean(token && token.role === "admin");
}

export function isEntitlementActiveAt(
  row: ProductEntitlementRow,
  productId: string,
  now: Date,
): boolean {
  if (row.productId !== productId) return false;
  if (row.status !== "active") return false;
  if (row.expiresAt == null) return true;
  return row.expiresAt.getTime() > now.getTime();
}

export function hasActiveProductEntitlement(
  rows: ProductEntitlementRow[],
  productId: string,
  now: Date = new Date(),
): boolean {
  return rows.some((r) => isEntitlementActiveAt(r, productId, now));
}

/** Active monthly/yearly membership entitlement (subscription productIds). */
export function hasActiveMembershipEntitlement(
  rows: ProductEntitlementRow[],
  now: Date = new Date(),
): boolean {
  return rows.some((r) => {
    if (!isMembershipProductId(r.productId)) return false;
    if (r.status !== "active") return false;
    if (r.expiresAt == null) return true;
    return r.expiresAt.getTime() > now.getTime();
  });
}

/**
 * Owned one-time ebook entitlement for a specific product.
 * Membership subscription rows never match ebook productId.
 */
export function hasActiveOwnedEbookEntitlement(
  rows: ProductEntitlementRow[],
  productId: string,
  now: Date = new Date(),
): boolean {
  if (isMembershipProductId(productId)) return false;
  return hasActiveProductEntitlement(rows, productId, now);
}

export type EbookAuthzDenial =
  | "unauthenticated"
  | "forbidden"
  | "entitlement_missing"
  | "entitlement_inactive"
  | "entitlement_expired"
  | "wrong_product"
  | "membership_inactive"
  | "download_requires_owned";

export type EbookAuthzResult =
  | { ok: true; reason: "admin" | "product_entitlement" | "membership" }
  | { ok: false; code: EbookAuthzDenial };

export type EbookDownloadAuthzResult =
  | { ok: true; reason: "admin" | "owned_entitlement" }
  | { ok: false; code: EbookAuthzDenial };

/**
 * Full web reader ALLOW if:
 * A) token.role=admin
 * B) active membership (monthly/yearly product entitlement)
 * C) active owned productEntitlement for this productId
 *
 * Client isAdmin/userTier/previewAccess are never authoritative.
 */
export function authorizeEbookChapterAccess(input: {
  auth: AuthContext | null;
  productId: string;
  entitlements: ProductEntitlementRow[];
  now?: Date;
}): EbookAuthzResult {
  const productId = (input.productId || "").trim();
  if (!productId) {
    return { ok: false, code: "forbidden" };
  }
  if (!input.auth?.uid) {
    return { ok: false, code: "unauthenticated" };
  }
  if (isAdminFromToken(input.auth.token)) {
    return { ok: true, reason: "admin" };
  }

  const now = input.now ?? new Date();

  if (hasActiveOwnedEbookEntitlement(input.entitlements, productId, now)) {
    return { ok: true, reason: "product_entitlement" };
  }

  if (hasActiveMembershipEntitlement(input.entitlements, now)) {
    return { ok: true, reason: "membership" };
  }

  const forProduct = input.entitlements.filter((r) => r.productId === productId);
  if (forProduct.length === 0) {
    const otherActive = input.entitlements.some(
      (r) =>
        r.status === "active" &&
        r.productId !== productId &&
        !isMembershipProductId(r.productId),
    );
    if (otherActive) return { ok: false, code: "wrong_product" };
    return { ok: false, code: "entitlement_missing" };
  }

  if (forProduct.some((r) => r.status === "revoked" || r.status === "expired")) {
    return { ok: false, code: "entitlement_inactive" };
  }
  if (
    forProduct.some(
      (r) => r.status === "active" && r.expiresAt != null && r.expiresAt.getTime() <= now.getTime(),
    )
  ) {
    return { ok: false, code: "entitlement_expired" };
  }
  return { ok: false, code: "entitlement_inactive" };
}

/**
 * PDF/EPUB download ALLOW only if:
 * A) admin operational access
 * B) valid owned entitlement for this productId
 *
 * Membership alone → DENY.
 * Does not mint public URLs or signed URLs — entitlement contract only.
 */
export function authorizeEbookDownloadAccess(input: {
  auth: AuthContext | null;
  productId: string;
  entitlements: ProductEntitlementRow[];
  now?: Date;
}): EbookDownloadAuthzResult {
  const productId = (input.productId || "").trim();
  if (!productId) {
    return { ok: false, code: "forbidden" };
  }
  if (!input.auth?.uid) {
    return { ok: false, code: "unauthenticated" };
  }
  if (isAdminFromToken(input.auth.token)) {
    return { ok: true, reason: "admin" };
  }

  const now = input.now ?? new Date();
  if (hasActiveOwnedEbookEntitlement(input.entitlements, productId, now)) {
    return { ok: true, reason: "owned_entitlement" };
  }

  if (hasActiveMembershipEntitlement(input.entitlements, now)) {
    return { ok: false, code: "download_requires_owned" };
  }

  const forProduct = input.entitlements.filter((r) => r.productId === productId);
  if (forProduct.length === 0) {
    const otherOwned = input.entitlements.some(
      (r) =>
        r.status === "active" &&
        r.productId !== productId &&
        !isMembershipProductId(r.productId),
    );
    if (otherOwned) return { ok: false, code: "wrong_product" };
    return { ok: false, code: "entitlement_missing" };
  }
  if (
    forProduct.some(
      (r) => r.status === "active" && r.expiresAt != null && r.expiresAt.getTime() <= now.getTime(),
    )
  ) {
    return { ok: false, code: "entitlement_expired" };
  }
  return { ok: false, code: "entitlement_inactive" };
}

/** Convenience: default Golden ebook product id for policy-aligned callers. */
export const DEFAULT_GOLDEN_EBOOK_PRODUCT_ID = GOLDEN_EBOOK_PRODUCT_ID;
