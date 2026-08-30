/**
 * Analytics abstraction — UI는 이 레이어만 호출한다.
 * GA Measurement ID가 없으면 no-op (가짜 ID 사용 금지).
 */

export type AnalyticsEventName =
  | "product_view"
  | "product_click"
  | "business_cta_click"
  | "business_detail_click"
  | "business_site_click"
  | "contact_start"
  | "contact_submit"
  | "contact_success"
  | "contact_error"
  | "contact_cta_click"
  | "knowledge_site_click"
  | "service_intent_click"
  | "store_link_click"
  | "external_product_click"
  | "commerce_channel_click"
  | "conversion_start"
  | "conversion_complete";

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

const SENSITIVE_KEYS = [
  "name",
  "email",
  "phone",
  "message",
  "company",
  "subject",
  "password",
];

function sanitizeParams(params: AnalyticsEventParams): AnalyticsEventParams {
  const clean: AnalyticsEventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) continue;
    if (value !== undefined) clean[key] = value;
  }
  return clean;
}

function isGaReady(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function trackEvent(name: AnalyticsEventName, params?: AnalyticsEventParams): void {
  const safe = sanitizeParams(params ?? {});

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", name, safe);
  }

  if (!isGaReady()) return;

  window.gtag!("event", name, safe);
}

export function trackPageView(path: string): void {
  if (!isGaReady()) return;
  window.gtag!("event", "page_view", { page_path: path });
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
