"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthEmulatorBanner, AuthPageShell, FormAlert, SubmitButton } from "@/components/auth/AuthFormParts";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthProvider";
import {
  MOCK_CHECKOUT_PRODUCT,
  confirmPayment,
  createIdempotencyKey,
  fetchPublishedProduct,
  getTossClientKey,
  isAuthReadyForCheckout,
  isCommerceCheckoutAvailable,
  prepareCheckout,
} from "@/lib/commerce-checkout";
import {
  buildCheckoutRedirectUrls,
  isCommerceTestSurfaceBlocked,
  resolveClientPgMode,
} from "@/lib/commerce-mode";
import { TossWindowError, openTossSandboxPaymentWindow } from "@/lib/toss-browser";
import { getFirebaseFunctions } from "@/lib/firebase";

function customerError(err: unknown): string {
  if (err instanceof TossWindowError) {
    if (err.code === "USER_CANCEL") return "결제가 취소되었습니다.";
    if (err.code === "LIVE_KEY") return "운영 결제는 아직 열리지 않았습니다.";
    return err.message;
  }
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
    const msg = (err as { message: string }).message;
    if (/firebase|emulator|secret|TOSS_|permission-denied|functions\//i.test(msg)) {
      return "결제 요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요.";
    }
    return msg;
  }
  return "결제 요청을 처리할 수 없습니다.";
}

function CheckoutInner() {
  const params = useSearchParams();
  const productId = params.get("product") || MOCK_CHECKOUT_PRODUCT.id;
  const { user, profile } = useAuth();
  const [title, setTitle] = useState(MOCK_CHECKOUT_PRODUCT.title);
  const [summary, setSummary] = useState(MOCK_CHECKOUT_PRODUCT.summary);
  const [amount, setAmount] = useState(MOCK_CHECKOUT_PRODUCT.amount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "preparing" | "paying" | "confirming">("idle");
  const inFlight = useRef(false);
  const authReady = isAuthReadyForCheckout();
  const checkoutReady = isCommerceCheckoutAvailable();
  const clientMode = resolveClientPgMode();
  const surfaceBlocked = isCommerceTestSurfaceBlocked();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await fetchPublishedProduct(productId);
        if (cancelled) return;
        if (p) {
          setTitle(p.title);
          setSummary(p.summary);
          setAmount(p.amount);
        }
      } catch {
        /* fixture fallback below */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (inFlight.current || loading) return;
    if (surfaceBlocked || !clientMode) {
      setError("지금은 결제를 시작할 수 없습니다.");
      return;
    }
    if (!authReady) {
      setError("로그인 서비스 준비 중입니다. 잠시 후 다시 이용해 주세요.");
      return;
    }
    if (!checkoutReady && clientMode !== "mock") {
      setError("결제 서비스 준비 중입니다.");
      return;
    }
    if (profile?.status && profile.status !== "active") {
      setError("회원 상태를 확인해 주세요.");
      return;
    }
    const functions = getFirebaseFunctions();
    if (!functions) {
      setError("결제 서비스 준비 중입니다.");
      return;
    }
    inFlight.current = true;
    setLoading(true);
    setStatus("preparing");
    try {
      const prep = await prepareCheckout({
        productId,
        idempotencyKey: createIdempotencyKey(),
      });
      const useMock = prep.mockCheckout === true || prep.pgMode === "mock" || clientMode === "mock";
      setStatus("paying");

      if (useMock) {
        if (surfaceBlocked) {
          setError("지금은 결제를 시작할 수 없습니다.");
          setStatus("idle");
          return;
        }
        const paymentKey = `mock_pk_${prep.orderId}`;
        setStatus("confirming");
        const confirmed = await confirmPayment({
          orderId: prep.orderId,
          paymentKey,
          amount: prep.amount,
        });
        const q = new URLSearchParams({ orderId: prep.orderId });
        if (confirmed.status !== "paid") q.set("state", "pending");
        window.location.assign(`/checkout/result?${q.toString()}`);
        return;
      }

      const clientKey = getTossClientKey();
      if (!clientKey || !prep.customerKey) {
        setError("결제 서비스 준비 중입니다.");
        setStatus("idle");
        return;
      }
      const urls = buildCheckoutRedirectUrls(prep.orderId);
      await openTossSandboxPaymentWindow({
        clientKey,
        customerKey: prep.customerKey,
        amount: prep.amount,
        currency: prep.currency,
        orderId: prep.orderId,
        orderName: prep.orderName,
        successUrl: urls.successUrl,
        failUrl: urls.failUrl,
      });
    } catch (err) {
      setError(customerError(err));
      setStatus("idle");
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }

  if (!authReady) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">결제 준비 중</h1>
        <p className="mt-3 text-sm text-slate-600">
          로그인 서비스가 아직 열려 있지 않습니다. 계정 페이지에서 상태를 확인해 주세요.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/account" variant="primary">
            내 계정
          </Button>
          <Button href="/login" variant="secondary">
            로그인
          </Button>
        </div>
      </div>
    );
  }

  if (surfaceBlocked || (!checkoutReady && clientMode !== "mock") || !clientMode) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">결제 서비스 준비 중</h1>
        <p className="mt-3 text-sm text-slate-600" role="status" aria-live="polite">
          지금은 결제를 시작할 수 없습니다. 준비되는 대로 안내하겠습니다.
        </p>
      </div>
    );
  }

  const methodLabel = clientMode === "mock" ? "테스트(Mock)" : "토스페이먼츠 샌드박스";

  return (
    <div className="mx-auto w-full min-w-0 max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
      <AuthEmulatorBanner />
      <p className="text-sm text-slate-500">단건 결제 (KRW)</p>
      <h1 className="mt-2 break-keep text-balance text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{summary}</p>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
          <dt className="text-slate-500">금액</dt>
          <dd className="font-medium text-slate-900">{amount.toLocaleString("ko-KR")}원</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-3">
          <dt className="text-slate-500">방식</dt>
          <dd className="font-medium text-slate-900">{methodLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">구매자</dt>
          <dd className="min-w-0 truncate font-medium text-slate-900">
            {user?.email || profile?.displayName || "회원"}
          </dd>
        </div>
      </dl>
      {error ? <div className="mt-4"><FormAlert message={error} variant="error" /></div> : null}
      <p className="mt-4 text-xs text-slate-500" role="status" aria-live="polite">
        {status === "preparing" && "주문을 준비하는 중…"}
        {status === "paying" && "결제창을 여는 중…"}
        {status === "confirming" && "결제 승인 확인 중…"}
        {status === "idle" && "서버 승인 후에만 이용권이 지급됩니다."}
      </p>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        <SubmitButton loading={loading} disabled={loading || inFlight.current} loadingLabel="처리 중…">
          결제하기
        </SubmitButton>
        <Button href="/account/purchases" variant="secondary" className="w-full">
          구매내역
        </Button>
      </form>
      <p className="mt-4 text-xs text-slate-500">
        구독·빌링키·자동결제는 이번 범위에 포함되지 않습니다.
      </p>
    </div>
  );
}

export function CheckoutView() {
  return (
    <AuthPageShell>
      <AuthGuard>
        <CheckoutInner />
      </AuthGuard>
    </AuthPageShell>
  );
}
