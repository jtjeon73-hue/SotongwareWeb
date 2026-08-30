/** 판매·배포·전환 채널 유형 */
export type CommerceChannelType =
  | "play_store"
  | "app_store"
  | "ebook_store"
  | "youtube"
  | "direct"
  | "subscription"
  | "inquiry"
  | "external_site";

export type CommerceChannelStatus = "preparing" | "active" | "paused";

export interface CommerceChannel {
  type: CommerceChannelType;
  label: string;
  url?: string;
  status: CommerceChannelStatus;
  /** true: 외부 URL, false: SotongWare 내부 경로 */
  external: boolean;
}

export type ConversionStatus = "active" | "preparing";

export interface BusinessConversion {
  businessId: string;
  mainConversion: string;
  label: string;
  href?: string;
  status: ConversionStatus;
}
