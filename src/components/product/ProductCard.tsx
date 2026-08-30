"use client";

import Link from "next/link";
import type { SotongProduct } from "@/types/product";
import { productDetailPath, formatPrice } from "@/lib/products";
import { trackEvent } from "@/lib/analytics";
import { ProductStatusBadge, AccessModeBadge, AppReleaseBadge } from "./ProductBadges";
import { ServiceIcon } from "@/components/ui/Icons";

interface ProductCardProps {
  product: SotongProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const href = productDetailPath(product);

  return (
    <article className="group flex flex-col rounded-xl border border-surface-200 bg-white transition-colors hover:border-brand-300 hover:shadow-sm">
      <Link
        href={href}
        className="flex flex-1 flex-col p-5"
        onClick={() =>
          trackEvent("product_click", {
            product_id: product.id,
            product_type: product.type,
            product_slug: product.slug,
          })
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-brand-600 group-hover:bg-brand-50">
            {product.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.thumbnail} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : (
              <ServiceIcon name={product.type === "app" ? "app" : product.type === "ebook" ? "ebook" : "info"} />
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            <AccessModeBadge accessMode={product.accessMode} />
            <ProductStatusBadge status={product.status} />
          </div>
        </div>
        <h3 className="mt-4 text-base font-semibold text-surface-900 group-hover:text-brand-700">
          {product.title}
        </h3>
        {product.subtitle && (
          <p className="mt-1 text-sm text-brand-600">{product.subtitle}</p>
        )}
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-surface-600">
          {product.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-surface-100 pt-4">
          <span className="text-sm font-semibold text-surface-900">{formatPrice(product)}</span>
          {product.appMeta?.releaseStatus && (
            <AppReleaseBadge status={product.appMeta.releaseStatus} />
          )}
          {product.category && (
            <span className="text-xs text-surface-500">{product.category}</span>
          )}
        </div>
      </Link>
    </article>
  );
}
