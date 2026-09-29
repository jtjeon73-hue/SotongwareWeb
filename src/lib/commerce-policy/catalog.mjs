/**
 * Authoritative commerce product / price SSOT (PG-neutral).
 * UI and Functions must not hard-code membership/ebook prices elsewhere.
 * Not a live checkout enablement — status/preparing gates remain elsewhere.
 */

export const COMMERCE_CURRENCY = "KRW";

/** Membership — Basic monthly */
export const MEMBERSHIP_MONTHLY_PRODUCT_ID = "membership_basic_monthly";
/** Membership — Basic yearly (billingCycle: annual) */
export const MEMBERSHIP_YEARLY_PRODUCT_ID = "membership_basic_yearly";
/** Golden ebook one-time SKU */
export const GOLDEN_EBOOK_PRODUCT_ID = "ai-first-ebook-for-50s";

export const MEMBERSHIP_PRODUCT_IDS = Object.freeze([
  MEMBERSHIP_MONTHLY_PRODUCT_ID,
  MEMBERSHIP_YEARLY_PRODUCT_ID,
]);

/**
 * @typedef {object} CommercePolicyProduct
 * @property {string} id
 * @property {string} businessUnit
 * @property {string} slug
 * @property {string} title
 * @property {string} summary
 * @property {string} productType
 * @property {"free"|"one_time"|"subscription"} pricingType
 * @property {"none"|"monthly"|"annual"} billingCycle
 * @property {"KRW"} currency
 * @property {number} amount
 * @property {"draft"|"review"|"published"|"suspended"|"archived"} status
 * @property {number} version
 * @property {string} deliveryType
 * @property {{ reader: string, download: boolean|string }} entitlement
 */

/** @type {Readonly<CommercePolicyProduct>} */
export const MEMBERSHIP_MONTHLY_PRODUCT = Object.freeze({
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
  entitlement: Object.freeze({ reader: "subscription", download: false }),
});

/** @type {Readonly<CommercePolicyProduct>} */
export const MEMBERSHIP_YEARLY_PRODUCT = Object.freeze({
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
  entitlement: Object.freeze({ reader: "subscription", download: false }),
});

/** @type {Readonly<CommercePolicyProduct>} */
export const GOLDEN_EBOOK_PRODUCT = Object.freeze({
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
  entitlement: Object.freeze({ reader: "owned", download: "owned" }),
});

/** @type {ReadonlyArray<CommercePolicyProduct>} */
export const COMMERCE_POLICY_PRODUCTS = Object.freeze([
  MEMBERSHIP_MONTHLY_PRODUCT,
  MEMBERSHIP_YEARLY_PRODUCT,
  GOLDEN_EBOOK_PRODUCT,
]);

/** @type {Readonly<Record<string, CommercePolicyProduct>>} */
export const COMMERCE_POLICY_BY_ID = Object.freeze(
  Object.fromEntries(COMMERCE_POLICY_PRODUCTS.map((p) => [p.id, p])),
);

export function getCommercePolicyProduct(productId) {
  if (typeof productId !== "string" || !productId) return null;
  return COMMERCE_POLICY_BY_ID[productId] || null;
}

export function isMembershipProductId(productId) {
  return MEMBERSHIP_PRODUCT_IDS.includes(productId);
}

export function isGoldenEbookProductId(productId) {
  return productId === GOLDEN_EBOOK_PRODUCT_ID;
}

/**
 * Reject client price/product tampering against SSOT when product is known.
 * @returns {{ ok: true } | { ok: false, code: string, message: string }}
 */
export function assertMatchesCommercePolicy(input) {
  const policy = getCommercePolicyProduct(input?.productId);
  if (!policy) {
    return { ok: true };
  }
  if (typeof input.amount === "number" && Number.isInteger(input.amount) && input.amount !== policy.amount) {
    return {
      ok: false,
      code: "amount/mismatch",
      message: "Requested amount does not match authoritative product policy",
    };
  }
  if (input.pricingType && input.pricingType !== policy.pricingType) {
    return {
      ok: false,
      code: "pricingType/mismatch",
      message: "Requested pricingType does not match authoritative product policy",
    };
  }
  if (input.billingCycle && input.billingCycle !== policy.billingCycle) {
    return {
      ok: false,
      code: "billingCycle/mismatch",
      message: "Requested billingCycle does not match authoritative product policy",
    };
  }
  if (input.expectedProductId && input.expectedProductId !== policy.id) {
    return {
      ok: false,
      code: "productId/mismatch",
      message: "Requested productId does not match authoritative product policy",
    };
  }
  return { ok: true };
}

/** Public UI copy helpers (not authoritative for access). */
export function ebookCommerceUiCopy(locale = "ko") {
  const price = GOLDEN_EBOOK_PRODUCT.amount.toLocaleString("ko-KR");
  if (locale === "en") {
    return {
      guest: "Free preview only · membership/purchase preparing (not live checkout)",
      memberGuide: "Members: prepaid term web reader (no auto-renew) while active",
      memberReader: "Full web reader during active prepaid term (no auto-renew)",
      memberDownload: `PDF/EPUB download requires one-time purchase (₩${price})`,
      nonMemberPurchase: `One-time purchase ₩${price} (preparing — not live checkout)`,
      ownedReader: "Full web reader (owned)",
      ownedDownload: "PDF download · EPUB download (authenticated delivery when enabled)",
      adminOps: "Admin: operational reader/download verification",
      preparingNotice: "Commerce is preparing — this screen does not complete a real payment or download.",
      noAutoRenew: "Membership is a prepaid term — not auto-renewing billing.",
    };
  }
  return {
    guest: "미리보기만 · 회원·구매는 준비 중 (실결제 아님)",
    memberGuide: "회원: 기간제 이용권(자동갱신 아님) 활성 기간 웹 열람",
    memberReader: "기간제 활성 동안 전체 웹 열람 (자동갱신 아님)",
    memberDownload: `PDF/EPUB 다운로드는 단품 구매 ${price}원 별도`,
    nonMemberPurchase: `단품 구매 ${price}원 (준비 중 — 실결제 아님)`,
    ownedReader: "전체보기 (구매 보유)",
    ownedDownload: "PDF 다운로드 · EPUB 다운로드 (인증 전달 연동 준비)",
    adminOps: "관리자: 운영 검증용 열람/다운로드",
    preparingNotice: "커머스 준비 중 — 이 화면에서 실제 결제·다운로드가 완료되지 않습니다.",
    noAutoRenew: "멤버십은 기간제 이용권이며 자동갱신 결제가 아닙니다.",
  };
}
