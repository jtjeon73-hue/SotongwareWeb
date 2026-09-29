/**
 * Source + optional out/ checks for production Firebase client safety.
 * Does not deploy. Does not mutate Auth/Firestore.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertProductionFirebaseClientBundle } from "./assert-production-firebase-client.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const firebaseSrc = readFileSync(join(root, "src/lib/firebase.ts"), "utf8");
const authSrc = readFileSync(join(root, "src/lib/auth-safety.ts"), "utf8");
const pkg = readFileSync(join(root, "package.json"), "utf8");

check(
  "firebase.ts blocks emulator in NODE_ENV production",
  firebaseSrc.includes('process.env.NODE_ENV === "production"') &&
    firebaseSrc.includes("isFirebaseEmulatorClient") &&
    /NODE_ENV === "production"[\s\S]{0,80}return false/.test(firebaseSrc),
);

check(
  "auth-safety.ts blocks emulator in NODE_ENV production",
  authSrc.includes('process.env.NODE_ENV === "production"') &&
    /isAuthEmulatorEnabled[\s\S]{0,120}NODE_ENV === "production"[\s\S]{0,40}return false/.test(authSrc),
);

check(
  "build:hosting uses production builder",
  pkg.includes("build-hosting-production.mjs"),
);

check(
  "local next build script still present",
  /"build":\s*"next build"/.test(pkg),
);

const outDir = join(root, "out");
if (existsSync(outDir)) {
  const report = assertProductionFirebaseClientBundle(outDir);
  check(
    "out bundle gate",
    report.ok,
    report.lines.filter((l) => l.startsWith("FAIL")).join("; "),
  );
  for (const line of report.lines) {
    if (line.startsWith("PASS ") || line.startsWith("FAIL ")) {
      check(`out ${line.slice(5)}`, line.startsWith("PASS"));
    }
  }
} else {
  check("out/ present for bundle scan", false, "run npm run build:hosting first");
}

if (failed) {
  console.error(`\nFAILED ${failed}`);
  process.exit(1);
}
console.log("\nPRODUCTION FIREBASE CLIENT GUARD PASS");
