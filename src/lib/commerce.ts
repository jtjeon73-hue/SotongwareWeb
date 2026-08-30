import type { SotongProduct } from "@/types/product";
import type { CommerceChannel, CommerceChannelType } from "@/types/commerce";
import { hasValidUrl } from "@/lib/products";

export const COMMERCE_CHANNEL_LABELS: Record<CommerceChannelType, string> = {
  play_store: "Google Play",
  app_store: "App Store",
  ebook_store: "전자책 스토어",
  youtube: "YouTube",
  direct: "직접 구매",
  subscription: "구독",
  inquiry: "상담·문의",
  external_site: "전문 사이트",
};

export const COMMERCE_STATUS_LABELS: Record<CommerceChannel["status"], string> = {
  preparing: "출시 준비 중",
  active: "이용 가능",
  paused: "일시 중단",
};

export type RevenueDisplayBadge =
  | "free"
  | "paid"
  | "subscription"
  | "inquiry"
  | "member"
  | "launch_preparing"
  | "on_sale"
  | "testing";

export const REVENUE_BADGE_LABELS: Record<RevenueDisplayBadge, string> = {
  free: "무료",
  paid: "유료",
  subscription: "구독",
  inquiry: "상담",
  member: "회원전용",
  launch_preparing: "출시 준비",
  on_sale: "판매 중",
  testing: "테스트 중",
};

/** SotongProduct → commerceChannels (legacy storeLinks 호환) */
export function resolveCommerceChannels(product: SotongProduct): CommerceChannel[] {
  if (product.commerceChannels?.length) {
    return product.commerceChannels;
  }
  return legacyStoreLinksToChannels(product);
}

function legacyStoreLinksToChannels(product: SotongProduct): CommerceChannel[] {
  const channels: CommerceChannel[] = [];
  const { storeLinks } = product;

  if (storeLinks?.playStore && hasValidUrl(storeLinks.playStore)) {
    channels.push({
      type: "play_store",
      label: COMMERCE_CHANNEL_LABELS.play_store,
      url: storeLinks.playStore,
      status: "active",
      external: true,
    });
  } else if (product.type === "app") {
    channels.push({
      type: "play_store",
      label: COMMERCE_CHANNEL_LABELS.play_store,
      status: "preparing",
      external: true,
    });
  }

  if (storeLinks?.appStore && hasValidUrl(storeLinks.appStore)) {
    channels.push({
      type: "app_store",
      label: COMMERCE_CHANNEL_LABELS.app_store,
      url: storeLinks.appStore,
      status: "active",
      external: true,
    });
  }

  if (storeLinks?.youtube && hasValidUrl(storeLinks.youtube)) {
    channels.push({
      type: "youtube",
      label: COMMERCE_CHANNEL_LABELS.youtube,
      url: storeLinks.youtube,
      status: "active",
      external: true,
    });
  }

  storeLinks?.ebookStores?.forEach((store) => {
    if (hasValidUrl(store.url)) {
      channels.push({
        type: "ebook_store",
        label: store.name,
        url: store.url,
        status: "active",
        external: true,
      });
    }
  });

  return channels;
}

/** 상품 카드·상세 공통 revenue badge (중앙 파생) */
export function getRevenueDisplayBadges(product: SotongProduct): RevenueDisplayBadge[] {
  const badges: RevenueDisplayBadge[] = [];

  if (product.accessMode === "free") badges.push("free");
  else if (product.accessMode === "paid") badges.push("paid");
  else if (product.accessMode === "subscription") badges.push("subscription");
  else if (product.accessMode === "inquiry") badges.push("inquiry");
  else if (product.accessMode === "member") badges.push("member");

  if (product.status === "testing") badges.push("testing");
  else if (product.status === "ready") badges.push("launch_preparing");
  else if (product.status === "published") badges.push("on_sale");

  const channels = resolveCommerceChannels(product);
  const hasActiveStore = channels.some(
    (c) => c.status === "active" && c.url && c.type !== "inquiry",
  );
  if (hasActiveStore && !badges.includes("on_sale")) {
    badges.push("on_sale");
  }

  return [...new Set(badges)];
}

export function getActiveCommerceChannels(product: SotongProduct): CommerceChannel[] {
  return resolveCommerceChannels(product).filter(
    (c) => c.status === "active" && (c.url || !c.external),
  );
}

export function canInstallFromStore(product: SotongProduct): boolean {
  return resolveCommerceChannels(product).some(
    (c) =>
      (c.type === "play_store" || c.type === "app_store") &&
      c.status === "active" &&
      hasValidUrl(c.url),
  );
}

/** Sotong24Work 자동등록 payload 호환 */
export interface ProductRegistrationPayload {
  productType: SotongProduct["type"];
  title: string;
  slug: string;
  summary: string;
  status: SotongProduct["status"];
  updatedAt?: string;
  commerceChannels: CommerceChannel[];
}

export function toRegistrationPayload(product: SotongProduct): ProductRegistrationPayload {
  return {
    productType: product.type,
    title: product.title,
    slug: product.slug,
    summary: product.subtitle ?? product.description.slice(0, 200),
    status: product.status,
    updatedAt: product.updatedAt,
    commerceChannels: resolveCommerceChannels(product),
  };
}
