import type { SotongProduct } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: SotongProduct[] }) {
  if (products.length === 0) return null;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
