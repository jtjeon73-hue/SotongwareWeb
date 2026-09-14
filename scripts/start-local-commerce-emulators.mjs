/**
 * Start local Auth/Firestore/Functions emulators for commerce sandbox.
 *
 * - Runs firebase-tools under functions' pinned node@22 so engines match
 * - Sets FUNCTIONS_DISCOVERY_TIMEOUT (default 60s) to avoid empty exports
 *   after slow first-start (jar download), which browsers mislabel as CORS
 *
 * Does not read or print secrets. Pass PG mode/secret env from the calling shell when needed.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const functionsNodeBin = path.join(
  root,
  "functions",
  "node_modules",
  "node",
  "bin",
  process.platform === "win32" ? "node.exe" : "node",
);
const firebaseCli = path.join(root, "node_modules", "firebase-tools", "lib", "bin", "firebase.js");

const env = {
  ...process.env,
  FUNCTIONS_DISCOVERY_TIMEOUT: process.env.FUNCTIONS_DISCOVERY_TIMEOUT || "60",
};

const args = [
  firebaseCli,
  "emulators:start",
  "--only",
  "auth,firestore,functions",
  "--project",
  "sotongware",
];

const nodeBin = fs.existsSync(functionsNodeBin) ? functionsNodeBin : process.execPath;
if (nodeBin === functionsNodeBin) {
  console.log("emulators:local-commerce: using functions pinned node@22");
} else {
  console.warn(
    "emulators:local-commerce: functions/node_modules/node missing; using host node",
  );
}
console.log(`emulators:local-commerce: FUNCTIONS_DISCOVERY_TIMEOUT=${env.FUNCTIONS_DISCOVERY_TIMEOUT}`);

const child = spawn(nodeBin, args, {
  cwd: root,
  env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 1));
