/**
 * Production Hosting build for sotongware.web.app.
 *
 * Forces client flags so a local .env.local with USE_EMULATOR=true
 * cannot leak into the static export. Preserves local `next dev` emulator use.
 *
 * Google Auth UI is enabled in production via auth-safety.ts (NODE_ENV bake),
 * not via a runtime NEXT_PUBLIC_AUTH_GOOGLE_ENABLED lookup.
 *
 * Usage: node scripts/build-hosting-production.mjs
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertProductionFirebaseClientBundle } from "./assert-production-firebase-client.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const env = {
  ...process.env,
  NODE_ENV: "production",
  // Explicit overrides beat .env.local for Next.js (already-set process.env wins).
  NEXT_PUBLIC_FIREBASE_USE_EMULATOR: "false",
  // Public feature intent (Google UI bake is NODE_ENV-based in auth-safety; keep flag aligned).
  NEXT_PUBLIC_AUTH_GOOGLE_ENABLED: "true",
  // Do not enable email/password signup for this Hosting production path.
  NEXT_PUBLIC_AUTH_EMAIL_ENABLED: "false",
  NEXT_PUBLIC_AUTH_SIGNUP_ENABLED: "false",
};

console.log("[build:hosting] production client flags:");
console.log("  NEXT_PUBLIC_FIREBASE_USE_EMULATOR=false");
console.log("  NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true (UI bake: NODE_ENV=production)");
console.log("  NEXT_PUBLIC_AUTH_EMAIL_ENABLED=false");
console.log("  NEXT_PUBLIC_AUTH_SIGNUP_ENABLED=false");

const build = spawnSync("npx", ["next", "build"], {
  cwd: root,
  env,
  encoding: "utf8",
  shell: true,
  stdio: "inherit",
});

if (build.status !== 0) {
  process.exit(build.status || 1);
}

const report = assertProductionFirebaseClientBundle(join(root, "out"));
console.log("[build:hosting] production Firebase client bundle checks:");
for (const line of report.lines) console.log(`  ${line}`);
if (!report.ok) {
  console.error("[build:hosting] FAIL production emulator/Google client gate");
  process.exit(1);
}
console.log("[build:hosting] PASS");
