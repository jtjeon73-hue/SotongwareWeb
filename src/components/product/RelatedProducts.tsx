import Link from "next/link";
import type { SotongProduct } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({
  products,
  title = "관련 상품",
}: {
  products: SotongProduct[];
  title?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mt-12 border-t border-surface-200 pt-10" aria-labelledby="related-products">
      <h2 id="related-products" className="text-lg font-bold text-surface-900">
        {title}
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <p className="mt-4">
        <Link href="/products" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          전체 상품 보기 →
        </Link>
      </p>
    </section>
  );
}
