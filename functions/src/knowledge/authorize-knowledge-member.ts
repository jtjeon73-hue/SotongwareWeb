import {
  hasActiveMembershipEntitlement,
  isAdminFromToken,
} from "../ebook/authorize";
import { isMembershipProductId } from "../commerce/product-policy";
import type { AuthContext, ProductEntitlementRow } from "../ebook/types";

export type KnowledgeMemberAuthzDenial =
  | "unauthenticated"
  | "membership_missing"
  | "membership_inactive"
  | "membership_expired";

export type KnowledgeMemberAuthzResult =
  | { ok: true; reason: "admin" | "membership" }
  | { ok: false; code: KnowledgeMemberAuthzDenial };

/**
 * Knowledge Basic member benefit ALLOW if:
 * A) token.role=admin (server-verified claim)
 * B) active membership entitlement (monthly/yearly prepaid term)
 *
 * Owned one-time ebook entitlements alone do NOT unlock the member rail.
 * Client isAdmin/userTier/previewAccess are never authoritative.
 */
export function authorizeKnowledgeMemberAccess(input: {
  auth: AuthContext | null;
  entitlements: ProductEntitlementRow[];
  now?: Date;
}): KnowledgeMemberAuthzResult {
  if (!input.auth?.uid) {
    return { ok: false, code: "unauthenticated" };
  }
  if (isAdminFromToken(input.auth.token)) {
    return { ok: true, reason: "admin" };
  }

  const now = input.now ?? new Date();
  if (hasActiveMembershipEntitlement(input.entitlements, now)) {
    return { ok: true, reason: "membership" };
  }

  const membershipRows = input.entitlements.filter((r) => isMembershipProductId(r.productId));
  if (membershipRows.length === 0) {
    return { ok: false, code: "membership_missing" };
  }
  if (
    membershipRows.some(
      (r) => r.status === "active" && r.expiresAt != null && r.expiresAt.getTime() <= now.getTime(),
    )
  ) {
    return { ok: false, code: "membership_expired" };
  }
  return { ok: false, code: "membership_inactive" };
}
