/**
 * Append-only diagnostic logging tests for ebook callables.
 * Invoked from ebook-chapter-api.test.mjs after build.
 */
export function runEbookDiagnosticLogChecks(ebook, check) {
  const {
    sanitizeEbookDiagnosticMessage,
    buildEbookCallableFailureLog,
    logEbookCallableFailure,
    EBOOK_CLIENT_INTERNAL_MESSAGE,
  } = ebook;

  const dirty =
    "failed for uid=AbCdEfGhIjKlMnOpQrStUvWxYz12 email=admin@sotongware.com token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.aaa.bbb key=AIzaSyDummyKeyForTestOnly0123456789 path=private/ebooks/ai-first-ebook-for-50s/r2/chapters/ch-02.json bucket=gs://sotongware.firebasestorage.app/other";
  const cleaned = sanitizeEbookDiagnosticMessage(dirty);
  check("diag sanitize redacts email", cleaned.includes("[redacted-email]") && !cleaned.includes("admin@"));
  check("diag sanitize redacts gs", cleaned.includes("[redacted-gs]") && !cleaned.includes("gs://"));
  check(
    "diag sanitize redacts object path",
    cleaned.includes("[redacted-object-path]") && !/private\/ebooks\//.test(cleaned),
  );
  check("diag sanitize redacts jwt", cleaned.includes("[redacted-jwt]"));
  check("diag sanitize redacts key", cleaned.includes("[redacted-key]"));
  check("diag sanitize redacts uid assign", cleaned.includes("uid=[redacted]"));

  const err = new Error(
    "ebook_content_provider_local_forbidden_in_production gs://secret-bucket/x",
  );
  err.name = "Error";
  const payload = buildEbookCallableFailureLog(err, {
    stage: "provider_init",
    providerMode: "storage",
  });
  check("diag log event", payload.event === "ebook_callable_failed");
  check("diag log name", payload.name === "Error");
  check("diag log stage", payload.stage === "provider_init");
  check("diag log provider", payload.provider === "storage");
  check(
    "diag log message sanitized",
    payload.message.includes("ebook_content_provider_local_forbidden_in_production") &&
      !payload.message.includes("gs://") &&
      payload.message.includes("[redacted-gs]"),
  );

  const lines = [];
  logEbookCallableFailure(err, { stage: "provider_init", providerMode: "storage" }, {
    error: (line) => lines.push(String(line)),
  });
  check("diag logger invoked", lines.length === 1);
  check(
    "diag logger line shape",
    lines[0].includes("ebook_callable_failed") &&
      lines[0].includes("name=Error") &&
      lines[0].includes("stage=provider_init") &&
      lines[0].includes("provider=storage") &&
      lines[0].includes("message=") &&
      !lines[0].includes("gs://") &&
      !lines[0].includes("stack"),
  );

  check(
    "diag client internal message constant",
    EBOOK_CLIENT_INTERNAL_MESSAGE === "요청을 처리할 수 없습니다.",
  );
  check(
    "diag client message has no exception detail",
    !EBOOK_CLIENT_INTERNAL_MESSAGE.includes("gs://") &&
      !EBOOK_CLIENT_INTERNAL_MESSAGE.includes("provider") &&
      !EBOOK_CLIENT_INTERNAL_MESSAGE.includes("stack"),
  );
}
