import type { SotongProduct } from "@/types/product";

/**
 * @deprecated Product-type content list — SSOT for media hub is
 * `src/data/service-catalog/contents.ts` (`contentCatalog`).
 * Kept empty so `/products` aggregation stays stable until Phase 2 registers
 * real SotongProduct content rows via Publication Gate.
 */
export const contents: SotongProduct[] = [];

/** @deprecated Use `getContentBySlug` from `@/data/service-catalog` for hub items. */
export function getContentProductBySlug(slug: string): SotongProduct | undefined {
  return contents.find((c) => c.slug === slug && c.type === "content");
}

/** @deprecated Prefer `contentUiCategories` from service-catalog. */
export const contentCategories = [
  { id: "shorts", label: "쇼츠" },
  { id: "music", label: "음악" },
  { id: "comic", label: "만화" },
  { id: "video", label: "영상" },
  { id: "image", label: "이미지" },
  { id: "game", label: "게임" },
] as const;
