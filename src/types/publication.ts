import type { ProductType } from "./product";

/** Production lifecycle — Sotong24Work output */
export type ProductionStatus =
  | "draft"
  | "generated"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "cancelled_preserved";

/** Step validators from Sotong24Work */
export type ValidationStatus =
  | "pending"
  | "passed"
  | "failed"
  | "internal_validation"
  | "awaiting_review"
  | "rejected";

export type QualityStatus = "pending" | "approved" | "rejected" | "awaiting_review";

export type ComplianceGateStatus = "pending" | "approved" | "rejected" | "awaiting_review";

/** Website publication state — fail-closed unless `published` with full approval */
export type WebPublicationStatus =
  | "draft"
  | "generated"
  | "testing"
  | "awaiting_review"
  | "internal_validation"
  | "rejected"
  | "failed"
  | "cancelled"
  | "cancelled_preserved"
  | "archived_private"
  | "published";

/** Per-product gate record — future SotongWareControl sync target */
export interface PublicationGateRecord {
  productionStatus?: ProductionStatus;
  validationStatus?: ValidationStatus;
  qualityStatus?: QualityStatus;
  complianceStatus?: ComplianceGateStatus;
  publicationStatus?: WebPublicationStatus;
  userFinalApproval?: boolean;
}

/** Audit trail for publish / unpublish events (homepage contract only) */
export interface PublicationAuditEntry {
  productId: string;
  productType: ProductType;
  instructionId?: string;
  jobId?: string;
  revision?: string;
  validationResult?: string;
  qualityStatus?: QualityStatus;
  complianceStatus?: ComplianceGateStatus;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  unpublishedAt?: string;
  deployUrl?: string;
  deployVersion?: string;
}
