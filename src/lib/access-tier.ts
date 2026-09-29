import type { AccessTier, OpsStatus, PreviewPersona } from "@/types/access-tier";
import type { Locale } from "@/i18n/config";

export const accessTierLabels: Record<Locale, Record<AccessTier, string>> = {
  ko: { free: "무료", member: "회원", premium: "프리미엄" },
  en: { free: "Free", member: "Member", premium: "Premium" },
};

export const opsStatusLabels: Record<Locale, Record<OpsStatus, string>> = {
  ko: { live: "운영중", preparing: "준비중", comingSoon: "Coming soon" },
  en: { live: "Live", preparing: "Preparing", comingSoon: "Coming soon" },
};

export function parsePreviewPersona(raw: string | null | undefined): PreviewPersona {
  if (raw === "member" || raw === "premium") return raw;
  return "guest";
}

/**
 * Mock previewAccess switcher for local/dev only.
 * Production Hosting builds (NODE_ENV=production) never enable — URL ?previewAccess= is ignored.
 */
export function isPreviewPersonaEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.NEXT_PUBLIC_ENABLE_PREVIEW_PERSONA !== "false";
}
