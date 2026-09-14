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

export const previewPersonaLabels: Record<Locale, Record<PreviewPersona, string>> = {
  ko: { guest: "비회원 Preview", member: "회원 Preview", premium: "프리미엄 Preview" },
  en: { guest: "Guest preview", member: "Member preview", premium: "Premium preview" },
};

export function parsePreviewPersona(raw: string | null | undefined): PreviewPersona {
  if (raw === "member" || raw === "premium") return raw;
  return "guest";
}
