/**
 * Assert static Hosting export does not wire Firebase client to local emulators,
 * and that Google Auth UI is bake-inlined (not a runtime env property read).
 *
 * Usage: node scripts/assert-production-firebase-client.mjs [outDir]
 */
import { existsSync, readdirSync, readFileSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function walkJs(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walkJs(p, acc);
    else if (name.name.endsWith(".js") || name.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

/** Runtime property access of the Google flag (any minified env object name). */
const GOOGLE_RUNTIME_ENV_LOOKUP =
  /(?:process\s*\.\s*)?env\s*\.\s*NEXT_PUBLIC_AUTH_GOOGLE_ENABLED\b/;

/**
 * auth-safety production cluster after bake:
 * emulator off (return!1) then Google on (return!0), next to policy version constants.
 */
const AUTH_SAFETY_GOOGLE_ON_CLUSTER =
  /"2026-09-11"[\s\S]{0,80}function \w\(\)\{return!1\}function \w\(\)\{return!0\}/;

export function assertProductionFirebaseClientBundle(outDir) {
  const lines = [];
  const files = walkJs(outDir);
  if (files.length === 0) {
    return { ok: false, lines: [`no build output under ${outDir}`] };
  }

  let blob = "";
  for (const f of files) blob += `${readFileSync(f, "utf8")}\n`;

  const strictForbidden = [
    { id: "loopback_host", re: /127\.0\.0\.1/ },
    { id: "auth_emulator_url", re: /http:\/\/127\.0\.0\.1:9099/ },
    { id: "auth_port_9099", re: /:9099/ },
    { id: "functions_emulator_port_5001", re: /127\.0\.0\.1.{0,12}5001|:5001.{0,12}127\.0\.0\.1/ },
    { id: "firestore_emulator_port_8080", re: /127\.0\.0\.1.{0,12}8080|:8080.{0,12}127\.0\.0\.1/ },
  ];

  let ok = true;
  for (const item of strictForbidden) {
    if (item.re.test(blob)) {
      ok = false;
      lines.push(`FAIL ${item.id}`);
    } else {
      lines.push(`PASS ${item.id} absent`);
    }
  }

  if (GOOGLE_RUNTIME_ENV_LOOKUP.test(blob)) {
    ok = false;
    lines.push("FAIL google_auth_still_runtime_env");
  } else {
    lines.push("PASS google_auth_not_runtime_env");
  }

  if (AUTH_SAFETY_GOOGLE_ON_CLUSTER.test(blob) && /Firebase 운영 Auth/.test(blob)) {
    lines.push("PASS google_auth_ui_baked_enabled");
  } else {
    ok = false;
    lines.push("FAIL google_or_prod_auth_label_not_baked");
  }

  // Email/signup must not be baked ON. Prefer no explicit Google-style true bake for signup.
  // Runtime undefined === "true" is false (safe-off); only fail if clearly forced true near signup flag.
  if (/NEXT_PUBLIC_AUTH_SIGNUP_ENABLED[\s\S]{0,40}return!0/.test(blob)) {
    ok = false;
    lines.push("FAIL signup_appears_baked_on");
  } else {
    lines.push("PASS signup_not_baked_on");
  }
  if (/NEXT_PUBLIC_AUTH_EMAIL_ENABLED[\s\S]{0,40}return!0/.test(blob)) {
    ok = false;
    lines.push("FAIL email_appears_baked_on");
  } else {
    lines.push("PASS email_not_baked_on");
  }

  if (!/Google로 계속하기/.test(blob)) {
    ok = false;
    lines.push("FAIL google_continue_label_missing");
  } else {
    lines.push("PASS google_continue_label_present");
  }

  const hasProdLabel = /Firebase 운영 Auth/.test(blob);
  const hasEmuLabel = /Firebase Emulator \(로컬 테스트\)/.test(blob);
  if (hasEmuLabel && !hasProdLabel) {
    ok = false;
    lines.push("FAIL auth_target_label_emulator_only");
  } else if (hasProdLabel) {
    lines.push("PASS auth_target_label_production_present");
  } else {
    lines.push("PASS auth_target_label_check_soft");
  }

  lines.push(`scanned_files ${files.length}`);
  return { ok, lines };
}

const thisFile = fileURLToPath(import.meta.url);
let invoked = "";
try {
  invoked = realpathSync(process.argv[1] || "");
} catch {
  invoked = process.argv[1] || "";
}

const outDir = process.argv[2] || join(dirname(thisFile), "..", "out");

if (invoked.replace(/\\/g, "/").endsWith("assert-production-firebase-client.mjs")) {
  const report = assertProductionFirebaseClientBundle(outDir);
  for (const line of report.lines) console.log(line);
  process.exit(report.ok ? 0 : 1);
}
