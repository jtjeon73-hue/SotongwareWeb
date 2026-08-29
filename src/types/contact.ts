export const INQUIRY_TYPES = [
  { value: "automation", label: "산업자동화" },
  { value: "app", label: "앱 개발" },
  { value: "ebook", label: "전자책" },
  { value: "website", label: "웹사이트" },
  { value: "knowledge", label: "지식·교육" },
  { value: "content", label: "콘텐츠 제작" },
  { value: "marketing", label: "마케팅" },
  { value: "general", label: "기타" },
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number]["value"];

export const INQUIRY_TYPE_VALUES: InquiryType[] = INQUIRY_TYPES.map((t) => t.value);

/** URL query topic → inquiryType 매핑 */
export const TOPIC_TO_INQUIRY: Record<string, InquiryType> = {
  automation: "automation",
  quote: "automation",
  app: "app",
  ebook: "ebook",
  website: "website",
  knowledge: "knowledge",
  content: "content",
  marketing: "marketing",
  general: "general",
};

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
  privacyConsent: boolean;
  /** honeypot — 정상 사용자는 비어 있음 */
  website?: string;
}

export interface ContactSubmitPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
  source: string;
  sourcePage?: string;
  productSlug?: string;
  website?: string;
}
