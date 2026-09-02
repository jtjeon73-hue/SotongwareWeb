/**
 * Publication gate unit tests (mirrors src/lib/publication-eligibility.ts)
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BLOCKED = new Set([
  "draft",
  "generated",
  "testing",
  "awaiting_review",
  "internal_validation",
  "rejected",
  "failed",
  "cancelled",
  "cancelled_preserved",
  "archived_private",
]);

const REQUIRED = {
  productionStatus: "completed",
  validationStatus: "passed",
  qualityStatus: "approved",
  complianceStatus: "approved",
  publicationStatus: "published",
  userFinalApproval: true,
};

function isPublicationEligible(gate) {
  if (!gate) return false;
  for (const [key, expected] of Object.entries(REQUIRED)) {
    if (gate[key] === undefined || gate[key] === null || gate[key] !== expected) return false;
  }
  if (gate.publicationStatus && BLOCKED.has(gate.publicationStatus)) return false;
  return true;
}

let failed = 0;
function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}
function pass(msg) {
  console.log(`PASS: ${msg}`);
}

const approvedFixture = { ...REQUIRED };
if (!isPublicationEligible(approvedFixture)) fail("approved fixture should pass");
else pass("approved fixture passes gate");

const electricalGate = {
  productionStatus: "completed",
  validationStatus: "internal_validation",
  qualityStatus: "pending",
  complianceStatus: "pending",
  publicationStatus: "internal_validation",
  userFinalApproval: false,
};
if (isPublicationEligible(electricalGate)) fail("electrical inspection gate should fail");
else pass("electrical inspection internal_validation blocked");

if (!isPublicationEligible(null)) pass("null gate fail-closed");
else fail("null gate should fail-closed");

if (!isPublicationEligible({})) pass("empty gate fail-closed");
else fail("empty gate should fail-closed");

const partial = { ...REQUIRED, userFinalApproval: false };
if (isPublicationEligible(partial)) fail("missing userFinalApproval should fail");
else pass("userFinalApproval=false blocked");

const appsSource = readFileSync(join(__dirname, "..", "src", "data", "apps.ts"), "utf8");
if (appsSource.includes("electrical-inspection-check") && appsSource.includes("internal_validation")) {
  pass("electrical app retained in catalog with internal_validation");
} else {
  fail("electrical app catalog entry missing internal_validation marker");
}

if (!appsSource.includes("featured: false") && !appsSource.includes("featured:false")) {
  fail("electrical app should not be featured");
} else {
  pass("electrical app not featured");
}

console.log(failed === 0 ? "\npublication gate: PASS" : `\npublication gate: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
