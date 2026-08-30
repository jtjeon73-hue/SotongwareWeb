import { ProductsEmptyState } from "@/components/shared/ProductsEmptyState";
import type { ProductType } from "@/types/product";

interface ProductEmptyStateProps {
  type?: ProductType;
  title?: string;
  description?: string;
}

const TYPE_LABELS: Partial<Record<ProductType, string>> = {
  app: "앱",
  ebook: "전자책",
  knowledge: "교육 콘텐츠",
  content: "콘텐츠",
  marketing: "마케팅 상품",
  automation: "자동화 솔루션",
};

/** @deprecated ProductsEmptyState 사용 권장 */
export function ProductEmptyState({ type }: ProductEmptyStateProps) {
  return <ProductsEmptyState typeLabel={type ? TYPE_LABELS[type] : undefined} />;
}
