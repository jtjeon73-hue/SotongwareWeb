/**
 * Regression: Firebase Admin default-app init for ebook paths.
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

const adminAppSrc = readFileSync(
  join(repoRoot, "functions", "src", "firebase-admin-app.ts"),
  "utf8",
);
const handlersSrc = readFileSync(
  join(repoRoot, "functions", "src", "ebook", "handlers.ts"),
  "utf8",
);
const storageReaderSrc = readFileSync(
  join(repoRoot, "functions", "src", "ebook", "admin-storage-reader.ts"),
  "utf8",
);
const downloadSrc = readFileSync(
  join(repoRoot, "functions", "src", "ebook", "download-delivery.ts"),
  "utf8",
);

check(
  "shared ensureFirebaseAdminApp helper exists",
  adminAppSrc.includes("export function ensureFirebaseAdminApp"),
);
check(
  "ensure uses getApp not getApps().length gate",
  adminAppSrc.includes("return getApp()") &&
    !/if\s*\(\s*getApps\(\)\.length/.test(adminAppSrc),
);
check(
  "handlers import ensureFirebaseAdminApp",
  handlersSrc.includes('from "../firebase-admin-app"'),
);
check(
  "handlers call ensure at chapter entry",
  /assertEbookChapterCallableEnabled\(\);[\s\S]*?ensureFirebaseAdminApp\(\);/.test(
    handlersSrc.split("getEbookDownloadUrl")[0],
  ),
);
check(
  "handlers call ensure at download entry",
  /assertEbookDownloadCallableEnabled\(\);\s+ensureFirebaseAdminApp\(\);/.test(handlersSrc),
);
check(
  "getDb calls ensure before getFirestore",
  /function getDb\(\)[\s\S]*?ensureFirebaseAdminApp\(\);[\s\S]*?return getFirestore\(\);/.test(
    handlersSrc,
  ),
);
check(
  "storage reader ensures before getStorage",
  storageReaderSrc.includes("ensureFirebaseAdminApp()") &&
    storageReaderSrc.includes("getStorage()"),
);
check(
  "download accessor ensures before getStorage",
  downloadSrc.includes("ensureFirebaseAdminApp()") &&
    downloadSrc.includes("createAdminSdkStorageFileAccessor"),
);
check("handlers keep discovery omit free", !handlersSrc.includes("omit:"));
check(
  "handlers keep client internal message (no exception leak)",
  handlersSrc.includes("EBOOK_CLIENT_INTERNAL_MESSAGE") &&
    !/HttpsError\(\s*["']internal["']\s*,\s*[eE]\.message/.test(handlersSrc),
);

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
  check("precondition no admin apps", getApps().length === 0);

  let threwMissing = false;
  try {
    getFirestore();
  } catch (e) {
    threwMissing = String((e && e.message) || e).includes(
      "default Firebase app does not exist",
    );
  }
  check("getFirestore without app throws missing default", threwMissing);

  const app1 = ensureFirebaseAdminApp();
  check("ensure from empty creates default app", !!app1 && getApps().length >= 1);
  try {
    getApp();
    check("default app exists after ensure", true);
  } catch (e) {
    check("default app exists after ensure", false, String(e));
  }

  let dbOk = false;
  try {
    const db = getFirestore();
    dbOk = !!db;
  } catch (e) {
    dbOk = !String((e && e.message) || e).includes(
      "default Firebase app does not exist",
    );
    if (!dbOk) check("getFirestore after ensure", false, String(e));
  }
  check("getFirestore after ensure does not report missing app", dbOk);

  const before = getApps().length;
  const app2 = ensureFirebaseAdminApp();
  const app3 = ensureFirebaseAdminApp();
  check(
    "idempotent ensure no duplicate apps",
    getApps().length === before &&
      app2.name === app1.name &&
      app3.name === app1.name,
  );

  await clearAllApps();
  let concurrentOk = true;
  try {
    const results = await Promise.all([
      Promise.resolve().then(() => ensureFirebaseAdminApp()),
      Promise.resolve().then(() => ensureFirebaseAdminApp()),
      Promise.resolve().then(() => ensureFirebaseAdminApp()),
    ]);
    check(
      "concurrent ensure returns default apps",
      results.every((a) => a && a.name === "[DEFAULT]"),
    );
  } catch (e) {
    concurrentOk = false;
    check("concurrent ensure no throw", false, String(e));
  }
  if (concurrentOk) check("concurrent ensure no throw", true);

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

  const defaultAfterNamed = ensureFirebaseAdminApp();
  check(
    "ensure creates default alongside named app",
    defaultAfterNamed.name === "[DEFAULT]" && getApps().length === 2,
  );
  let dbAfterNamed = false;
  try {
    getFirestore();
    dbAfterNamed = true;
  } catch (e) {
    dbAfterNamed = !String((e && e.message) || e).includes(
      "default Firebase app does not exist",
    );
  }
  check("getFirestore works after named-only+ensure", dbAfterNamed);

  ensureFirebaseAdminApp();
  check("idempotent with named+default", getApps().length === 2);

  await clearAllApps();
}

runBehavioral()
  .then(() => {
    console.log(failed === 0 ? "\nADMIN APP INIT ALL PASS" : `\nFAILED=${failed}`);
    process.exit(failed === 0 ? 0 : 1);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
