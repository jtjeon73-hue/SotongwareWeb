import type { SotongProduct } from "@/types/product";

export const contents: SotongProduct[] = [];

export function getContentBySlug(slug: string): SotongProduct | undefined {
  return contents.find((c) => c.slug === slug && c.type === "content");
}

export const contentCategories = [
  { id: "music", label: "AI 음악·노래" },
  { id: "shorts", label: "YouTube Shorts" },
  { id: "video", label: "일반 영상" },
  { id: "comic", label: "만화" },
  { id: "image", label: "이미지 콘텐츠" },
  { id: "ad", label: "광고·알림 영상" },
] as const;
