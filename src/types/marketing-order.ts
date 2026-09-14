/**
 * Future handoff contract: SotongWare Web → SotongWareControl work order.
 * Not sent anywhere in PHASE 3 — types + Preview only.
 */
export type MarketingPackageId = "lite" | "standard" | "pro" | "custom";

export type MarketingServiceId =
  | "sns"
  | "cardnews"
  | "blog"
  | "detail-page"
  | "landing"
  | "shorts"
  | "campaign"
  | "custom-promo";

export interface MarketingCustomerRequirement {
  industry: string;
  productOrService: string;
  goal: string;
  targetAudience: string;
  deliverables: MarketingServiceId[];
  channels: string[];
  style: string;
  referenceUrl?: string;
  deadline?: string;
  budgetRange?: string;
  notes?: string;
}

export interface MarketingMemberBenefitPreview {
  /** Preview policy only — not live billing */
  membershipTier: "free" | "basic_monthly" | "basic_yearly";
  notes: string;
}

/**
 * Stable draft payload for a future Control work-order create API.
 * schemaVersion bumps when Control contract changes.
 */
export interface MarketingWorkOrderDraft {
  schemaVersion: 1;
  serviceType: "marketing_promo_production";
  packageId: MarketingPackageId;
  serviceIds: MarketingServiceId[];
  customerRequirement: MarketingCustomerRequirement;
  revisionAllowance: number;
  memberBenefitPreview?: MarketingMemberBenefitPreview;
  /** Client-local stamp for Preview summary only — never persisted server-side here */
  previewGeneratedAt?: string;
}
