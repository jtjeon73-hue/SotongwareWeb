/**
 * Customer-safe vs internal commerce errors.
 * Never put secrets, paymentKey full values, or Firebase internals in customerMessage.
 */

export class CommerceError extends Error {
  constructor(
    public readonly internalCode: string,
    public readonly customerMessage: string,
    public readonly httpLike:
      | "unauthenticated"
      | "permission-denied"
      | "failed-precondition"
      | "invalid-argument"
      | "not-found"
      | "already-exists"
      | "aborted"
      | "internal" = "failed-precondition",
  ) {
    super(customerMessage);
    this.name = "CommerceError";
  }
}

export function maskPaymentKey(paymentKey: string): string {
  if (!paymentKey) return "";
  if (paymentKey.length <= 8) return "****";
  return `${paymentKey.slice(0, 4)}…${paymentKey.slice(-4)}`;
}

export function assertNoLiveSecretInTest(secret: string, mode: string): void {
  if (mode !== "live" && /^live_/i.test(secret)) {
    throw new CommerceError(
      "keys/live-in-nonlive",
      "결제 서비스 설정 오류가 있습니다.",
      "failed-precondition",
    );
  }
}

export function assertNoTestSecretInLive(secret: string, mode: string): void {
  if (mode === "live" && /^test_/i.test(secret)) {
    throw new CommerceError(
      "keys/test-in-live",
      "결제 서비스 설정 오류가 있습니다.",
      "failed-precondition",
    );
  }
}

export function assertClientKeyMode(clientKey: string, mode: "test" | "live" | "mock"): void {
  if (!clientKey) return;
  if (mode === "live" && /^test_/i.test(clientKey)) {
    throw new CommerceError("keys/test-client-in-live", "결제 서비스 설정 오류가 있습니다.");
  }
  if (mode !== "live" && mode !== "mock" && /^live_/i.test(clientKey)) {
    throw new CommerceError("keys/live-client-in-test", "결제 서비스 설정 오류가 있습니다.");
  }
}
