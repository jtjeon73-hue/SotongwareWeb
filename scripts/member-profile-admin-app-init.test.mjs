/**
 * Regression: Firebase Admin default-app init for member-profile getDb.
 * No deploy / no live Firebase mutation.
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const functionsRequire = createRequire(join(repoRoot, "functions", "package.json"));

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const memberSrc = readFileSync(
  join(repoRoot, "functions", "src", "member-profile.ts"),
  "utf8",
);

check(
  "member-profile imports ensureFirebaseAdminApp",
  memberSrc.includes('from "./firebase-admin-app"') &&
    memberSrc.includes("ensureFirebaseAdminApp"),
);
check(
  "member-profile getDb calls ensure before getFirestore",
  /function getDb\(\)[\s\S]*?ensureFirebaseAdminApp\(\);[\s\S]*?return getFirestore\(\);/.test(
    memberSrc,
  ),
);
check(
  "member-profile does not use getApps().length init gate",
  !memberSrc.includes("getApps") && !memberSrc.includes("initializeApp"),
);
check(
  "ensureMyMemberProfile still exported",
  memberSrc.includes("export const ensureMyMemberProfile"),
);
check(
  "provisionMemberProfile still exported",
  memberSrc.includes("export const provisionMemberProfile"),
);

const build = spawnSync("npm", ["run", "build"], {
  cwd: join(repoRoot, "functions"),
  encoding: "utf8",
  shell: true,
});
if (build.status !== 0) {
  console.error(build.stdout);
  console.error(build.stderr);
  process.exit(1);
}
check("functions tsc build", true);

const { ensureFirebaseAdminApp } = functionsRequire("./lib/firebase-admin-app.js");
const { getApp, getApps, deleteApp, initializeApp } = functionsRequire("firebase-admin/app");
const { getFirestore } = functionsRequire("firebase-admin/firestore");

async function clearAllApps() {
  const apps = [...getApps()];
  for (const app of apps) {
    await deleteApp(app);
  }
}

async function runBehavioral() {
  await clearAllApps();
  initializeApp({ projectId: "sotongware-named-only-test" }, "named-only");
  check("named-only app present", getApps().length === 1);

  let namedDefaultMissing = false;
  try {
    getApp();
  } catch {
    namedDefaultMissing = true;
  }
  check("named-only has no default app", namedDefaultMissing);

  check(
    "OLD getApps().length gate would skip initializeApp",
    getApps().length > 0,
  );

  let oldPatternFirestoreFails = false;
  try {
    getFirestore();
  } catch (e) {
    oldPatternFirestoreFails = String((e && e.message) || e).includes(
      "default Firebase app does not exist",
    );
  }
  check(
    "getFirestore without default throws (simulates OLD skip)",
    oldPatternFirestoreFails,
  );

  ensureFirebaseAdminApp();
  let dbOk = false;
  try {
    const db = getFirestore();
    dbOk = !!db;
  } catch (e) {
    check("getFirestore after ensure", false, String(e));
  }
  check("getFirestore after ensure succeeds", dbOk);

  await clearAllApps();
}

runBehavioral()
  .then(() => {
    console.log(
      failed === 0
        ? "\nMEMBER PROFILE ADMIN APP INIT ALL PASS"
        : `\nFAILED=${failed}`,
    );
    process.exit(failed === 0 ? 0 : 1);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
