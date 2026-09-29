/**
 * TypeScript surface for commerce product/price SSOT.
 * Runtime values live in catalog.mjs (shared with Node tests).
 */
export {
  COMMERCE_CURRENCY,
  MEMBERSHIP_MONTHLY_PRODUCT_ID,
  MEMBERSHIP_YEARLY_PRODUCT_ID,
  GOLDEN_EBOOK_PRODUCT_ID,
  MEMBERSHIP_PRODUCT_IDS,
  MEMBERSHIP_MONTHLY_PRODUCT,
  MEMBERSHIP_YEARLY_PRODUCT,
  GOLDEN_EBOOK_PRODUCT,
  COMMERCE_POLICY_PRODUCTS,
  COMMERCE_POLICY_BY_ID,
  getCommercePolicyProduct,
  isMembershipProductId,
  isGoldenEbookProductId,
  assertMatchesCommercePolicy,
  ebookCommerceUiCopy,
} from "./catalog.mjs";
