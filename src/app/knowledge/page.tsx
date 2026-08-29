import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { knowledgeItems, knowledgeFields } from "@/data/knowledge";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "지식·교육",
  description: "무료·회원·유료·구독 교육 콘텐츠 — SotongWare 지식 사업",
  path: "/knowledge",
});

const TIERS = [
  { id: "free", label: "무료", desc: "검색 유입용 정보" },
  { id: "member", label: "회원전용", desc: "가입 회원 자료" },
  { id: "paid", label: "유료", desc: "구매자 전용" },
  { id: "subscription", label: "구독", desc: "월 정기결제 프리미엄" },
];

export default function KnowledgePage() {
  const published = knowledgeItems.filter((k) => k.status !== "draft");

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Knowledge & Education"
          title="지식·교육"
          description="무료 정보부터 회원·유료·구독 콘텐츠까지 — 반복수익형 지식 사업 구조입니다. 결제·회원 연동은 준비 중입니다."
        />

        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <div key={tier.id} className="rounded-xl border border-surface-200 p-4">
              <p className="font-semibold text-surface-900">{tier.label}</p>
              <p className="mt-1 text-sm text-surface-600">{tier.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">분야</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {knowledgeFields.map((field) => (
              <span key={field} className="rounded-lg bg-surface-100 px-3 py-1.5 text-sm text-surface-700">
                {field}
              </span>
            ))}
          </div>
        </div>

        {published.length > 0 ? (
          <ProductGrid products={published} />
        ) : (
          <ProductEmptyState
            type="knowledge"
            title="교육 콘텐츠가 준비되고 있습니다"
            description="무료·회원·유료·구독 콘텐츠가 검수 후 순차 공개됩니다."
          />
        )}

        <p className="mt-8 text-sm text-surface-500">
          <Link href="/ebooks" className="font-medium text-brand-600 hover:text-brand-700">
            관련 전자책 보기 →
          </Link>
        </p>
      </div>
    </div>
  );
}
