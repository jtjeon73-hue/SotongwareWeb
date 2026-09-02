import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/navigation";
import { services } from "@/data/services";
import { getPublishedProducts } from "@/data/products";
import { CAPABILITY_SLUGS } from "@/i18n/capabilities-config";
import { locales } from "@/i18n/config";

export const dynamic = "force-static";

const basePaths = [
  "",
  "about",
  "contact",
  "process",
  "guide",
  "services",
  "products",
  "works",
  "solutions",
  "apps",
  "ebooks",
  "knowledge",
  "contents",
  "marketing",
  "automation",
  ...CAPABILITY_SLUGS.map((s) => `capabilities/${s}`),
];

const workSlugs = ["apps", "ebooks", "websites", "automation", "content"];
const solutionSlugs = ["digital-business", "business-automation", "ai-utilization", "industrial-solutions"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const productSlugs = getPublishedProducts().map((p) => `products/${p.slug}`);
  const serviceSlugs = services.map((s) => `services/${s.slug}`);
  const workPaths = workSlugs.map((s) => `works/${s}`);
  const solutionPaths = solutionSlugs.map((s) => `solutions/${s}`);

  const localeRoutes = locales.flatMap((locale) =>
    [...basePaths, ...productSlugs, ...serviceSlugs, ...workPaths, ...solutionPaths].map(
      (path) => `/${locale}${path ? `/${path}` : ""}`,
    ),
  );

  return localeRoutes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route.endsWith("/ko") || route.endsWith("/en") ? "weekly" : "monthly",
    priority: route.match(/\/(ko|en)$/) ? 1 : 0.7,
  }));
}
