/**
 * Detect Functions Emulator without weakening cloud omit defaults.
 * Prefer FUNCTIONS_EMULATOR; also accept FIREBASE_EMULATOR_HUB set by the CLI.
 */
export function isFunctionsEmulatorRuntime(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  if (env.FUNCTIONS_EMULATOR === "true") return true;
  if (typeof env.FIREBASE_EMULATOR_HUB === "string" && env.FIREBASE_EMULATOR_HUB.length > 0) {
    return true;
  }
  return false;
}
