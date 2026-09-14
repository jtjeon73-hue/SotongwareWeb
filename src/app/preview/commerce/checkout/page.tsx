"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  PREVIEW_BASE,
  getPreviewProduct,
  previewPlans,
} from "@/data/preview-commerce";
import { PreviewCta, PreviewShell } from "@/components/preview/commerce/PreviewChrome";
import { PreviewPaymentBlockedButton } from "@/components/preview/commerce/PreviewPaymentBlockedButton";
import { IconJourneyPay } from "@/components/preview/commerce/PreviewIcons";

function CheckoutInner() {
  const params = useSearchParams();
  const sku = params.get("sku") ?? "factory-start-ebook";
  const mode = params.get("mode") ?? "one_time";

  const product = getPreviewProduct(sku);
  const plan = previewPlans.find((p) => p.id === sku);

  const title = product?.title ?? plan?.name ?? "선택한 상품";
  const amount =
    plan?.priceLabel ??
    (product?.priceWon != null
      ? `${product.priceWon.toLocaleString("ko-KR")}원`
      : product?.priceLabel ?? "상담");

  const isInquiry = mode === "inquiry" || product?.priceWon === null;

  return (
    <PreviewShell
      title={isInquiry ? "문의 확인" : "결제 확인"}
      subtitle="미리보기 화면입니다. 실제 결제는 청구되지 않습니다."
      backHref={product ? `${PREVIEW_BASE}/product/${product.slug}` : `${PREVIEW_BASE}/pricing`}
    >
      <div className="mx-auto max-w-lg rounded-3xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
          <IconJourneyPay size="md" decorative={false} title="요금·결제" />
        </div>
        <p className="text-sm text-surface-500">주문 요약</p>
        <h2 className="mt-2 text-2xl font-semibold text-surface-900">{title}</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-surface-100 pb-3">
            <dt className="text-surface-500">유형</dt>
            <dd className="font-medium text-surface-800">
              {mode === "subscription"
                ? "정기이용"
                : isInquiry
                  ? "견적 문의"
                  : "단건구매"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-surface-100 pb-3">
            <dt className="text-surface-500">금액</dt>
            <dd className="font-medium text-surface-800">{amount}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-surface-500">결제 수단</dt>
            <dd className="font-medium text-surface-800">토스페이먼츠 · 준비중</dd>
          </div>
        </dl>

        <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
          정식 오픈 전까지 실제 결제는 실행되지 않습니다.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {isInquiry ? (
            <PreviewCta
              href={`${PREVIEW_BASE}/payment-result?status=success&kind=inquiry&sku=${sku}`}
            >
              문의 접수 화면 예시
            </PreviewCta>
          ) : (
            <PreviewPaymentBlockedButton />
          )}
          {!isInquiry ? (
            <>
              <PreviewCta
                href={`${PREVIEW_BASE}/payment-result?status=success&kind=${mode}&sku=${sku}`}
                variant="secondary"
              >
                결제 완료 화면 예시
              </PreviewCta>
              <PreviewCta
                href={`${PREVIEW_BASE}/payment-result?status=fail&sku=${sku}`}
                variant="quiet"
              >
                결제 실패 화면 예시
              </PreviewCta>
            </>
          ) : null}
        </div>
      </div>
    </PreviewShell>
  );
}

export default function PreviewCheckoutPage() {
  return (
    <Suspense
      fallback={
        <PreviewShell title="결제 확인" subtitle="불러오는 중…">
          <div className="mx-auto max-w-lg animate-pulse rounded-3xl bg-surface-100 p-20" />
        </PreviewShell>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
