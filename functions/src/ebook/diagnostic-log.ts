/**
 * Safe diagnostic logging for ebook callables.
 * Never log UID/email/token/credentials/object paths/full stacks.
 */

export const EBOOK_CLIENT_INTERNAL_MESSAGE = "요청을 처리할 수 없습니다.";

export type EbookCallableFailureContext = {
  /** Coarse handler stage — no user/content identifiers. */
  stage?: string;
  /** Provider mode only: local | storage | unknown */
  providerMode?: string;
};

/** Strip secrets / PII / storage locations from an exception message for ops logs. */
export function sanitizeEbookDiagnosticMessage(raw: unknown, maxLen = 180): string {
  let msg =
    typeof raw === "string"
      ? raw
      : raw instanceof Error
        ? String(raw.message || "")
        : raw == null
          ? ""
          : String(raw);

  // Object paths before URL/gs so nested private/ebooks segments are always redacted.
  msg = msg.replace(/private\/ebooks\/[^\s"'`]+/gi, "[redacted-object-path]");
  msg = msg.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]");
  msg = msg.replace(/gs:\/\/[^\s"'`]+/gi, "[redacted-gs]");
  msg = msg.replace(/https?:\/\/[^\s"'`]+/gi, "[redacted-url]");
  msg = msg.replace(/\bBearer\s+[A-Za-z0-9._\-]+/gi, "[redacted-bearer]");
  msg = msg.replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[redacted-jwt]");
  msg = msg.replace(/\bAIza[0-9A-Za-z\-_]{20,}\b/g, "[redacted-key]");
  msg = msg.replace(/\buid[=:]\s*[A-Za-z0-9_-]+/gi, "uid=[redacted]");
  // Typical Firebase Auth UID length
  msg = msg.replace(/\b[A-Za-z0-9]{28}\b/g, "[redacted-id]");
  msg = msg.replace(/\s+/g, " ").trim();

  if (!msg) return "(empty)";
  if (msg.length > maxLen) return `${msg.slice(0, maxLen)}…`;
  return msg;
}

export function buildEbookCallableFailureLog(
  e: unknown,
  ctx: EbookCallableFailureContext = {},
): {
  event: "ebook_callable_failed";
  name: string;
  message: string;
  stage: string;
  provider: string;
} {
  const name = e instanceof Error ? e.name || "Error" : "unknown";
  return {
    event: "ebook_callable_failed",
    name,
    message: sanitizeEbookDiagnosticMessage(e instanceof Error ? e.message : e),
    stage: (ctx.stage || "unknown").slice(0, 40),
    provider: (ctx.providerMode || "unknown").slice(0, 24),
  };
}

/** Server-only — never attach this payload to HttpsError details. */
export function logEbookCallableFailure(
  e: unknown,
  ctx: EbookCallableFailureContext = {},
  logger: Pick<Console, "error"> = console,
): void {
  const payload = buildEbookCallableFailureLog(e, ctx);
  logger.error(
    `${payload.event} name=${payload.name} stage=${payload.stage} provider=${payload.provider} message=${payload.message}`,
  );
}
