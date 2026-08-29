import type { SotongProduct } from "@/types/product";

export const knowledgeItems: SotongProduct[] = [];

export function getKnowledgeBySlug(slug: string): SotongProduct | undefined {
  return knowledgeItems.find((k) => k.slug === slug && k.type === "knowledge");
}

export const knowledgeFields = [
  "AI 활용법",
  "프로그래밍",
  "앱 개발",
  "산업자동화",
  "PLC",
  "전기기술",
  "디지털 사업",
  "시골생활 기술",
  "실전 노하우",
] as const;
