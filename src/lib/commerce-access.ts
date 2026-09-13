/**
 * Entitlement access helpers.
 *
 * Authoritative split (ADR-003):
 * - users/{uid}/productEntitlements/{id} = commerce purchase rights (canonical)
 * - users/{uid}/entitlements/{businessId} = membership/premium portal rights (canonical for memberContents)
 */
import { doc, getDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";

export async function hasEntitlementForOrder(uid: string, orderId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;
  const snap = await getDoc(doc(db, "users", uid, "productEntitlements", `ent_${orderId}`));
  if (!snap.exists()) return false;
  const data = snap.data();
  return data.status === "active" && data.source === "commerce";
}
