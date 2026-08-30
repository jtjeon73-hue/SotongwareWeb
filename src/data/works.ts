/**
 * @deprecated Works는 Product 중앙 데이터(allProducts)에서 파생합니다.
 * 호환용 stub — 새 코드는 @/lib/product-catalog 또는 @/data/products 사용.
 */
import { getVisibleProducts } from "@/lib/product-catalog";

export const works = getVisibleProducts();
