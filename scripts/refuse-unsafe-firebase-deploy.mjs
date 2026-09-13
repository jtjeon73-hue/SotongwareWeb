/**
 * Fail-closed stub: refuses legacy broad Functions/Hosting/Rules deploy scripts.
 * Use: npm run deploy:functions:auth-membership -- --check-only
 * Live deploy only with explicit user approval:
 *   npm run deploy:functions:auth-membership -- --confirm-deploy
 */
console.error(
  [
    "Refusing unsafe deploy script.",
    "Initial Auth Functions deploy allowlist is membership-only:",
    "  ensureMyMemberProfile, provisionMemberProfile",
    "submitContactInquiry is excluded until App Check + rate limits ship.",
    "Hosting/Rules are not part of this command.",
    "",
    "Safe check (no deploy):",
    "  npm run deploy:functions:auth-membership:check",
    "User-approved live deploy (do not run unless explicitly approved):",
    "  npm run deploy:functions:auth-membership -- --confirm-deploy",
  ].join("\n"),
);
process.exit(1);
