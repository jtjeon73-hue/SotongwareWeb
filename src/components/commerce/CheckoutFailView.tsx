"use client";

import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthEmulatorBanner, AuthPageShell, FormAlert } from "@/components/auth/AuthFormParts";
import { Button } from "@/components/ui/Button";

/**
 * Fail URL: never trust code/message/orderId to mutate order status.
 * Customer-facing cancel/fail copy only.
 */
function FailInner() {
  const params = useSearchParams();
  const hasOrderHint = Boolean(params.get("orderId"));
  void params.get("code");
  void params.get("message");

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
      <AuthEmulatorBanner />
      <h1 className="text-2xl font-semibold text-slate-900">결제가 완료되지 않았습니다</h1>
      <div className="mt-4">
        <FormAlert
          message={
            hasOrderHint
              ? "결제가 취소되었거나 인증에 실패했습니다. 주문은 결제 완료로 바뀌지 않습니다. 다시 시도하면 새 결제가 시작됩니다."
              : "결제가 취소되었거나 인증에 실패했습니다. 다시 시도해 주세요."
          }
          variant="info"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/checkout" variant="primary">
          다시 시도
        </Button>
        <Button href="/account/purchases" variant="secondary">
          구매내역
        </Button>
      </div>
    </div>
  );
}

export function CheckoutFailView() {
  return (
    <AuthPageShell>
      <AuthGuard>
        <FailInner />
      </AuthGuard>
    </AuthPageShell>
  );
}
