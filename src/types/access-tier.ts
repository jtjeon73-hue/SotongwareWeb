/** Shared access-tier model for ebook / knowledge / content service surfaces. */
export type AccessTier = "free" | "member" | "premium";

export type OpsStatus = "live" | "preparing" | "comingSoon";

/** Preview-only persona — never treated as real Auth entitlement. */
export type PreviewPersona = "guest" | "member" | "premium";

export const ACCESS_TIER_RANK: Record<AccessTier, number> = {
  free: 0,
  member: 1,
  premium: 2,
};

export const PREVIEW_PERSONA_TIER: Record<PreviewPersona, AccessTier> = {
  guest: "free",
  member: "member",
  premium: "premium",
};

export function tierMeetsRequirement(userTier: AccessTier, required: AccessTier): boolean {
  return ACCESS_TIER_RANK[userTier] >= ACCESS_TIER_RANK[required];
}

export function personaToTier(persona: PreviewPersona): AccessTier {
  return PREVIEW_PERSONA_TIER[persona];
}
