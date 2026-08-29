import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/navigation";
import { services } from "@/data/services";

export const dynamic = "force-static";

const staticRoutes = [
  "/",
  "/services",
  "/works",
  "/solutions",
  "/insights",
  "/about",
  "/ai-guide",
  "/contact",
  "/privacy",
  "/terms",
];

const workSlugs = ["apps", "ebooks", "websites", "automation", "content"];
const solutionSlugs = ["digital-business", "business-automation", "ai-utilization", "industrial-solutions"];
const insightSlugs = ["tech", "industrial", "digital"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const routes = [
    ...staticRoutes,
    ...services.map((s) => `/services/${s.slug}`),
    ...workSlugs.map((s) => `/works/${s}`),
    ...solutionSlugs.map((s) => `/solutions/${s}`),
    ...insightSlugs.map((s) => `/insights/${s}`),
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
