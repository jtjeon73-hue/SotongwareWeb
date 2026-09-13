"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthEmulatorBanner, AuthPageShell, FormAlert } from "@/components/auth/AuthFormParts";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthProvider";
import { fetchMyOrders, type CommerceOrderPublic } from "@/lib/commerce-checkout";

function statusLabel(status: string): string {
  switch (status) {
    case "paid":
      return "이용 가능";
    case "pending":
      return "결제 대기";
    case "cancelled":
      return "취소";
    case "refunded":
      return "환불";
    case "expired":
      return "만료";
    default:
      return status;
  }
}

function PurchasesInner() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<CommerceOrderPublic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const list = await fetchMyOrders(user.uid);
        if (!cancelled) setOrders(list);
      } catch {
        if (!cancelled) setError("구매내역을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
      <AuthEmulatorBanner />
      <h1 className="text-2xl font-semibold text-slate-900">구매내역</h1>
      <p className="mt-2 text-sm text-slate-600">본인 주문만 표시됩니다.</p>
      {loading ? (
        <p className="mt-4 text-sm text-slate-600" role="status" aria-live="polite">
          불러오는 중…
        </p>
      ) : null}
      {error ? <div className="mt-4"><FormAlert message={error} variant="error" /></div> : null}
      {!loading && !orders.length ? (
        <p className="mt-6 text-sm text-slate-600">아직 구매 내역이 없습니다.</p>
      ) : null}
      <ul className="mt-6 space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded-2xl border border-slate-100 px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{o.productTitle || o.productId}</p>
                <p className="mt-1 text-xs text-slate-500">{o.id}</p>
              </div>
              <p className="text-sm font-medium text-slate-800">{statusLabel(o.status)}</p>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>{o.amount.toLocaleString("ko-KR")}원</span>
              <Link
                href={`/account/purchases/detail?orderId=${encodeURIComponent(o.id)}`}
                className="text-sky-800 underline underline-offset-2"
              >
                상세
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/checkout" variant="primary">
          결제하기
        </Button>
        <Button href="/account" variant="secondary">
          계정
        </Button>
      </div>
    </div>
  );
}

export function PurchasesView() {
  return (
    <AuthPageShell>
      <AuthGuard>
        <PurchasesInner />
      </AuthGuard>
    </AuthPageShell>
  );
}
