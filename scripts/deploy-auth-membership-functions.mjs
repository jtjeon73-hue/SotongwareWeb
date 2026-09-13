/**
 * Safe Auth membership Functions deploy guard for sotongware.
 *
 * NEVER run with --confirm-deploy in CI/agent tasks unless the user explicitly
 * approved a live deploy. This gate repair only uses --check-only in tests.
 *
 * Usage:
 *   node scripts/deploy-auth-membership-functions.mjs --check-only
 *   node scripts/deploy-auth-membership-functions.mjs --confirm-deploy
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

export const ALLOWED_FUNCTIONS = Object.freeze([
  "ensureMyMemberProfile",
  "provisionMemberProfile",
]);

export const FORBIDDEN_FUNCTION_NAMES = Object.freeze([
  "submitContactInquiry",
  // Commerce Functions require a separate approved allowlist — never via membership deploy
  "createCommerceCheckout",
  "confirmCommercePayment",
  "handleCommerceWebhook",
  "grantProductEntitlement",
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
  const rcPath = path.join(root, ".firebaserc");
  if (!fs.existsSync(rcPath)) {
    throw new Error(".firebaserc missing");
  }
  const rc = JSON.parse(fs.readFileSync(rcPath, "utf8"));
  const project = rc?.projects?.default;
  if (typeof project !== "string" || !project) {
    throw new Error(".firebaserc projects.default missing");
  }
  return project;
}

export function assertSafeProject(project) {
  if (project === FORBIDDEN_PROJECT) {
    throw new Error(`Refusing project ${FORBIDDEN_PROJECT}`);
  }
  if (project !== EXPECTED_PROJECT) {
    throw new Error(`Refusing unexpected project "${project}" (expected ${EXPECTED_PROJECT})`);
  }
}

export function buildFunctionsOnlyFlag(functionNames = ALLOWED_FUNCTIONS) {
  const names = [...functionNames];
  for (const n of names) {
    if (FORBIDDEN_FUNCTION_NAMES.includes(n)) {
      throw new Error(`Forbidden function in allowlist: ${n}`);
    }
    if (!ALLOWED_FUNCTIONS.includes(n)) {
      throw new Error(`Function not on allowlist: ${n}`);
    }
  }
  if (names.length === 0) {
    throw new Error("Allowlist empty");
  }
  return `functions:${names.join(",functions:")}`;
}

export function assertNoForbiddenTargets(onlyFlag) {
  const lower = String(onlyFlag).toLowerCase();
  for (const bad of FORBIDDEN_DEPLOY_TARGETS) {
    if (lower.includes(bad)) {
      throw new Error(`Forbidden deploy target included: ${bad}`);
    }
  }
  for (const bad of FORBIDDEN_FUNCTION_NAMES) {
    if (lower.includes(bad.toLowerCase())) {
      throw new Error(`Forbidden function included: ${bad}`);
    }
  }
}

export function buildDeployArgs(project, onlyFlag) {
  assertSafeProject(project);
  assertNoForbiddenTargets(onlyFlag);
  return ["deploy", "--only", onlyFlag, "--project", project];
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

export function planAuthMembershipDeploy(root = ROOT) {
  const project = readConfiguredProject(root);
  assertSafeProject(project);
  const onlyFlag = buildFunctionsOnlyFlag(ALLOWED_FUNCTIONS);
  assertNoForbiddenTargets(onlyFlag);
  const args = buildDeployArgs(project, onlyFlag);
  return {
    project,
    onlyFlag,
    args,
    allowedFunctions: [...ALLOWED_FUNCTIONS],
    excludedFunctions: [...FORBIDDEN_FUNCTION_NAMES],
    commandPreview: `firebase ${args.join(" ")}`,
  };
}

function main() {
  const { checkOnly, confirmDeploy } = parseArgs(process.argv.slice(2));
  const plan = planAuthMembershipDeploy(ROOT);

  console.log("[auth-membership-deploy]");
  console.log(`project=${plan.project}`);
  console.log(`only=${plan.onlyFlag}`);
  console.log(`allowed=${plan.allowedFunctions.join(",")}`);
  console.log(`excluded=${plan.excludedFunctions.join(",")}`);
  console.log(`command=${plan.commandPreview}`);
  console.log("targets: hosting=NO rules=NO storage=NO contact=NO");

  if (checkOnly) {
    console.log("mode=check-only (no deploy executed)");
    process.exit(0);
  }

  if (!confirmDeploy) {
    console.error("Refusing deploy without --confirm-deploy");
    process.exit(1);
  }

  console.log("mode=confirm-deploy — invoking firebase CLI");
  const result = spawnSync("firebase", plan.args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
  });
  process.exit(result.status ?? 1);
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  try {
    main();
  } catch (e) {
    console.error(String(e && e.message ? e.message : e));
    process.exit(1);
  }
}
