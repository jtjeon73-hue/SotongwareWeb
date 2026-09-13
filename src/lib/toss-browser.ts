/**
 * Official Toss Payments JS SDK v2 — 결제창형 (widgets + renderPaymentWindow + requestPayment).
 * @see https://docs.tosspayments.com/guides/v2/payment-widget/integration-window
 * Package: @tosspayments/tosspayments-sdk@2.8.1
 */
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { isLiveClientKey } from "@/lib/commerce-mode";

export type TossWindowPaymentInput = {
  clientKey: string;
  customerKey: string;
  amount: number;
  currency: "KRW";
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
};

export type TossWindowErrorCode = "USER_CANCEL" | "SDK_ERROR" | "LIVE_KEY" | "INVALID";

export class TossWindowError extends Error {
  readonly code: TossWindowErrorCode;
  constructor(code: TossWindowErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "TossWindowError";
  }
}

function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function assertSafeCustomerKey(customerKey: string, uid?: string | null): void {
  if (typeof customerKey !== "string" || customerKey.length < 2 || customerKey.length > 50) {
    throw new TossWindowError("INVALID", "결제 식별자가 올바르지 않습니다.");
  }
  if (looksLikeEmail(customerKey)) {
    throw new TossWindowError("INVALID", "결제 식별자가 올바르지 않습니다.");
  }
  if (uid && (customerKey === uid || customerKey.includes(uid))) {
    throw new TossWindowError("INVALID", "결제 식별자가 올바르지 않습니다.");
  }
}

/**
 * Build requestPayment payload from prepare response only (ignore any client amount override).
 */
export function buildRequestPaymentParams(
  prep: {
    orderId: string;
    orderName: string;
    amount: number;
    currency: "KRW";
  },
  urls: { successUrl: string; failUrl: string },
  clientAmountOverride?: number,
): { orderId: string; orderName: string; successUrl: string; failUrl: string; amount: number } {
  void clientAmountOverride; // never used — server amount wins
  return {
    orderId: prep.orderId,
    orderName: prep.orderName,
    successUrl: urls.successUrl,
    failUrl: urls.failUrl,
    amount: prep.amount,
  };
}

/**
 * Opens Toss 결제창형 window. Redirects to successUrl/failUrl on completion.
 */
export async function openTossSandboxPaymentWindow(
  input: TossWindowPaymentInput,
): Promise<void> {
  if (isLiveClientKey(input.clientKey)) {
    throw new TossWindowError("LIVE_KEY", "운영 결제는 아직 열리지 않았습니다.");
  }
  if (!/^test_/i.test(input.clientKey)) {
    throw new TossWindowError("INVALID", "결제 서비스 준비 중입니다.");
  }
  assertSafeCustomerKey(input.customerKey);
  if (!Number.isInteger(input.amount) || input.amount <= 0) {
    throw new TossWindowError("INVALID", "결제 금액이 올바르지 않습니다.");
  }

  let tossPayments;
  try {
    tossPayments = await loadTossPayments(input.clientKey);
  } catch {
    throw new TossWindowError("SDK_ERROR", "결제창을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  const widgets = tossPayments.widgets({ customerKey: input.customerKey });
  await widgets.setAmount({ currency: input.currency, value: input.amount });

  const paymentWindow = await widgets.renderPaymentWindow();

  await new Promise<void>((resolve, reject) => {
    paymentWindow.on("cancel", async () => {
      reject(new TossWindowError("USER_CANCEL", "결제가 취소되었습니다."));
    });
    paymentWindow.on("paymentRequest", async () => {
      try {
        const params = buildRequestPaymentParams(
          {
            orderId: input.orderId,
            orderName: input.orderName,
            amount: input.amount,
            currency: input.currency,
          },
          { successUrl: input.successUrl, failUrl: input.failUrl },
        );
        await widgets.requestPayment({
          orderId: params.orderId,
          orderName: params.orderName,
          successUrl: params.successUrl,
          failUrl: params.failUrl,
        });
        resolve();
      } catch (err) {
        const msg = err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code || "")
          : "";
        if (/USER_CANCEL|CANCEL/i.test(msg)) {
          reject(new TossWindowError("USER_CANCEL", "결제가 취소되었습니다."));
          return;
        }
        reject(new TossWindowError("SDK_ERROR", "결제 요청을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요."));
      }
    });
  });
}
