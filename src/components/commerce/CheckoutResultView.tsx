"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthEmulatorBanner, AuthPageShell, FormAlert } from "@/components/auth/AuthFormParts";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthProvider";
import {
  confirmPayment,
  fetchMyOrder,
  type CommerceOrderPublic,
} from "@/lib/commerce-checkout";
import { hasEntitlementForOrder } from "@/lib/commerce-access";

/**
 * Success UI must not trust paymentKey/amount query alone.
 * Only server confirm + Firestore paid (+ entitlement) drives completion.
 */
function ResultInner() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";
  const paymentKey = params.get("paymentKey") || "";
  const amountRaw = params.get("amount");
  const { user } = useAuth();
  const [order, setOrder] = useState<CommerceOrderPublic | null>(null);
  const [entitled, setEntitled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmStarted = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.uid || !orderId) {
        setLoading(false);
        setError("주문 정보를 확인할 수 없습니다.");
        return;
      }
      try {
        if (paymentKey && amountRaw && !confirmStarted.current) {
          confirmStarted.current = true;
          setConfirming(true);
          const amount = Number(amountRaw);
          if (!Number.isInteger(amount)) {
            if (!cancelled) {
              setError("결제 정보를 확인할 수 없습니다.");
              setLoading(false);
              setConfirming(false);
            }
            return;
          }
          try {
            await confirmPayment({ orderId, paymentKey, amount });
          } catch {
            if (!cancelled) {
              setError("결제 승인 확인에 실패했습니다. 잠시 후 다시 조회해 주세요.");
            }
          } finally {
            if (!cancelled) setConfirming(false);
          }
        }

        const o = await fetchMyOrder(user.uid, orderId);
        if (cancelled) return;
        setOrder(o);
        if (o?.status === "paid") {
          setEntitled(await hasEntitlementForOrder(user.uid, orderId));
        }
      } catch {
        if (!cancelled) setError("주문 상태를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid, orderId, paymentKey, amountRaw]);

  const paid = order?.status === "paid" && entitled;
  const refunded = order?.status === "refunded";
  const pending = order?.status === "pending" || confirming;

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
      <AuthEmulatorBanner />
      <h1 className="text-2xl font-semibold text-slate-900">결제 결과</h1>
      {loading || confirming ? (
        <p className="mt-4 text-sm text-slate-600" role="status" aria-live="polite">
          {confirming ? "서버에서 결제를 승인하는 중…" : "서버에서 주문 상태를 확인하는 중…"}
        </p>
      ) : null}
      {error ? <div className="mt-4"><FormAlert message={error} variant="error" /></div> : null}
      {!loading && !confirming && !order && !error ? (
        <FormAlert
          message="주문을 찾을 수 없거나 본인 주문이 아닙니다. URL만으로 결제 완료로 표시하지 않습니다."
          variant="info"
        />
      ) : null}
      {!loading && !confirming && paid ? (
        <div className="mt-4 space-y-2">
          <FormAlert message="결제가 확인되었고 이용권이 지급되었습니다." variant="success" />
          <p className="text-sm text-slate-600">{order?.productTitle}</p>
          <p className="text-sm font-medium text-slate-900">
            {order?.amount.toLocaleString("ko-KR")}원 · 주문 {order?.id}
          </p>
        </div>
      ) : null}
      {!loading && !confirming && pending && !paid ? (
        <div className="mt-4">
          <FormAlert
            message="결제가 아직 확정되지 않았습니다. 잠시 후 구매내역에서 다시 확인해 주세요."
            variant="info"
          />
        </div>
      ) : null}
      {!loading && !confirming && refunded ? (
        <div className="mt-4">
          <FormAlert message="이 주문은 환불되어 이용권이 회수된 상태입니다." variant="info" />
        </div>
      ) : null}
      {!loading && !confirming && order && !paid && !pending && !refunded ? (
        <div className="mt-4">
          <FormAlert message={`주문 상태: ${order.status}`} variant="info" />
        </div>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/account/purchases" variant="primary">
          구매내역
        </Button>
        <Button href={`/checkout/result?orderId=${encodeURIComponent(orderId)}`} variant="secondary">
          다시 조회
        </Button>
        <Button href="/checkout" variant="secondary">
          다시 시도
        </Button>
      </div>
    </div>
  );
}

export function CheckoutResultView() {
  return (
    <AuthPageShell>
      <AuthGuard>
        <ResultInner />
      </AuthGuard>
    </AuthPageShell>
  );
}
