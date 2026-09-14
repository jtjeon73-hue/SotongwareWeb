import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createAdapterFromEnv, resolvePgMode } from "./adapter";
import { CommerceError } from "./errors";
import { CommerceCheckoutService, FirestoreCommerceStore } from "./service";
import { isFunctionsEmulatorRuntime } from "./emulator-runtime";

const runningInEmulator = isFunctionsEmulatorRuntime();
const allowCommerceInCloud = process.env.ALLOW_COMMERCE_FUNCTIONS === "true";
export const commerceFunctionsOmitted = !(runningInEmulator || allowCommerceInCloud);

function getDb() {
  if (!getApps().length) initializeApp();
  return getFirestore();
}

function getService() {
  return new CommerceCheckoutService(new FirestoreCommerceStore(getDb()), createAdapterFromEnv());
}

function mapError(e: unknown): never {
  if (e instanceof CommerceError) {
    throw new HttpsError(e.httpLike, e.customerMessage);
  }
  throw new HttpsError("internal", "요청을 처리할 수 없습니다.");
}

const callableOpts = {
  omit: commerceFunctionsOmitted,
  cors: true,
  region: "us-central1" as const,
  memory: "256MiB" as const,
  timeoutSeconds: 30,
  minInstances: 0,
  maxInstances: 5,
};

export const prepareCommerceCheckout = onCall(callableOpts, async (request) => {
  try {
    if (!request.auth?.uid) {
      throw new CommerceError("auth/required", "로그인이 필요합니다.", "unauthenticated");
    }
    const data = (request.data || {}) as {
      productId?: string;
      idempotencyKey?: string;
      amount?: unknown;
      uid?: string;
      userId?: string;
    };
    if (
      (typeof data.uid === "string" && data.uid !== request.auth.uid) ||
      (typeof data.userId === "string" && data.userId !== request.auth.uid)
    ) {
      throw new CommerceError("auth/uid-inject", "권한이 없습니다.", "permission-denied");
    }
    const result = await getService().prepare(request.auth.uid, {
      productId: String(data.productId || ""),
      idempotencyKey: String(data.idempotencyKey || ""),
      clientAmount: data.amount,
    });
    return {
      ...result,
      clientKeyHint: resolvePgMode() === "mock" ? null : "configured",
      mockCheckout: resolvePgMode() === "mock",
    };
  } catch (e) {
    mapError(e);
  }
});

export const confirmCommercePayment = onCall(callableOpts, async (request) => {
  try {
    if (!request.auth?.uid) {
      throw new CommerceError("auth/required", "로그인이 필요합니다.", "unauthenticated");
    }
    const data = (request.data || {}) as {
      orderId?: string;
      paymentKey?: string;
      amount?: number;
    };
    return await getService().confirm(request.auth.uid, {
      orderId: String(data.orderId || ""),
      paymentKey: String(data.paymentKey || ""),
      amount: Number(data.amount),
    });
  } catch (e) {
    mapError(e);
  }
});

export const refundCommercePayment = onCall(callableOpts, async (request) => {
  try {
    if (!request.auth?.uid) {
      throw new CommerceError("auth/required", "로그인이 필요합니다.", "unauthenticated");
    }
    const isAdmin = request.auth.token?.role === "admin";
    const data = (request.data || {}) as { orderId?: string; reason?: string };
    return await getService().refund(request.auth.uid, Boolean(isAdmin), {
      orderId: String(data.orderId || ""),
      reason: String(data.reason || ""),
    });
  } catch (e) {
    mapError(e);
  }
});

const MAX_WEBHOOK_BYTES = 64 * 1024;

export const handleTossPaymentWebhook = onRequest(
  {
    omit: commerceFunctionsOmitted,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 30,
    minInstances: 0,
    maxInstances: 5,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }
      const ct = String(req.headers["content-type"] || "");
      if (!ct.includes("application/json")) {
        res.status(415).send("Unsupported Media Type");
        return;
      }
      const raw = typeof req.rawBody === "object" && req.rawBody
        ? req.rawBody
        : Buffer.from(JSON.stringify(req.body || {}));
      if (raw.length > MAX_WEBHOOK_BYTES) {
        res.status(413).send("Payload Too Large");
        return;
      }

      const body = (req.body || {}) as Record<string, unknown>;
      const eventType = String(body.eventType || "");
      const data = (body.data || {}) as Record<string, unknown>;
      const paymentKey = String(data.paymentKey || "");
      const orderId = data.orderId ? String(data.orderId) : null;
      const status = data.status ? String(data.status) : null;
      const providerEventId =
        String(body.eventId || "") ||
        `${eventType}:${paymentKey}:${status || "na"}:${String(body.createdAt || "")}`;

      if (eventType && eventType !== "PAYMENT_STATUS_CHANGED" && eventType !== "CANCEL_STATUS_CHANGED") {
        res.status(200).json({ ok: true, ignored: true });
        return;
      }
      if (!paymentKey) {
        res.status(400).json({ ok: false });
        return;
      }

      // Official docs: no HMAC signature for PAYMENT_STATUS_CHANGED.
      // Authenticity via secret-key retrieve (never trust webhook body alone).
      await getService().handleProviderStatusEvent({
        providerEventId: providerEventId.slice(0, 200),
        paymentKey,
        claimedOrderId: orderId,
        claimedStatus: status,
      });
      res.status(200).json({ ok: true });
    } catch (e) {
      // Acknowledge with 200 only for duplicates handled; otherwise 400/500
      // without leaking internals. Toss retries on non-200.
      if (e instanceof CommerceError && e.httpLike === "invalid-argument") {
        res.status(400).json({ ok: false });
        return;
      }
      res.status(500).json({ ok: false });
    }
  },
);
