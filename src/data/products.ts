import { apps } from "@/data/apps";
import { ebooks } from "@/data/ebooks";
import { knowledgeItems } from "@/data/knowledge";
import { contents } from "@/data/contents";
import { marketingProducts } from "@/data/marketing";
import { automationProducts } from "@/data/automation";
import type { AccessMode, ProductStatus, ProductType, SotongProduct } from "@/types/product";

export const allProducts: SotongProduct[] = [
  ...apps,
  ...ebooks,
  ...knowledgeItems,
  ...contents,
  ...marketingProducts,
  ...automationProducts,
];

export function getProductById(id: string): SotongProduct | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): SotongProduct | undefined {
  return allProducts.find((p) => p.slug === slug && p.status !== "draft");
}

export function getProductsByType(type: ProductType): SotongProduct[] {
  return allProducts.filter((p) => p.type === type && p.status !== "draft");
}

export function getPublishedProducts(): SotongProduct[] {
  return allProducts.filter((p) => p.status === "published" || p.status === "ready");
}

export interface ProductFilter {
  type?: ProductType | "all";
  accessMode?: AccessMode | "all";
  status?: ProductStatus | "all";
  query?: string;
}

export function filterProducts(filter: ProductFilter): SotongProduct[] {
  let list = allProducts.filter((p) => p.status !== "draft");

  if (filter.type && filter.type !== "all") {
    list = list.filter((p) => p.type === filter.type);
  }
  if (filter.accessMode && filter.accessMode !== "all") {
    list = list.filter((p) => p.accessMode === filter.accessMode);
  }
  if (filter.status && filter.status !== "all") {
    list = list.filter((p) => p.status === filter.status);
  }
  if (filter.query?.trim()) {
    const q = filter.query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return list;
}

export function getRelatedProducts(product: SotongProduct, limit = 4): SotongProduct[] {
  if (!product.relatedProductIds?.length) {
    return allProducts
      .filter((p) => p.id !== product.id && p.type === product.type && p.status !== "draft")
      .slice(0, limit);
  }
  return product.relatedProductIds
    .map((id) => getProductById(id))
    .filter((p): p is SotongProduct => !!p && p.status !== "draft")
    .slice(0, limit);
}
