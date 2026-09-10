"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PREVIEW_BASE } from "@/data/preview-commerce";
import { PreviewCta, PreviewShell } from "@/components/preview/commerce/PreviewChrome";
import {
  IconStatusAllowed,
  IconStatusBlocked,
  IconStatusCancelled,
} from "@/components/preview/commerce/PreviewIcons";

function ResultInner() {
  const params = useSearchParams();
  const status = params.get("status") ?? "success";
  const kind = params.get("kind") ?? "one_time";
  const sku = params.get("sku") ?? "";

  const map = {
    success: {
      title: kind === "inquiry" ? "문의가 접수되었습니다" : "결제가 완료되었습니다",
      body:
        kind === "inquiry"
          ? "시제품 예시입니다. 실제 문의·견적은 전송되지 않았습니다."
          : "시제품 예시입니다. 실제 결제·이용권한 부여는 없습니다. 내 자료실에서 다음 화면을 확인하세요.",
      tone: "border-farm-500/40 bg-farm-50 text-farm-900",
      Icon: IconStatusAllowed,
    },
    fail: {
      title: "결제를 완료하지 못했습니다",
      body: "카드 한도·네트워크 등 실패 상황을 보여주는 시제품 화면입니다. 다시 시도하거나 다른 수단을 안내할 수 있습니다.",
      tone: "border-rose-300 bg-rose-50 text-rose-950",
      Icon: IconStatusBlocked,
    },
    cancel: {
      title: "결제를 취소했습니다",
      body: "고객이 창을 닫거나 취소를 눌렀을 때의 안내 예시입니다. 주문은 확정되지 않습니다.",
      tone: "border-surface-300 bg-surface-100 text-surface-800",
      Icon: IconStatusCancelled,
    },
  } as const;

  const view = map[status as keyof typeof map] ?? map.success;
  const StatusIcon = view.Icon;

  return (
    <PreviewShell
      title="결제 결과"
      subtitle="성공 · 실패 · 취소 예시"
      backHref={`${PREVIEW_BASE}/checkout?sku=${sku}`}
    >
      <div className={`mx-auto max-w-lg rounded-3xl border p-8 ${view.tone}`}>
        <StatusIcon size="lg" decorative={false} title={view.title} className="mb-4" />
        <h2 className="text-2xl font-semibold">{view.title}</h2>
        <p className="mt-3 text-sm leading-relaxed opacity-90">{view.body}</p>
        <div className="mt-8 flex flex-col gap-3">
          {status === "success" ? (
            <PreviewCta
              href={`${PREVIEW_BASE}/library?member=${kind === "subscription" ? "basic_active" : "free"}`}
            >
              내 자료실로 이동
            </PreviewCta>
          ) : (
            <PreviewCta href={`${PREVIEW_BASE}/checkout?sku=${sku}`}>
              결제 화면으로 돌아가기
            </PreviewCta>
          )}
          <PreviewCta href={PREVIEW_BASE} variant="secondary">
            허브로
          </PreviewCta>
        </div>
      </div>
    </PreviewShell>
  );
}

export default function PreviewPaymentResultPage() {
  return (
    <Suspense
      fallback={
        <PreviewShell title="결제 결과" subtitle="불러오는 중…">
          <div className="mx-auto max-w-lg animate-pulse rounded-3xl bg-surface-100 p-20" />
        </PreviewShell>
      }
    >
      <ResultInner />
    </Suspense>
  );
}
