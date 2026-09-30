/**
 * Knowledge Basic member rail — PUBLIC META ONLY.
 *
 * No body text lives here. The unified learning rail text is served by the
 * `getKnowledgeMemberBody` Callable after server-side membership/admin authz.
 * Prices come from the commerce SSOT (src/lib/commerce-policy) — never hard-coded here.
 */
import {
  MEMBERSHIP_MONTHLY_PRODUCT,
  MEMBERSHIP_YEARLY_PRODUCT,
} from "@/lib/commerce-policy";
import type { LocalizedText } from "./types";

export const KNOWLEDGE_MEMBER_GUIDE_ID = "unified-learning-rail";

/** Prepaid term lengths (mirror of functions MEMBERSHIP_TERM_DAYS — not auto-billing cycles). */
export const KNOWLEDGE_MEMBER_TERM_DAYS = { monthly: 30, annual: 365 } as const;

export interface KnowledgeMemberPlanMeta {
  productId: string;
  amount: number;
  termDays: number;
  label: LocalizedText;
  /** Always false — prepaid term, recurring billing not implemented. */
  autoRenew: false;
}

export interface KnowledgeMemberRailMeta {
  guideId: string;
  title: LocalizedText;
  summary: LocalizedText;
  /** Route titles only — teaser for guests; no body copy. */
  routeTitles: LocalizedText[];
  plans: KnowledgeMemberPlanMeta[];
}

export const knowledgeMemberRailMeta: KnowledgeMemberRailMeta = {
  guideId: KNOWLEDGE_MEMBER_GUIDE_ID,
  title: { ko: "통합 학습 레일", en: "Unified learning rail" },
  summary: {
    ko: "열두 개 공개 허브를 목적별 순서로 엮은 Basic 회원 전용 학습 안내서입니다.",
    en: "A Basic-member study guide that strings the twelve public hubs into goal-based routes.",
  },
  routeTitles: [
    { ko: "AI에서 개발로", en: "From AI to development" },
    { ko: "전기에서 PLC, 스마트팜으로", en: "Electrical to PLC to smart farm" },
    { ko: "영어에서 AI 활용으로", en: "From English to working with AI" },
    { ko: "모빌리티·차량 기초", en: "Mobility and car basics" },
    { ko: "생활·절약과 일상 설계", en: "Life, savings, and daily design" },
    { ko: "건강·금융 일반 정보 읽기 (교육용)", en: "Reading health & finance info (educational)" },
  ],
  plans: [
    {
      productId: MEMBERSHIP_MONTHLY_PRODUCT.id,
      amount: MEMBERSHIP_MONTHLY_PRODUCT.amount,
      termDays: KNOWLEDGE_MEMBER_TERM_DAYS.monthly,
      label: { ko: "Basic 월간", en: "Basic monthly" },
      autoRenew: false,
    },
    {
      productId: MEMBERSHIP_YEARLY_PRODUCT.id,
      amount: MEMBERSHIP_YEARLY_PRODUCT.amount,
      termDays: KNOWLEDGE_MEMBER_TERM_DAYS.annual,
      label: { ko: "Basic 연간", en: "Basic yearly" },
      autoRenew: false,
    },
  ],
};
