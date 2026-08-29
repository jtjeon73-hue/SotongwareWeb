/**
 * 결제 provider abstraction — Live PG 연동 전 구조만 정의.
 * API Secret은 frontend에 넣지 않는다.
 */

export type PaymentProviderId = "toss" | "inicis" | "stripe" | "manual";

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";

export interface PaymentIntent {
  orderId: string;
  productId: string;
  amount: number;
  currency: string;
  accessMode: "paid" | "subscription";
}

export interface Order {
  id: string;
  userId?: string;
  productId: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  provider?: PaymentProviderId;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  status: "active" | "cancelled" | "past_due";
  currentPeriodEnd?: string;
}

/** server-side 구현 시 사용할 provider 인터페이스 */
export interface PaymentProvider {
  id: PaymentProviderId;
  createCheckoutSession(intent: PaymentIntent): Promise<{ url: string }>;
  handleWebhook(payload: unknown): Promise<OrderStatus>;
}

/** Paywall 검사 — server-side auth 연동 시 구현 */
export interface AccessGrant {
  productId: string;
  accessMode: "free" | "member" | "paid" | "subscription";
  granted: boolean;
  reason?: string;
}
