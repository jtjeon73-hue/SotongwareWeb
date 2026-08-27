import type { WorkItem } from "@/types";

/**
 * SotongWare 결과물 데이터.
 * 향후 Firestore, CMS, Sotong24Work API로 교체 가능.
 */
export const works: WorkItem[] = [];

export const featuredWorks: WorkItem[] = works.filter((w) => w.featured);

export function getWorksByType(type: WorkItem["type"]): WorkItem[] {
  return works.filter((w) => w.type === type && w.status === "published");
}
