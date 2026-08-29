import { SectionHeader } from "@/components/ui/SectionHeader";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { Button } from "@/components/ui/Button";
import { marketingServices, marketingTiers } from "@/data/marketing";
import { createPageMetadata } from "@/lib/page-metadata";
import { StructuredData } from "@/components/common/StructuredData";
import { serviceJsonLd } from "@/lib/structured-data";

const PAGE_DESC = "SEO, Shorts, 홍보 영상, 랜딩페이지 — SotongWare 마케팅 서비스";

export const metadata = createPageMetadata({
  title: "마케팅",
  description: PAGE_DESC,
  path: "/marketing",
});

export default function MarketingPage() {
  return (
    <>
      <StructuredData data={serviceJsonLd("SotongWare Marketing", PAGE_DESC, "/marketing")} />
      <div className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader
            eyebrow="Marketing Services"
            title="마케팅"
            description="홈페이지 홍보, SEO, 콘텐츠 마케팅, Shorts·영상 제작 — 마케팅 서비스를 상품화합니다. 가격은 상담 후 결정합니다."
          />

          <section className="mb-12">
            <h2 className="text-lg font-bold text-surface-900">서비스 목록</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {marketingServices.map((svc) => (
                <article key={svc.id} className="rounded-xl border border-surface-200 p-5">
                  <h3 className="font-semibold text-surface-900">{svc.title}</h3>
                  <p className="mt-2 text-sm text-surface-600">{svc.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900">요금 플랜</h2>
            <p className="mt-2 text-sm text-surface-600">모든 플랜 가격은 상담 후 결정됩니다.</p>
            <div className="mt-6">
              <PricingTiers tiers={marketingTiers} />
            </div>
          </section>

          <div className="mt-10">
            <Button href="/contact?topic=marketing" variant="primary" size="lg">
              마케팅 상담 요청
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
