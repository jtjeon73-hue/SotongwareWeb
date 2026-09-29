import type { Locale } from "@/i18n/config";
import { ebookCommerceUiCopy, GOLDEN_EBOOK_PRODUCT } from "@/lib/commerce-policy";

/**
 * Detail/reader commerce policy copy for preparing SKUs.
 * Never implies live checkout, auto-renew, or live download completion.
 */
export function EbookCommercePolicyPanel({
  locale,
  variant = "detail",
}: {
  locale: Locale;
  variant?: "detail" | "reader";
}) {
  const copy = ebookCommerceUiCopy(locale);
  const price = GOLDEN_EBOOK_PRODUCT.amount.toLocaleString(locale === "en" ? "en-US" : "ko-KR");

  return (
    <section
      className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 text-sm text-surface-700"
      aria-labelledby="ebook-commerce-policy-heading"
    >
      <h2 id="ebook-commerce-policy-heading" className="text-sm font-bold text-surface-900">
        {locale === "en" ? "Access policy (preparing)" : "이용 정책 (준비 중)"}
      </h2>
      <p className="mt-2 font-medium text-amber-900">{copy.preparingNotice}</p>
      <p className="mt-1 text-xs text-surface-600">{copy.noAutoRenew}</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5">
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "Guest:" : "비회원:"}
          </span>{" "}
          {locale === "en" ? "Preview" : "미리보기"} — {copy.guest}
        </li>
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "Member:" : "회원:"}
          </span>{" "}
          {copy.memberReader}. {copy.memberDownload}
        </li>
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "One-time:" : "단품 구매:"}
          </span>{" "}
          {copy.nonMemberPurchase}
        </li>
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "Owned:" : "구매 보유:"}
          </span>{" "}
          {copy.ownedReader}. {copy.ownedDownload}
        </li>
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "Admin:" : "관리자:"}
          </span>{" "}
          {copy.adminOps}
        </li>
      </ul>
      {variant === "detail" ? (
        <p className="mt-3 text-xs text-surface-500">
          {locale === "en"
            ? `Catalog price SSOT: ₩${price} one-time. Membership monthly ₩2,000 / yearly ₩20,000 (prepaid term).`
            : `가격 SSOT: 단품 ${price}원 · 멤버십 월 2,000원 / 연 20,000원 (기간제 · 자동갱신 아님).`}
        </p>
      ) : null}
    </section>
  );
}
