import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { Button } from "@/components/ui/Button";
import { automationCapabilities, automationPortfolio, automationProducts } from "@/data/automation";
import { createPageMetadata } from "@/lib/page-metadata";
import { StructuredData } from "@/components/common/StructuredData";
import { serviceJsonLd } from "@/lib/structured-data";

const PAGE_DESC = "PLC, MES, 설비 모니터링, 비전검사 — SotongWare 산업자동화";

export const metadata = createPageMetadata({
  title: "산업자동화",
  description: PAGE_DESC,
  path: "/automation",
});

export default function AutomationPage() {
  const published = automationProducts.filter((p) => p.status !== "draft");

  return (
    <>
      <StructuredData data={serviceJsonLd("SotongWare Industrial Automation", PAGE_DESC, "/automation")} />
      <div className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader
            eyebrow="Industrial Automation"
            title="산업자동화"
            description="SotongWare의 핵심 기술 역량 — PLC, HMI, MES, 설비 모니터링, 비전검사, 원격관리. B2B 구축·의뢰를 받습니다."
          />

          <section className="mb-12">
            <h2 className="text-lg font-bold text-surface-900">기술 영역</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {automationCapabilities.map((cap) => (
                <article key={cap.id} className="rounded-xl border border-brand-100 bg-brand-50/50 p-5">
                  <h3 className="font-semibold text-surface-900">{cap.title}</h3>
                  <p className="mt-2 text-sm text-surface-600">{cap.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-lg font-bold text-surface-900">구축 사례</h2>
            {automationPortfolio.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {automationPortfolio.map((item) => (
                  <li key={item.title} className="rounded-xl border border-surface-200 p-5">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-surface-600">{item.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-surface-600">
                구축 사례는 고객 승인 후 순차 공개됩니다.
              </p>
            )}
          </section>

          {published.length > 0 ? (
            <>
              <h2 className="text-lg font-bold text-surface-900">자동화 솔루션</h2>
              <div className="mt-6">
                <ProductGrid products={published} />
              </div>
            </>
          ) : (
            <ProductEmptyState
              type="automation"
              title="자동화 솔루션 카탈로그 준비 중"
              description="산업용 프로그램·솔루션이 검수 후 등록됩니다."
            />
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact?topic=automation" variant="primary" size="lg">
              자동화 상담
            </Button>
            <Button href="/contact?topic=quote" variant="outline" size="lg">
              견적 요청
            </Button>
            <Button href="/apps" variant="outline" size="lg">
              관련 산업용 앱
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
