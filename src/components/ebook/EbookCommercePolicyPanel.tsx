import type { Locale } from "@/i18n/config";
import { ebookCommerceUiCopy, GOLDEN_EBOOK_PRODUCT } from "@/lib/commerce-policy";

/**
 * Detail/reader commerce policy copy for preparing SKUs.
 * Never implies live checkout completion.
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
      <ul className="mt-3 list-disc space-y-1.5 pl-5">
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "Guest:" : "비회원:"}
          </span>{" "}
          {locale === "en" ? "Free preview" : "미리보기"} — {copy.guest}
        </li>
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "Member:" : "회원:"}
          </span>{" "}
          {locale === "en" ? "Full web reader" : "회원 전체보기"} — {copy.memberReader}.{" "}
          {copy.memberDownload}
        </li>
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "Non-member:" : "비회원 단품:"}
          </span>{" "}
          {copy.nonMemberPurchase}
        </li>
        <li>
          <span className="font-medium text-surface-800">
            {locale === "en" ? "Owned:" : "구매 보유:"}
          </span>{" "}
          {locale === "en" ? "Full reader" : "전체보기"} · {locale === "en" ? "Download" : "다운로드"} —{" "}
          {copy.ownedReader}. {copy.ownedDownload}
        </li>
      </ul>
      {variant === "detail" ? (
        <p className="mt-3 text-xs text-surface-500">
          {locale === "en"
            ? `Catalog price SSOT: ₩${price} one-time. Membership monthly ₩2,000 / yearly ₩20,000.`
            : `가격 SSOT: 단품 ${price}원 · 멤버십 월 2,000원 / 연 20,000원.`}
        </p>
      ) : null}
    </section>
  );
}
