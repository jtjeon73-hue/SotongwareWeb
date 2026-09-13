/**
 * Commerce Functions deploy gate — separate from membership allowlist.
 * Default: --check-only. Never run --confirm-deploy unless explicitly approved.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

export const COMMERCE_ALLOWED_FUNCTIONS = Object.freeze([
  "prepareCommerceCheckout",
  "confirmCommercePayment",
  "handleTossPaymentWebhook",
  "refundCommercePayment",
]);

export const COMMERCE_FORBIDDEN_NAMES = Object.freeze([
  "ensureMyMemberProfile",
  "provisionMemberProfile",
  "submitContactInquiry",
]);

export const FORBIDDEN_DEPLOY_TARGETS = Object.freeze([
  "hosting",
  "firestore",
  "firestore:rules",
  "firestore:indexes",
  "storage",
  "storage:rules",
]);

const EXPECTED_PROJECT = "sotongware";
const FORBIDDEN_PROJECT = "sotongware-control";

export function readConfiguredProject(root = ROOT) {
  const rc = JSON.parse(fs.readFileSync(path.join(root, ".firebaserc"), "utf8"));
  const project = rc?.projects?.default;
  if (typeof project !== "string" || !project) throw new Error(".firebaserc projects.default missing");
  return project;
}

export function assertSafeProject(project) {
  if (project === FORBIDDEN_PROJECT) throw new Error(`Refusing project ${FORBIDDEN_PROJECT}`);
  if (project !== EXPECTED_PROJECT) {
    throw new Error(`Refusing unexpected project "${project}" (expected ${EXPECTED_PROJECT})`);
  }
}

export function assertKeyModeSafe(env = process.env) {
  const mode = (env.COMMERCE_PG_MODE || "").toLowerCase();
  const secret = env.TOSS_SECRET_KEY || "";
  const client = env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";
  if (secret && /^live_/i.test(secret) && mode !== "live") {
    throw new Error("Refusing live secret outside COMMERCE_PG_MODE=live");
  }
  if (secret && /^test_/i.test(secret) && mode === "live") {
    throw new Error("Refusing test secret with COMMERCE_PG_MODE=live");
  }
  if (client && /^live_/i.test(client) && mode !== "live") {
    throw new Error("Refusing live client key outside live mode");
  }
  if (client && /^test_/i.test(client) && mode === "live") {
    throw new Error("Refusing test client key in live mode");
  }
}

export function buildCommerceOnlyFlag(names = COMMERCE_ALLOWED_FUNCTIONS) {
  const list = [...names];
  for (const n of list) {
    if (COMMERCE_FORBIDDEN_NAMES.includes(n)) {
      throw new Error(`Forbidden function in commerce allowlist: ${n}`);
    }
    if (!COMMERCE_ALLOWED_FUNCTIONS.includes(n)) {
      throw new Error(`Function not on commerce allowlist: ${n}`);
    }
  }
  if (!list.length) throw new Error("Commerce allowlist empty");
  return `functions:${list.join(",functions:")}`;
}

export function assertNoForbiddenTargets(onlyFlag) {
  const lower = String(onlyFlag).toLowerCase();
  for (const bad of FORBIDDEN_DEPLOY_TARGETS) {
    if (lower.includes(bad)) throw new Error(`Forbidden deploy target included: ${bad}`);
  }
  for (const bad of COMMERCE_FORBIDDEN_NAMES) {
    if (lower.includes(bad.toLowerCase())) {
      throw new Error(`Forbidden function included: ${bad}`);
    }
  }
}

export function planCommerceDeploy(root = ROOT, env = process.env) {
  const project = readConfiguredProject(root);
  assertSafeProject(project);
  assertKeyModeSafe(env);
  const onlyFlag = buildCommerceOnlyFlag();
  assertNoForbiddenTargets(onlyFlag);
  return {
    project,
    onlyFlag,
    args: ["deploy", "--only", onlyFlag, "--project", project],
    allowedFunctions: [...COMMERCE_ALLOWED_FUNCTIONS],
    secretsReady: env.COMMERCE_SECRETS_READY === "true",
  };
}

function parseArgs(argv) {
  const checkOnly = argv.includes("--check-only");
  const confirmDeploy = argv.includes("--confirm-deploy");
  if (checkOnly && confirmDeploy) {
    throw new Error("Pass only one of --check-only or --confirm-deploy");
  }
  if (!checkOnly && !confirmDeploy) {
    throw new Error("Required: --check-only (safe) or --confirm-deploy (live, user-approved only)");
  }
  return { checkOnly, confirmDeploy };
}

function main() {
  const { checkOnly, confirmDeploy } = parseArgs(process.argv.slice(2));
  const plan = planCommerceDeploy();
  console.log("[commerce-deploy]");
  console.log(`project=${plan.project}`);
  console.log(`only=${plan.onlyFlag}`);
  console.log(`allowed=${plan.allowedFunctions.join(",")}`);
  console.log(`secretsReady=${plan.secretsReady}`);
  console.log(`command=firebase ${plan.args.join(" ")}`);
  console.log("targets: hosting=NO rules=NO storage=NO membership=NO contact=NO");
  if (checkOnly) {
    console.log("mode=check-only (no deploy executed)");
    return;
  }
  if (confirmDeploy) {
    if (!plan.secretsReady) {
      throw new Error("Refusing commerce deploy: COMMERCE_SECRETS_READY!=true (Secret Manager binding required)");
    }
    throw new Error(
      "Refusing --confirm-deploy in this session: live commerce deploy is out of scope. Use check-only only.",
    );
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    main();
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }
}
