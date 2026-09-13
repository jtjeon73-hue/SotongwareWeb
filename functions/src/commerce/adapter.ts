import { createHash, randomBytes } from "node:crypto";
import { CommerceError, assertNoLiveSecretInTest, assertNoTestSecretInLive } from "./errors";
import type { TossPaymentView } from "./types";

export type PgMode = "mock" | "test" | "live";

export function resolvePgMode(env: NodeJS.ProcessEnv = process.env): PgMode {
  const explicit = (env.COMMERCE_PG_MODE || "").toLowerCase();
  if (explicit === "mock" || explicit === "test" || explicit === "live") {
    return explicit;
  }
  if (env.FUNCTIONS_EMULATOR === "true") return "mock";
  if (env.TOSS_SECRET_KEY) {
    return /^live_/i.test(env.TOSS_SECRET_KEY) ? "live" : "test";
  }
  return "mock";
}

export interface TossPaymentsAdapter {
  readonly id: "mock" | "toss";
  confirm(input: {
    paymentKey: string;
    orderId: string;
    amount: number;
  }): Promise<TossPaymentView>;
  retrieveByPaymentKey(paymentKey: string): Promise<TossPaymentView>;
  cancel(input: {
    paymentKey: string;
    cancelReason: string;
    cancelAmount?: number;
  }): Promise<TossPaymentView>;
}

/** In-memory mock — never calls Toss. */
export class MockTossAdapter implements TossPaymentsAdapter {
  readonly id = "mock" as const;
  private paid = new Map<string, TossPaymentView>();
  private failNext = false;

  setFailNext(v: boolean): void {
    this.failNext = v;
  }

  async confirm(input: {
    paymentKey: string;
    orderId: string;
    amount: number;
  }): Promise<TossPaymentView> {
    if (this.failNext) {
      this.failNext = false;
      throw new CommerceError("pg/mock-declined", "결제가 승인되지 않았습니다.", "failed-precondition");
    }
    const existing = this.paid.get(input.paymentKey);
    if (existing) {
      if (existing.orderId !== input.orderId || existing.totalAmount !== input.amount) {
        throw new CommerceError("pg/mock-mismatch", "결제 정보가 일치하지 않습니다.", "invalid-argument");
      }
      return existing;
    }
    const view: TossPaymentView = {
      paymentKey: input.paymentKey,
      orderId: input.orderId,
      status: "DONE",
      totalAmount: input.amount,
      method: "카드",
      approvedAt: new Date().toISOString(),
    };
    this.paid.set(input.paymentKey, view);
    return view;
  }

  async retrieveByPaymentKey(paymentKey: string): Promise<TossPaymentView> {
    const view = this.paid.get(paymentKey);
    if (!view) {
      throw new CommerceError("pg/mock-not-found", "결제 정보를 찾을 수 없습니다.", "not-found");
    }
    return view;
  }

  async cancel(input: {
    paymentKey: string;
    cancelReason: string;
    cancelAmount?: number;
  }): Promise<TossPaymentView> {
    const view = await this.retrieveByPaymentKey(input.paymentKey);
    if (view.status === "CANCELED") return view;
    if (typeof input.cancelAmount === "number" && input.cancelAmount !== view.totalAmount) {
      throw new CommerceError(
        "pg/partial-refund-unsupported",
        "부분 환불은 지원하지 않습니다.",
        "invalid-argument",
      );
    }
    const next: TossPaymentView = { ...view, status: "CANCELED" };
    this.paid.set(input.paymentKey, next);
    return next;
  }

  /** Test helper: seed a DONE payment as if Toss already approved. */
  seedPaid(view: TossPaymentView): void {
    this.paid.set(view.paymentKey, view);
  }
}

/**
 * Official Toss Payments Core API adapter.
 * Auth: Basic base64(secretKey + ":") — docs.tosspayments.com/reference
 * Confirm: POST https://api.tosspayments.com/v1/payments/confirm
 * Retrieve: GET https://api.tosspayments.com/v1/payments/{paymentKey}
 * Cancel: POST https://api.tosspayments.com/v1/payments/{paymentKey}/cancel
 */
export class HttpTossAdapter implements TossPaymentsAdapter {
  readonly id = "toss" as const;
  private readonly authHeader: string;

  constructor(
    secretKey: string,
    mode: PgMode,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {
    assertNoLiveSecretInTest(secretKey, mode);
    assertNoTestSecretInLive(secretKey, mode);
    this.authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
  }

  private async request(path: string, init?: RequestInit): Promise<TossPaymentView> {
    const res = await this.fetchImpl(`https://api.tosspayments.com${path}`, {
      ...init,
      headers: {
        Authorization: this.authHeader,
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const code = typeof body.code === "string" ? body.code : "UNKNOWN";
      throw new CommerceError(
        `pg/toss-${code}`,
        "결제 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        "failed-precondition",
      );
    }
    return normalizeTossPayment(body);
  }

  confirm(input: { paymentKey: string; orderId: string; amount: number }): Promise<TossPaymentView> {
    return this.request("/v1/payments/confirm", {
      method: "POST",
      body: JSON.stringify({
        paymentKey: input.paymentKey,
        orderId: input.orderId,
        amount: input.amount,
      }),
    });
  }

  retrieveByPaymentKey(paymentKey: string): Promise<TossPaymentView> {
    return this.request(`/v1/payments/${encodeURIComponent(paymentKey)}`, { method: "GET" });
  }

  cancel(input: {
    paymentKey: string;
    cancelReason: string;
    cancelAmount?: number;
  }): Promise<TossPaymentView> {
    const body: Record<string, unknown> = { cancelReason: input.cancelReason };
    if (typeof input.cancelAmount === "number") {
      body.cancelAmount = input.cancelAmount;
    }
    return this.request(`/v1/payments/${encodeURIComponent(input.paymentKey)}/cancel`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}

export function normalizeTossPayment(body: Record<string, unknown>): TossPaymentView {
  const paymentKey = String(body.paymentKey || "");
  const orderId = String(body.orderId || "");
  const status = String(body.status || "");
  const totalAmount = Number(body.totalAmount);
  if (!paymentKey || !orderId || !Number.isInteger(totalAmount)) {
    throw new CommerceError("pg/bad-response", "결제 응답이 올바르지 않습니다.", "internal");
  }
  return {
    paymentKey,
    orderId,
    status,
    totalAmount,
    method: typeof body.method === "string" ? body.method : undefined,
    approvedAt: typeof body.approvedAt === "string" ? body.approvedAt : null,
  };
}

export function createAdapterFromEnv(env: NodeJS.ProcessEnv = process.env): TossPaymentsAdapter {
  const mode = resolvePgMode(env);
  if (mode === "mock") return new MockTossAdapter();
  const secret = env.TOSS_SECRET_KEY || "";
  if (!secret) {
    throw new CommerceError(
      "keys/missing-secret",
      "결제 서비스 준비 중입니다.",
      "failed-precondition",
    );
  }
  return new HttpTossAdapter(secret, mode);
}

/** Toss orderId: 6–64 chars of [A-Za-z0-9_-] */
export function createSafeOrderId(): string {
  const raw = randomBytes(18).toString("base64url").replace(/[^A-Za-z0-9_-]/g, "x");
  const id = `ord_${raw}`.slice(0, 64);
  if (id.length < 6) return `ord_${Date.now()}`;
  return id;
}

export function hashIdempotency(userId: string, key: string): string {
  return createHash("sha256").update(`${userId}:${key}`).digest("hex").slice(0, 40);
}
