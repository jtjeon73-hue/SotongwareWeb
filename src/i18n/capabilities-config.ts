export const CAPABILITY_SLUGS = [
  "industrial-automation",
  "smart-farm",
  "ai-software",
  "multiplatform-control",
] as const;

export type CapabilitySlug = (typeof CAPABILITY_SLUGS)[number];

export const CAPABILITY_HOME_IDS: Record<string, CapabilitySlug> = {
  industrial: "industrial-automation",
  smartfarm: "smart-farm",
  ai: "ai-software",
  platform: "multiplatform-control",
};

export function isCapabilitySlug(value: string): value is CapabilitySlug {
  return (CAPABILITY_SLUGS as readonly string[]).includes(value);
}
