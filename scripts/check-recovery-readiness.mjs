#!/usr/bin/env node
/**
 * Read-only recovery readiness check for the three core SotongWare repos.
 * Never push, reset, clean, stash, restore, delete, deploy, or print secrets.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");
const githubRoot = join(webRoot, "..");

const REPOS = [
  {
    id: "SotongwareWeb",
    candidates: [webRoot, join(githubRoot, "SotongwareWeb")],
    runbookRel: "docs/ops/SOTONGWARE_BACKUP_RECOVERY_RUNBOOK.md",
  },
  {
    id: "SotongWareControl",
    candidates: [
      join(githubRoot, "SotongWareControl"),
      join(githubRoot, "SotongwareControl"),
    ],
  },
  {
    id: "Sotong24Work",
    candidates: [join(githubRoot, "Sotong24Work")],
  },
];

let failed = 0;

function pass(msg) {
  console.log(`PASS: ${msg}`);
}
function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}
function warn(msg) {
  console.log(`WARN: ${msg}`);
}

function git(cwd, args) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function resolveRepo(candidates) {
  for (const p of candidates) {
    if (existsSync(join(p, ".git"))) return p;
  }
  return null;
}

console.log("SotongWare recovery readiness (read-only)\n");

for (const repo of REPOS) {
  const path = resolveRepo(repo.candidates);
  console.log(`=== ${repo.id} ===`);
  if (!path) {
    fail(`${repo.id}: directory/.git not found`);
    continue;
  }
  pass(`${repo.id}: path ${path}`);

  const branch = git(path, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const head = git(path, ["rev-parse", "--short", "HEAD"]);
  const origin = git(path, ["remote", "get-url", "origin"]);
  const porcelain = git(path, ["status", "--porcelain"]);
  const originMain = git(path, ["rev-parse", "origin/main"]);
  const fullHead = git(path, ["rev-parse", "HEAD"]);

  if (branch) pass(`${repo.id}: branch ${branch}`);
  else fail(`${repo.id}: cannot read branch`);

  if (head) pass(`${repo.id}: HEAD ${head}`);
  else fail(`${repo.id}: cannot read HEAD`);

  if (origin) pass(`${repo.id}: origin ${origin}`);
  else fail(`${repo.id}: origin missing`);

  if (porcelain === "") pass(`${repo.id}: clean`);
  else if (porcelain == null) fail(`${repo.id}: status unreadable`);
  else warn(`${repo.id}: dirty (uncommitted local changes present — not auto-fixed)`);

  if (originMain && fullHead && originMain === fullHead) {
    pass(`${repo.id}: HEAD == origin/main`);
  } else if (originMain && fullHead) {
    warn(`${repo.id}: HEAD != origin/main (local=${fullHead.slice(0, 7)} remote=${originMain.slice(0, 7)})`);
  } else {
    warn(`${repo.id}: could not compare origin/main`);
  }

  if (repo.runbookRel) {
    const doc = join(path, repo.runbookRel);
    if (existsSync(doc)) pass(`${repo.id}: runbook present`);
    else fail(`${repo.id}: missing ${repo.runbookRel}`);
  }
  console.log("");
}

const secretsDoc = join(webRoot, "docs/ops/SECRETS_MANIFEST.md");
if (existsSync(secretsDoc)) {
  const text = readFileSync(secretsDoc, "utf8");
  if (/sk_live_|sk_test_[A-Za-z0-9]{8,}|AIza[0-9A-Za-z_-]{20,}/.test(text)) {
    fail("SECRETS_MANIFEST appears to contain secret-like values");
  } else {
    pass("SECRETS_MANIFEST present (no obvious secret values scanned)");
  }
} else {
  fail("docs/ops/SECRETS_MANIFEST.md missing");
}

const artifactDoc = join(webRoot, "docs/ops/ARTIFACT_BACKUP_POLICY.md");
if (existsSync(artifactDoc)) pass("ARTIFACT_BACKUP_POLICY present");
else fail("ARTIFACT_BACKUP_POLICY missing");

console.log(failed === 0 ? "\nOVERALL: PASS (see WARN for dirty local WIP)" : `\nOVERALL: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
