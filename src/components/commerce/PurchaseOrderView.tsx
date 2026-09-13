"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthEmulatorBanner, AuthPageShell, FormAlert } from "@/components/auth/AuthFormParts";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthProvider";
import { fetchMyOrder, type CommerceOrderPublic } from "@/lib/commerce-checkout";
import { hasEntitlementForOrder } from "@/lib/commerce-access";

function OrderDetailInner() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";
  const { user } = useAuth();
  const [order, setOrder] = useState<CommerceOrderPublic | null>(null);
  const [entitled, setEntitled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.uid || !orderId) return;
      try {
        const o = await fetchMyOrder(user.uid, orderId);
        if (cancelled) return;
        setOrder(o);
        if (o?.status === "paid") {
          setEntitled(await hasEntitlementForOrder(user.uid, orderId));
        }
      } catch {
        if (!cancelled) setError("주문을 불러오지 못했습니다.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, orderId]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
      <AuthEmulatorBanner />
      <h1 className="text-2xl font-semibold text-slate-900">주문 상세</h1>
      {error ? (
        <div className="mt-4">
          <FormAlert message={error} variant="error" />
        </div>
      ) : null}
      {!order && !error ? (
        <p className="mt-4 text-sm text-slate-600">주문을 찾을 수 없거나 접근 권한이 없습니다.</p>
      ) : null}
      {order ? (
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
            <dt className="text-slate-500">상품</dt>
            <dd className="min-w-0 text-right font-medium text-slate-900">{order.productTitle}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
            <dt className="text-slate-500">금액</dt>
            <dd className="font-medium text-slate-900">{order.amount.toLocaleString("ko-KR")}원</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
            <dt className="text-slate-500">상태</dt>
            <dd className="font-medium text-slate-900">{order.status}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">이용권</dt>
            <dd className="font-medium text-slate-900">
              {order.status === "refunded"
                ? "회수됨"
                : entitled
                  ? "활성"
                  : order.status === "paid"
                    ? "확인 중"
                    : "없음"}
            </dd>
          </div>
        </dl>
      ) : null}
      <div className="mt-6">
        <Button href="/account/purchases" variant="secondary">
          목록으로
        </Button>
      </div>
    </div>
  );
}

export function PurchaseOrderView() {
  return (
    <AuthPageShell>
      <AuthGuard>
        <OrderDetailInner />
      </AuthGuard>
    </AuthPageShell>
  );
}
