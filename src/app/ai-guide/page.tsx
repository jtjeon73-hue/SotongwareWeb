import type { Metadata } from "next";
import Link from "next/link";
import { aiGuideOptions } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "AI Guide",
  description: "목적에 맞는 SotongWare 서비스와 결과물 안내",
};

export default function AiGuidePage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-3xl">
        <SectionHeader
          title="SotongWare AI Guide"
          description="어떤 서비스가 필요한지 선택하세요. 향후 AI가 요구사항을 분석하고 관련 결과물을 추천합니다. 현재는 목적별 안내 페이지로 연결됩니다."
        />
        <div className="space-y-3">
          {aiGuideOptions.map((option) => (
            <Link
              key={option.id}
              href={option.href}
              className="block rounded-xl border border-surface-200 p-5 hover:border-brand-300 hover:bg-brand-50 transition-colors"
            >
              <p className="font-semibold text-surface-900">{option.label}</p>
              <p className="mt-1 text-sm text-surface-600">{option.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
