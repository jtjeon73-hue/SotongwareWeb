import type { SotongProduct } from "@/types/product";

export function productDetailPath(product: SotongProduct): string {
  return `/products/${product.slug}`;
}

export function formatPrice(product: SotongProduct): string {
  if (product.priceLabel) return product.priceLabel;
  if (product.accessMode === "free") return "무료";
  if (product.accessMode === "inquiry") return "상담 후 결정";
  if (product.accessMode === "subscription") return "구독";
  if (product.price != null) {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: product.currency ?? "KRW",
      maximumFractionDigits: 0,
    }).format(product.price);
  }
  return "가격 문의";
}

export function hasValidUrl(url?: string): url is string {
  if (!url?.trim()) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const STATUS_LABELS: Record<SotongProduct["status"], string> = {
  draft: "준비 중",
  testing: "테스트 중",
  ready: "출시 준비",
  published: "서비스 중",
  archived: "종료",
};

export const ACCESS_LABELS: Record<SotongProduct["accessMode"], string> = {
  free: "무료",
  member: "회원전용",
  paid: "유료",
  subscription: "구독",
  inquiry: "상담",
};

export const APP_RELEASE_LABELS: Record<string, string> = {
  development: "개발 중",
  testing: "테스트 중",
  ready: "출시 준비",
  "play-store": "Play Store 등록",
  live: "서비스 중",
  "update-planned": "업데이트 예정",
};
