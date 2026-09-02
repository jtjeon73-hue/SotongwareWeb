import type { PublicationGateRecord, WebPublicationStatus } from "@/types/publication";
import type { SotongProduct } from "@/types/product";

const BLOCKED_PUBLICATION_STATUSES = new Set<WebPublicationStatus>([
  "draft",
  "generated",
  "testing",
  "awaiting_review",
  "internal_validation",
  "rejected",
  "failed",
  "cancelled",
  "cancelled_preserved",
  "archived_private",
]);

const REQUIRED_GATE: Required<PublicationGateRecord> = {
  productionStatus: "completed",
  validationStatus: "passed",
  qualityStatus: "approved",
  complianceStatus: "approved",
  publicationStatus: "published",
  userFinalApproval: true,
};

function hasGateField<K extends keyof PublicationGateRecord>(
  gate: PublicationGateRecord,
  key: K,
): gate is PublicationGateRecord & Record<K, NonNullable<PublicationGateRecord[K]>> {
  return gate[key] !== undefined && gate[key] !== null;
}

/**
 * Fail-closed publication eligibility.
 * All six conditions must match; missing fields => not public.
 */
export function isPublicationEligible(gate: PublicationGateRecord | undefined | null): boolean {
  if (!gate) return false;

  for (const [key, expected] of Object.entries(REQUIRED_GATE) as [keyof PublicationGateRecord, string | boolean][]) {
    if (!hasGateField(gate, key) || gate[key] !== expected) {
      return false;
    }
  }

  if (gate.publicationStatus && BLOCKED_PUBLICATION_STATUSES.has(gate.publicationStatus)) {
    return false;
  }

  return true;
}

export function isProductPublic(product: SotongProduct): boolean {
  return isPublicationEligible(product.publicationGate);
}

export function getPublicationIneligibilityReason(
  gate: PublicationGateRecord | undefined | null,
): string | null {
  if (!gate) return "missing_publication_gate";

  for (const [key, expected] of Object.entries(REQUIRED_GATE) as [keyof PublicationGateRecord, string | boolean][]) {
    if (!hasGateField(gate, key)) return `missing_${key}`;
    if (gate[key] !== expected) return `invalid_${key}:${String(gate[key])}`;
  }

  if (gate.publicationStatus && BLOCKED_PUBLICATION_STATUSES.has(gate.publicationStatus)) {
    return `blocked_publication_status:${gate.publicationStatus}`;
  }

  return null;
}
