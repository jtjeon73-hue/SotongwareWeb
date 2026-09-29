/**
 * Storage Security Rules — private ebook objects deny all client access.
 * Run: npm run test:ebook:storage:rules
 * (wraps firebase emulators:exec --only storage)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  initializeTestEnvironment,
  assertFails,
} from "@firebase/rules-unit-testing";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RULES = fs.readFileSync(path.join(__dirname, "..", "storage.rules"), "utf8");
const PROJECT_ID = "sotongware-storage-rules";
const OBJECT = "private/ebooks/ai-first-ebook-for-50s/r2/chapters/ch-02.json";

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function main() {
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    storage: { rules: RULES },
  });

  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await ctx.storage().ref(OBJECT).put(Buffer.from(JSON.stringify({ id: "ch-02" })));
  });

  async function expectReadDenied(label, ctx) {
    try {
      await assertFails(ctx.storage().ref(OBJECT).getBytes());
      check(label, true);
    } catch (e) {
      // Some SDK versions use download differently — try getMetadata
      try {
        await assertFails(ctx.storage().ref(OBJECT).getMetadata());
        check(label, true);
      } catch (e2) {
        check(label, false, e2 instanceof Error ? e2.message : String(e2));
      }
    }
  }

  await expectReadDenied("H guest direct Storage read DENY", testEnv.unauthenticatedContext());
  await expectReadDenied(
    "I member direct Storage read DENY",
    testEnv.authenticatedContext("member1", { role: "member" }),
  );
  await expectReadDenied(
    "J premium client direct Storage read DENY",
    testEnv.authenticatedContext("prem1", { role: "member", plan: "premium" }),
  );
  await expectReadDenied(
    "K admin direct Storage read DENY",
    testEnv.authenticatedContext("admin1", { role: "admin" }),
  );

  try {
    await assertFails(
      testEnv
        .authenticatedContext("admin1", { role: "admin" })
        .storage()
        .ref(OBJECT)
        .put(Buffer.from("overwrite")),
    );
    check("K admin direct Storage write DENY", true);
  } catch (e) {
    check("K admin direct Storage write DENY", false, e instanceof Error ? e.message : String(e));
  }

  await testEnv.cleanup();
  console.log(failed === 0 ? "\nSTORAGE RULES ALL PASS" : `\nFAILED=${failed}`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
