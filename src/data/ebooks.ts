import type { SotongProduct } from "@/types/product";

export const ebooks: SotongProduct[] = [];

export function getEbookBySlug(slug: string): SotongProduct | undefined {
  return ebooks.find((e) => e.slug === slug && e.type === "ebook");
}
