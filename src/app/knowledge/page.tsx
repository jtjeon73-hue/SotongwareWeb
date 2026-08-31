import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BusinessSiteBanner } from "@/components/business/BusinessSiteBanner";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { knowledgeItems, knowledgeFields } from "@/data/knowledge";
import { getBusinessById } from "@/data/businesses";
import { getExternalSiteUrl } from "@/lib/business-sites";
import { Button } from "@/components/ui/Button";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata = createPageMetadata({
  title: "지식·교육 서비스",
  description: "무료·회원·유료·구독 교육 콘텐츠 — SotongWare 지식 사업. 전문 서비스는 지식·교육 사이트에서 운영합니다.",
  path: "/knowledge",
});

const TIERS = [
  { id: "free", label: "무료", desc: "검색 유입용 정보", cta: "무료로 시작하기" },
  { id: "member", label: "회원전용", desc: "가입 회원 자료", cta: "회원 콘텐츠" },
  { id: "paid", label: "유료", desc: "구매자 전용", cta: "전문 자료" },
  { id: "subscription", label: "구독", desc: "월 정기결제 프리미엄", cta: "프리미엄" },
];

const CONTENT_RAILS = [
  { title: "무료로 시작하기", desc: "검색으로 찾아온 방문자를 위한 무료 정보" },
  { title: "최신 지식", desc: "분야별 최신 정보와 업데이트" },
  { title: "실전 가이드", desc: "현장과 실무에 바로 적용 가능한 가이드" },
  { title: "전문 자료", desc: "심화 학습을 위한 유료·회원 자료" },
];

export default function KnowledgePage() {
  const published = knowledgeItems.filter((k) => k.status !== "draft");
  const knowledgeArea = getBusinessById("knowledge");
  const externalUrl = knowledgeArea ? getExternalSiteUrl(knowledgeArea) : undefined;

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="Knowledge & Education"
          title="지식·교육"
          description="무료 정보부터 회원·유료·구독 콘텐츠까지 — 반복수익형 지식 사업 구조입니다. 실제 지식·교육 서비스는 지식·교육 사이트에서 운영합니다."
        />

        <BusinessSiteBanner businessId="knowledge" />

        {externalUrl && (
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-surface-900">지식·교육 사이트</p>
              <p className="mt-1 text-sm text-surface-600">
                지식·교육 전문 서비스 — 무료 정보, 회원·유료·구독 콘텐츠
              </p>
            </div>
            <Button href={externalUrl} variant="primary" className="min-h-11 shrink-0" external>
              지식·교육 사이트 ↗
            </Button>
          </div>
        )}

        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <div key={tier.id} className="rounded-xl border border-surface-200 p-4">
              <p className="font-semibold text-surface-900">{tier.label}</p>
              <p className="mt-1 text-sm text-surface-600">{tier.desc}</p>
              {tier.id === "member" && (
                <p className="mt-2 text-xs text-surface-500">향후 제공 예정</p>
              )}
              {(tier.id === "paid" || tier.id === "subscription") && (
                <p className="mt-2 text-xs text-surface-500">결제 기능 준비 중</p>
              )}
              {externalUrl && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  {tier.cta} ↗
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-bold text-surface-900">콘텐츠 영역</h2>
          <p className="mt-1 text-sm text-surface-600">향후 콘텐츠가 순차적으로 공개됩니다.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CONTENT_RAILS.map((rail) =>
              externalUrl ? (
                <a
                  key={rail.title}
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-surface-200 p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/30"
                >
                  <p className="font-semibold text-surface-900 group-hover:text-brand-700">{rail.title}</p>
                  <p className="mt-1 text-sm text-surface-600">{rail.desc}</p>
                </a>
              ) : (
                <div key={rail.title} className="rounded-xl border border-surface-200 p-4">
                  <p className="font-semibold text-surface-900">{rail.title}</p>
                  <p className="mt-1 text-sm text-surface-600">{rail.desc}</p>
                </div>
              ),
            )}
          </div>
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
            description="무료·회원·유료·구독 콘텐츠가 검수 후 순차 공개됩니다. 지식·교육 사이트에서 먼저 확인해 보세요."
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
