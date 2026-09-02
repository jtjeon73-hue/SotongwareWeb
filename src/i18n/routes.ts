import { CAPABILITY_SLUGS } from "./capabilities-config";

/** Public pages that must exist under /ko and /en (auth excluded) */
export const PUBLIC_LOCALE_ROUTES = [
  "",
  "about",
  "contact",
  "process",
  "guide",
  "privacy",
  "terms",
  "services",
  "products",
  "works",
  "solutions",
  "automation",
  "apps",
  "ebooks",
  "marketing",
  "contents",
  "knowledge",
  ...CAPABILITY_SLUGS.map((s) => `capabilities/${s}`),
] as const;

export const SERVICE_SLUGS = [
  "industrial-automation",
  "app-development",
  "web-development",
  "ebook-development",
  "content-development",
] as const;

export const WORK_SLUGS = ["apps", "ebooks", "websites", "automation", "content"] as const;

export const SOLUTION_SLUGS = [
  "digital-business",
  "business-automation",
  "ai-utilization",
  "industrial-solutions",
] as const;
