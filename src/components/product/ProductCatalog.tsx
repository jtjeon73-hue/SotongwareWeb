"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { filterProducts } from "@/data/products";
import type { AccessMode, ProductType, SotongProduct } from "@/types/product";
import {
  getVisibleProducts,
  getProductCountTier,
  getFeaturedProducts,
  getPreparingProducts,
  getRecentlyUpdatedProducts,
  getMerchandiseTitle,
} from "@/lib/product-catalog";
import { ProductGrid } from "./ProductGrid";
import { ProductsEmptyState } from "@/components/shared/ProductsEmptyState";
import { ProductCard } from "./ProductCard";

const TYPE_OPTIONS: { value: ProductType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "app", label: "앱" },
  { value: "ebook", label: "전자책" },
  { value: "knowledge", label: "교육" },
  { value: "content", label: "콘텐츠" },
  { value: "automation", label: "자동화" },
  { value: "marketing", label: "마케팅" },
];

const ACCESS_OPTIONS: { value: AccessMode | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "free", label: "무료" },
  { value: "paid", label: "유료" },
  { value: "subscription", label: "구독" },
  { value: "inquiry", label: "상담" },
];

interface ProductCatalogProps {
  initialType?: ProductType | "all";
  initialAccess?: AccessMode | "all";
}

export function ProductCatalog({
  initialType = "all",
  initialAccess = "all",
}: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") as ProductType | null;
  const urlAccess = searchParams.get("access") as AccessMode | null;

  const [type, setType] = useState<ProductType | "all">(initialType);
  const [accessMode, setAccessMode] = useState<AccessMode | "all">(initialAccess);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (urlType) setType(urlType);
    if (urlAccess) setAccessMode(urlAccess);
  }, [urlType, urlAccess]);

  const allVisible = useMemo(() => getVisibleProducts(), []);
  const tier = getProductCountTier(allVisible.length);

  const products = useMemo(
    () => filterProducts({ type, accessMode, query }),
    [type, accessMode, query],
  );

  const showMerchandising = type === "all" && !query.trim() && tier !== "empty";

  return (
    <div>
      {showMerchandising && (
        <div className="mb-8 space-y-6">
          <MerchandiseSection
            title={getMerchandiseTitle(tier, "featured")}
            description={
              tier === "single"
                ? "현재 공개 중인 SotongWare 디지털 제품입니다."
                : "실제 제작·검증 중이거나 공개된 제품입니다."
            }
            products={getFeaturedProducts(allVisible)}
          />
          {getPreparingProducts(allVisible).length > 0 && (
            <MerchandiseSection
              title={getMerchandiseTitle(tier, "preparing")}
              description="출시 전 검증·준비 단계의 제품입니다."
              products={getPreparingProducts(allVisible)}
              compact
            />
          )}
          {tier === "many" && getRecentlyUpdatedProducts(allVisible, 3).length > 0 && (
            <MerchandiseSection
              title={getMerchandiseTitle(tier, "recent")}
              products={getRecentlyUpdatedProducts(allVisible, 3)}
              compact
            />
          )}
        </div>
      )}

      <div className="mb-6 space-y-4 rounded-xl border border-surface-200 bg-white p-4 sm:p-5">
        <div>
          <label htmlFor="product-search" className="sr-only">상품 검색</label>
          <input
            id="product-search"
            type="search"
            placeholder="상품명, 설명, 태그 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-surface-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs font-semibold uppercase tracking-wider text-surface-500 sm:w-auto sm:self-center">유형</span>
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`min-h-11 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:min-h-0 ${
                type === opt.value
                  ? "bg-brand-600 text-white"
                  : "bg-surface-100 text-surface-700 hover:bg-surface-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="w-full text-xs font-semibold uppercase tracking-wider text-surface-500 sm:w-auto sm:self-center">접근</span>
          {ACCESS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAccessMode(opt.value)}
              className={`min-h-11 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:min-h-0 ${
                accessMode === opt.value
                  ? "bg-brand-600 text-white"
                  : "bg-surface-100 text-surface-700 hover:bg-surface-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-surface-600">{products.length}개 상품</p>
          <ProductGrid products={products} />
        </>
      ) : (
        <ProductsEmptyState />
      )}
    </div>
  );
}

function MerchandiseSection({
  title,
  description,
  products,
  compact,
}: {
  title: string;
  description?: string;
  products: SotongProduct[];
  compact?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-surface-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-surface-600">{description}</p>}
      <div className={`mt-4 grid gap-4 ${compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
