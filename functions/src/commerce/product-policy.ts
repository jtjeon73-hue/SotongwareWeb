/**
 * Commerce product/price SSOT mirror for Cloud Functions.
 * Keep amounts/IDs in sync with src/lib/commerce-policy/catalog.mjs.
 */

export const MEMBERSHIP_MONTHLY_PRODUCT_ID = "membership_basic_monthly";
export const MEMBERSHIP_YEARLY_PRODUCT_ID = "membership_basic_yearly";
export const GOLDEN_EBOOK_PRODUCT_ID = "ai-first-ebook-for-50s";

export const MEMBERSHIP_PRODUCT_IDS = [
  MEMBERSHIP_MONTHLY_PRODUCT_ID,
  MEMBERSHIP_YEARLY_PRODUCT_ID,
] as const;

export type CommercePolicyProductDoc = {
  id: string;
  businessUnit: "automation" | "app" | "ebook" | "knowledge" | "marketing" | "content";
  slug: string;
  title: string;
  summary: string;
  productType: "digital_download" | "web_service" | "app" | "content" | "education" | "automation";
  pricingType: "free" | "one_time" | "subscription";
  billingCycle: "none" | "monthly" | "annual";
  currency: "KRW";
  amount: number;
  status: "draft" | "review" | "published" | "suspended" | "archived";
  version: number;
  deliveryType: "download" | "unlock" | "license" | "service_access" | "manual";
};

/** Prepaid term lengths — not Toss auto-billing cycles. */
export const MEMBERSHIP_TERM_DAYS = {
  monthly: 30,
  annual: 365,
} as const;

/** Recurring / billing-key auto-charge is NOT implemented. */
export const RECURRING_BILLING_IMPLEMENTED = false;

export type MembershipTermContract = {
  productId: string;
  billingCycle: "monthly" | "annual";
  termDays: number;
  startsAt: Date;
  expiresAt: Date;
  autoRenew: false;
  recurringBilling: false;
};

export function isMembershipProductId(productId: string): boolean {
  return (MEMBERSHIP_PRODUCT_IDS as readonly string[]).includes(productId);
}

export function computeMembershipTerm(
  productId: string,
  billingCycle: "monthly" | "annual",
  startsAt: Date,
): MembershipTermContract {
  const termDays =
    billingCycle === "monthly" ? MEMBERSHIP_TERM_DAYS.monthly : MEMBERSHIP_TERM_DAYS.annual;
  const expiresAt = new Date(startsAt.getTime() + termDays * 24 * 60 * 60 * 1000);
  return {
    productId,
    billingCycle,
    termDays,
    startsAt,
    expiresAt,
    autoRenew: false,
    recurringBilling: false,
  };
}

export function membershipExpiresAtForProduct(
  productId: string,
  billingCycle: string,
  startsAt: Date,
): Date | null {
  if (!isMembershipProductId(productId)) return null;
  if (billingCycle !== "monthly" && billingCycle !== "annual") return null;
  return computeMembershipTerm(productId, billingCycle, startsAt).expiresAt;
}

export const MEMBERSHIP_MONTHLY_PRODUCT: CommercePolicyProductDoc = {
  id: MEMBERSHIP_MONTHLY_PRODUCT_ID,
  businessUnit: "content",
  slug: "membership-basic-monthly",
  title: "SotongWare Basic 멤버십 (월간)",
  summary:
    "기간제 이용권(30일) · 자동갱신 아님. 활성 기간 웹 열람. PDF/EPUB 다운로드 미포함.",
  productType: "content",
  pricingType: "subscription",
  billingCycle: "monthly",
  currency: "KRW",
  amount: 2000,
  status: "published",
  version: 1,
  deliveryType: "service_access",
};

export const MEMBERSHIP_YEARLY_PRODUCT: CommercePolicyProductDoc = {
  id: MEMBERSHIP_YEARLY_PRODUCT_ID,
  businessUnit: "content",
  slug: "membership-basic-yearly",
  title: "SotongWare Basic 멤버십 (연간)",
  summary:
    "기간제 이용권(365일) · 자동갱신 아님. 활성 기간 웹 열람. PDF/EPUB 다운로드 미포함.",
  productType: "content",
  pricingType: "subscription",
  billingCycle: "annual",
  currency: "KRW",
  amount: 20000,
  status: "published",
  version: 1,
  deliveryType: "service_access",
};

export const GOLDEN_EBOOK_PRODUCT: CommercePolicyProductDoc = {
  id: GOLDEN_EBOOK_PRODUCT_ID,
  businessUnit: "ebook",
  slug: "ai-first-ebook-for-50s",
  title: "50대 초보자가 AI로 첫 전자책을 만드는 방법",
  summary: "단품 구매 시 웹 열람 + PDF/EPUB 다운로드 entitlement.",
  productType: "digital_download",
  pricingType: "one_time",
  billingCycle: "none",
  currency: "KRW",
  amount: 3000,
  status: "published",
  version: 1,
  deliveryType: "unlock",
};

export const COMMERCE_POLICY_PRODUCTS: CommercePolicyProductDoc[] = [
  MEMBERSHIP_MONTHLY_PRODUCT,
  MEMBERSHIP_YEARLY_PRODUCT,
  GOLDEN_EBOOK_PRODUCT,
];

const BY_ID = Object.fromEntries(COMMERCE_POLICY_PRODUCTS.map((p) => [p.id, p]));

export function getCommercePolicyProduct(productId: string): CommercePolicyProductDoc | null {
  return BY_ID[productId] || null;
}

export function assertClientAmountAgainstPolicy(
  productId: string,
  clientAmount: unknown,
): { ok: true } | { ok: false; code: string; message: string } {
  const policy = getCommercePolicyProduct(productId);
  if (!policy) return { ok: true };
  if (typeof clientAmount === "number" && Number.isInteger(clientAmount) && clientAmount !== policy.amount) {
    return {
      ok: false,
      code: "amount/mismatch",
      message: "결제 금액이 일치하지 않습니다.",
    };
  }
  return { ok: true };
}

export function assertProductDocMatchesPolicy(product: {
  id: string;
  amount: number;
  pricingType: string;
  billingCycle: string;
  currency: string;
}): { ok: true } | { ok: false; code: string; message: string } {
  const policy = getCommercePolicyProduct(product.id);
  if (!policy) return { ok: true };
  if (product.amount !== policy.amount) {
    return { ok: false, code: "amount/mismatch", message: "상품 금액이 정책과 일치하지 않습니다." };
  }
  if (product.pricingType !== policy.pricingType) {
    return { ok: false, code: "pricingType/mismatch", message: "상품 유형이 정책과 일치하지 않습니다." };
  }
  if (product.billingCycle !== policy.billingCycle) {
    return { ok: false, code: "billingCycle/mismatch", message: "결제 주기가 정책과 일치하지 않습니다." };
  }
  if (product.currency !== policy.currency) {
    return { ok: false, code: "currency/mismatch", message: "통화가 정책과 일치하지 않습니다." };
  }
  return { ok: true };
}
