/**
 * Sotong24Work → SotongWare 상품 자동 등록 수신 구조 (인터페이스만).
 * Sotong24Work 코드는 수정하지 않는다.
 */

import type { ProductType, ProductStatus } from "@/types/product";

export interface PublisherIngestPayload {
  productType: ProductType;
  title: string;
  slug: string;
  version?: string;
  status: ProductStatus;
  description: string;
  thumbnail?: string;
  artifactUrl?: string;
  storeUrl?: string | null;
  accessMode?: "free" | "paid" | "subscription" | "inquiry";
  metadata?: Record<string, unknown>;
}

export interface PublisherIngestResult {
  success: boolean;
  productId?: string;
  message?: string;
}

/** 향후 Firebase Functions / API endpoint에서 구현 */
export interface ProductPublisherAdapter {
  ingest(payload: PublisherIngestPayload): Promise<PublisherIngestResult>;
  updateStoreUrl(productId: string, storeUrl: string): Promise<boolean>;
}
