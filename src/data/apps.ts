import type { SotongProduct } from "@/types/product";

/** SotongWare 제작 앱 — 향후 Sotong24Work 자동 등록 */
export const apps: SotongProduct[] = [];

export function getAppBySlug(slug: string): SotongProduct | undefined {
  return apps.find((a) => a.slug === slug && a.type === "app");
}
