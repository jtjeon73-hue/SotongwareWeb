import { ProductsEmptyState } from "@/components/shared/ProductsEmptyState";
import type { ProductType } from "@/types/product";

interface ProductEmptyStateProps {
  type?: ProductType;
  /** Locale-aware label from venture/page dictionary */
  typeLabel?: string;
  title?: string;
  description?: string;
}

/** Venture pages — prefer passing `typeLabel` from ventureLabels[locale] */
export function ProductEmptyState({ typeLabel }: ProductEmptyStateProps) {
  return <ProductsEmptyState typeLabel={typeLabel} />;
}
