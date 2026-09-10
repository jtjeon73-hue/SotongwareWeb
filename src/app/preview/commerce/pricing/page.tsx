import Link from "next/link";
import { PREVIEW_BASE, previewPlans } from "@/data/preview-commerce";
import { PreviewCta, PreviewShell } from "@/components/preview/commerce/PreviewChrome";
import {
  IconJourneyPay,
  IconStatusBasicActive,
  IconStatusFree,
  previewCardMotion,
} from "@/components/preview/commerce/PreviewIcons";

export default function PreviewPricingPage() {
  return (
    <PreviewShell
      title="Free와 Basic 비교"
      subtitle="월 2,000원 · 연 20,000원 (시제품 가격)"
      backHref={PREVIEW_BASE}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {previewPlans.map((plan) => {
          const highlighted = "highlighted" in plan && plan.highlighted;
          const PlanIcon = plan.id === "free" ? IconStatusFree : IconStatusBasicActive;
          return (
            <article
              key={plan.id}
              className={`flex flex-col rounded-3xl border p-6 ${
                highlighted
                  ? "border-brand-500 bg-brand-50 shadow-md"
                  : "border-surface-200 bg-white"
              } ${previewCardMotion}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    highlighted ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-700"
                  }`}
                >
                  <PlanIcon size="sm" decorative={false} title={plan.name} />
                </span>
                <p className="text-sm font-medium text-brand-700">{plan.name}</p>
              </div>
              <p className="mt-4 text-3xl font-semibold text-surface-900">{plan.priceLabel}</p>
              <p className="text-sm text-surface-500">{plan.period}</p>
              <p className="mt-4 text-sm text-surface-700">{plan.summary}</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-surface-600">
                {plan.perks.map((perk) => (
                  <li key={perk}>· {perk}</li>
                ))}
              </ul>
              <div className="mt-6">
                {plan.id === "free" ? (
                  <PreviewCta href={`${PREVIEW_BASE}/library?member=free`} variant="secondary">
                    Free로 둘러보기
                  </PreviewCta>
                ) : (
                  <PreviewCta
                    href={`${PREVIEW_BASE}/checkout?sku=${plan.id}&mode=subscription`}
                  >
                    {plan.name} 선택
                  </PreviewCta>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-12 rounded-2xl border border-surface-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <IconJourneyPay size="sm" decorative />
          </span>
          <h2 className="text-lg font-semibold text-surface-900">구독과 단건구매</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-surface-600">
          Basic에 이미 포함된 자료는 단건으로 다시 사지 않습니다. 할인이 적용되는 단건은
          구매 후에도 해지와 관계없이 내 자료실에 남습니다. (시제품 안내)
        </p>
        <Link
          href={`${PREVIEW_BASE}/product/factory-start-ebook`}
          className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand-700 hover:underline"
        >
          단건 전자책 예시 보기 →
        </Link>
      </section>
    </PreviewShell>
  );
}
