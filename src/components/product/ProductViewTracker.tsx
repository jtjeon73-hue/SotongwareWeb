"use client";

import { useEffect } from "react";
import type { SotongProduct } from "@/types/product";
import { trackEvent } from "@/lib/analytics";

export function ProductViewTracker({ product }: { product: SotongProduct }) {
  useEffect(() => {
    trackEvent("product_view", {
      product_id: product.id,
      product_type: product.type,
      product_slug: product.slug,
      access_mode: product.accessMode,
      status: product.status,
    });
  }, [product]);

  return null;
}
