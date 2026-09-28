import type { Firestore } from "firebase-admin/firestore";
import type { ProductEntitlementLookup, ProductEntitlementRow } from "./types";

function toDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const d = (value as { toDate: () => Date }).toDate();
    return d instanceof Date ? d : null;
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Reads users/{uid}/productEntitlements/* (doc id = ent_{orderId}).
 * Filters in memory by productId/status/expiresAt — safe with Admin SDK.
 *
 * Future index improvement (not in this phase):
 *   users/{uid}/productAccess/{productId} → O(1) lookup mirror written on grant.
 */
export class FirestoreProductEntitlementLookup implements ProductEntitlementLookup {
  constructor(private readonly db: Firestore) {}

  async listProductEntitlements(uid: string): Promise<ProductEntitlementRow[]> {
    const snap = await this.db.collection("users").doc(uid).collection("productEntitlements").get();
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        productId: String(data.productId || ""),
        status: String(data.status || ""),
        expiresAt: toDate(data.expiresAt),
      };
    });
  }
}

export class MemoryProductEntitlementLookup implements ProductEntitlementLookup {
  constructor(private readonly byUid: Map<string, ProductEntitlementRow[]>) {}

  async listProductEntitlements(uid: string): Promise<ProductEntitlementRow[]> {
    return this.byUid.get(uid) ?? [];
  }
}
