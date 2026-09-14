/**
 * Site chrome version label — version only (no stale hardcoded update dates).
 * Keep in sync with package.json version when releasing.
 */
export const releaseInfo = {
  version: "0.1.1",
} as const;

export function getReleaseLabel(locale: "ko" | "en"): string {
  if (locale === "en") {
    return `SotongWare Web v${releaseInfo.version}`;
  }
  return `SotongWare Web v${releaseInfo.version}`;
}
