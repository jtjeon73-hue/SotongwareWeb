import type { SotongProduct } from "@/types/product";
import { allProducts } from "@/data/products";
import { isProductPublic } from "@/lib/publication-eligibility";

export type ProductCountTier = "empty" | "single" | "few" | "many";

/** 공개 승인 Gate를 통과한 상품만 반환 (fail-closed) */
export function getVisibleProducts(): SotongProduct[] {
  return allProducts.filter(isProductPublic);
}

export function getProductCountTier(count?: number): ProductCountTier {
  const n = count ?? getVisibleProducts().length;
  if (n === 0) return "empty";
  if (n === 1) return "single";
  if (n <= 5) return "few";
  return "many";
}

export function getFeaturedProducts(products = getVisibleProducts()): SotongProduct[] {
  const featured = products.filter((p) => p.featured);
  return featured.length > 0 ? featured : products;
}

export function getPreparingProducts(products = getVisibleProducts()): SotongProduct[] {
  return products.filter((p) => p.status === "testing" || p.status === "ready");
}

export function getPublishedOrReadyProducts(products = getVisibleProducts()): SotongProduct[] {
  return products.filter((p) => p.status === "published" || p.status === "ready");
}

export function getRecentlyUpdatedProducts(
  products = getVisibleProducts(),
  limit = 6,
): SotongProduct[] {
  return [...products]
    .sort((a, b) => (b.updatedAt ?? b.publishedAt ?? "").localeCompare(a.updatedAt ?? a.publishedAt ?? ""))
    .slice(0, limit);
}

export function getWorksSectionCopy(tier: ProductCountTier) {
  switch (tier) {
    case "empty":
      return {
        eyebrow: "SotongWare Works",
        title: "검증된 디지털 결과물을 준비하고 있습니다",
        description:
          "품질과 정책 검토를 완료한 결과물만 공개합니다. 가짜 데이터는 등록하지 않습니다.",
      };
    case "single":
      return {
        eyebrow: "SotongWare Works",
        title: "직접 만들고 검증하는 결과물",
        description: "현재 공개 중인 SotongWare 디지털 제품입니다.",
      };
    case "few":
      return {
        eyebrow: "SotongWare Works",
        title: "직접 만들고 검증하는 결과물",
        description: "SotongWare에서 실제 제작·검증 중인 제품과 콘텐츠를 공개합니다.",
      };
    default:
      return {
        eyebrow: "SotongWare Works",
        title: "SotongWare 결과물",
        description: "앱, 전자책, 교육, 콘텐츠, 자동화 — 실제 제작·검증된 결과물 카탈로그입니다.",
      };
  }
}

export function getMerchandiseTitle(tier: ProductCountTier, kind: "featured" | "preparing" | "recent") {
  if (kind === "featured") {
    return tier === "single" ? "현재 공개 중인 제품" : "현재 공개";
  }
  if (kind === "preparing") return "새로 준비 중";
  return "최근 업데이트";
}
