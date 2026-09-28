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

export type EbookAuthzDenial =
  | "unauthenticated"
  | "forbidden"
  | "entitlement_missing"
  | "entitlement_inactive"
  | "entitlement_expired"
  | "wrong_product";

export type EbookAuthzResult =
  | { ok: true; reason: "admin" | "product_entitlement" }
  | { ok: false; code: EbookAuthzDenial };

/**
 * Authoritative premium chapter access.
 * Ignores any client-provided isAdmin/userTier/previewAccess/email/uid flags —
 * callers must not pass those into this function as authority.
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
  const forProduct = input.entitlements.filter((r) => r.productId === productId);
  if (forProduct.length === 0) {
    const otherActive = input.entitlements.some(
      (r) => r.status === "active" && r.productId !== productId,
    );
    if (otherActive) return { ok: false, code: "wrong_product" };
    return { ok: false, code: "entitlement_missing" };
  }

  if (forProduct.some((r) => isEntitlementActiveAt(r, productId, now))) {
    return { ok: true, reason: "product_entitlement" };
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
