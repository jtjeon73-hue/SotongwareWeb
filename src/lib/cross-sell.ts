import type { ProductType } from "@/types/product";
import { getBusinessById } from "@/data/businesses";
import { getExternalSiteUrl } from "@/lib/business-sites";

export interface CrossSellItem {
  businessId: ProductType;
  titleKo: string;
  reason: string;
  internalPath: string;
  externalSiteUrl?: string;
  externalSiteLabel?: string;
}

const CROSS_SELL_IDS: Record<ProductType, ProductType[]> = {
  app: ["app", "automation"],
  automation: ["automation", "app"],
  ebook: ["ebook", "knowledge"],
  knowledge: ["knowledge", "ebook"],
  content: ["content", "marketing"],
  marketing: ["marketing", "content"],
};

const CROSS_SELL_REASONS: Record<ProductType, string> = {
  automation: "산업자동화 상담·견적",
  app: "이런 앱 제작 상담",
  ebook: "전자책 제작·판매",
  knowledge: "무료·회원·구독 지식 서비스",
  marketing: "홍보·마케팅 상담",
  content: "콘텐츠 제작 의뢰",
};

export function getCrossSellItems(productType: ProductType): CrossSellItem[] {
  const ids = CROSS_SELL_IDS[productType] ?? [productType];
  const seen = new Set<string>();
  const items: CrossSellItem[] = [];

  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const area = getBusinessById(id);
    if (!area) continue;
    items.push({
      businessId: id,
      titleKo: area.titleKo,
      reason: CROSS_SELL_REASONS[id] ?? area.tagline,
      internalPath: area.internalPath,
      externalSiteUrl: getExternalSiteUrl(area),
      externalSiteLabel: area.externalSiteLabel,
    });
  }

  return items;
}
