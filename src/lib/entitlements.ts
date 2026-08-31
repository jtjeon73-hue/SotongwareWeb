import { doc, getDoc } from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase";
import type { AccessLevel, Entitlement, MemberContentDocument } from "@/types/membership";
import type { ProductType } from "@/types/product";

export function isEntitlementActive(entitlement: Entitlement): boolean {
  if (entitlement.status !== "active") return false;
  if (!entitlement.expiresAt) return true;
  return new Date(entitlement.expiresAt) > new Date();
}

export function hasPremiumEntitlement(
  businessId: ProductType,
  entitlements: Entitlement[],
): boolean {
  return entitlements.some(
    (e) => e.businessId === businessId && e.plan === "premium" && isEntitlementActive(e),
  );
}

export function canAccessLevel(
  accessLevel: AccessLevel,
  businessId: ProductType,
  isAuthenticated: boolean,
  entitlements: Entitlement[],
): boolean {
  if (accessLevel === "public") return true;
  if (!isAuthenticated) return false;
  if (accessLevel === "member") return true;
  if (accessLevel === "premium") {
    return hasPremiumEntitlement(businessId, entitlements);
  }
  return false;
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
