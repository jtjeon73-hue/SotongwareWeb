import type { Locale } from "@/i18n/config";
import { catalogUi, ACCESS_LABELS, STATUS_LABELS } from "@/i18n/product-labels";
import type { SotongProduct } from "@/types/product";
import type { LocaleContent } from "@/types/catalog";

export interface ProductLocaleFields {
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  priceLabel?: string;
  features?: string[];
}

export interface SotongProductI18n {
  en?: ProductLocaleFields;
  ko?: ProductLocaleFields;
}

export function pickLocaleContent<T>(content: LocaleContent<T> | undefined, locale: Locale, fallback: T): T {
  if (!content) return fallback;
  return content[locale] ?? content.ko ?? fallback;
}

export function getLocalizedProduct(product: SotongProduct, locale: Locale) {
  const i18n = (product as SotongProduct & { i18n?: SotongProductI18n }).i18n;
  const fields = locale === "en" ? i18n?.en : i18n?.ko;

  return {
    title: fields?.title ?? product.title,
    subtitle: fields?.subtitle ?? product.subtitle,
    description: fields?.description ?? product.description,
    category: fields?.category ?? product.category,
    priceLabel: fields?.priceLabel ?? product.priceLabel,
    features: fields?.features ?? product.appMeta?.features,
  };
}

export function formatProductPrice(product: SotongProduct, locale: Locale): string {
  const localized = getLocalizedProduct(product, locale);
  const ui = catalogUi[locale];

  if (localized.priceLabel) return localized.priceLabel;
  if (product.accessMode === "free") return ACCESS_LABELS[locale].free;
  if (product.accessMode === "inquiry") return ui.priceConsult;
  if (product.accessMode === "subscription") return ACCESS_LABELS[locale].subscription;
  if (product.price != null) {
    const loc = locale === "en" ? "en-US" : "ko-KR";
    return new Intl.NumberFormat(loc, {
      style: "currency",
      currency: product.currency ?? "KRW",
      maximumFractionDigits: 0,
    }).format(product.price);
  }
  return ui.priceInquiry;
}

export function getProductSearchText(product: SotongProduct, locale: Locale): string {
  const localized = getLocalizedProduct(product, locale);
  const ko = getLocalizedProduct(product, "ko");
  const en = getLocalizedProduct(product, "en");
  return [localized.title, localized.description, ko.title, en.title, product.tags?.join(" ")]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getStatusLabel(status: SotongProduct["status"], locale: Locale): string {
  return STATUS_LABELS[locale][status];
}
