import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "문의",
  description: "SotongWare 제작 의뢰, 견적, 상담 문의",
  path: "/contact",
});

const TOPICS = [
  { id: "automation", label: "산업자동화 상담" },
  { id: "quote", label: "견적 요청" },
  { id: "app", label: "앱 개발 의뢰" },
  { id: "ebook", label: "전자책 제작" },
  { id: "marketing", label: "마케팅 상담" },
  { id: "content", label: "콘텐츠 제작" },
  { id: "general", label: "일반 문의" },
];

export default function ContactPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-2xl">
        <SectionHeader
          title="문의·제작 의뢰"
          description="자동 안내로 해결되지 않는 경우 문의해 주세요. 문의 폼·이메일 연동은 추후 추가됩니다."
        />
        <p className="mb-6 text-sm text-surface-600">
          먼저{" "}
          <Link href="/ai-guide" className="font-medium text-brand-600 hover:text-brand-700">
            목적별 안내
          </Link>
          또는{" "}
          <Link href="/products" className="font-medium text-brand-600 hover:text-brand-700">
            디지털 상품
          </Link>
          을 확인해 보세요.
        </p>
        <div className="space-y-3">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between rounded-xl border border-surface-200 p-4"
            >
              <span className="font-medium text-surface-900">{topic.label}</span>
              <span className="text-xs text-surface-500">준비 중</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/ai-guide" variant="primary">목적별 안내</Button>
          <Button href="/" variant="outline">홈으로</Button>
        </div>
      </div>
    </div>
  );
}
