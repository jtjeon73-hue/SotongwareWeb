import type { Locale } from "@/i18n/config";
import {
  marketingOfferServices,
  marketingPackages,
  marketingProcessSteps,
  marketingSamples,
  memberPricingPreview,
} from "@/data/marketing-services";
import { MarketingIntakeForm } from "@/components/marketing/MarketingIntakeForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ComingSoonCta } from "@/components/access/MembershipGate";
import { LocalizedButton } from "@/components/locale/LocalizedButton";

const TONE: Record<string, string> = {
  violet: "from-violet-50 to-white border-violet-200",
  sky: "from-sky-50 to-white border-sky-200",
  rose: "from-rose-50 to-white border-rose-200",
  amber: "from-amber-50 to-white border-amber-200",
  emerald: "from-emerald-50 to-white border-emerald-200",
  fuchsia: "from-fuchsia-50 to-white border-fuchsia-200",
};

export function MarketingServiceView({ locale }: { locale: Locale }) {
  return (
    <div className="bg-[linear-gradient(180deg,#faf5ff_0%,#ffffff_28%,#f8fbff_100%)]">
      <div className="section-padding !pb-8">
        <div className="container-main">
          <SectionHeader
            eyebrow={locale === "en" ? "Promo production service" : "홍보 제작 서비스"}
            title={locale === "en" ? "Order promo assets with a clear package" : "패키지를 고르고 홍보 결과물을 주문하세요"}
            description={
              locale === "en"
                ? "Fast, structured digital production—SNS, card news, blogs, detail/landing pages, Shorts, and campaigns. Prices below are starting drafts and may be adjusted after scope review."
                : "빠르고 체계적인 디지털 제작 서비스입니다. SNS·카드뉴스·블로그·상세/랜딩·Shorts·캠페인까지. 아래 가격은 초기 초안이며, 범위 확인 후 조정될 수 있습니다."
            }
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#marketing-packages"
              className="inline-flex min-h-11 items-center rounded-lg bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              {locale === "en" ? "View packages" : "패키지 보기"}
            </a>
            <a
              href="#marketing-intake"
              className="inline-flex min-h-11 items-center rounded-lg border border-violet-200 bg-white px-5 text-sm font-semibold text-violet-900 hover:bg-violet-50"
            >
              {locale === "en" ? "Draft a request" : "신청 미리보기"}
            </a>
          </div>
        </div>
      </div>

      <section className="pb-12" aria-labelledby="marketing-services-heading">
        <div className="container-main">
          <h2 id="marketing-services-heading" className="text-xl font-bold text-surface-900">
            {locale === "en" ? "What you can order" : "주문 가능한 결과물"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marketingOfferServices.map((svc) => (
              <article
                key={svc.id}
                className={`rounded-2xl border bg-gradient-to-br p-4 shadow-sm ${TONE[svc.tone]}`}
              >
                <h3 className="font-semibold text-surface-900">{svc.title[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-600">{svc.summary[locale]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="marketing-packages" className="pb-12" aria-labelledby="marketing-packages-heading">
        <div className="container-main">
          <h2 id="marketing-packages-heading" className="text-xl font-bold text-surface-900">
            {locale === "en" ? "Starting packages" : "가격 패키지 초안"}
          </h2>
          <p className="mt-2 text-sm text-surface-600">
            {locale === "en"
              ? "Starting prices for early service scope. Final quotes follow deliverable review—not “cheap because AI.”"
              : "초기 서비스 범위의 시작가입니다. 최종 견적은 결과물 범위 확인 후 결정됩니다. “AI라서 싸다”가 아니라 빠른 체계적 제작이 핵심입니다."}
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {marketingPackages.map((pkg) => (
              <article
                key={pkg.id}
                className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm ${
                  pkg.highlighted ? "border-violet-400 ring-2 ring-violet-200" : "border-violet-100"
                }`}
              >
                {pkg.highlighted ? (
                  <span className="mb-2 w-fit rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    {locale === "en" ? "Popular" : "추천"}
                  </span>
                ) : null}
                <h3 className="text-lg font-bold text-surface-900">{pkg.name[locale]}</h3>
                <p className="mt-2 text-2xl font-bold text-violet-700">{pkg.priceLabel[locale]}</p>
                <p className="mt-2 text-sm text-surface-600">{pkg.blurb[locale]}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {pkg.features.map((f) => (
                    <li key={f.ko} className="flex gap-2 text-sm text-surface-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                      {f[locale]}
                    </li>
                  ))}
                </ul>
                <a
                  href="#marketing-intake"
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-violet-200 text-sm font-semibold text-violet-900 hover:bg-violet-50"
                >
                  {locale === "en" ? "Use in request preview" : "신청 Preview에 사용"}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12" aria-labelledby="marketing-member-heading">
        <div className="container-main">
          <div className="rounded-3xl border border-sky-100 bg-sky-50/60 p-6">
            <h2 id="marketing-member-heading" className="text-lg font-bold text-surface-900">
              {locale === "en" ? "Membership vs production fees" : "회원료와 제작비"}
            </h2>
            <p className="mt-2 text-sm text-surface-600">{memberPricingPreview.note[locale]}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[memberPricingPreview.free, memberPricingPreview.basicMonthly, memberPricingPreview.basicYearly].map(
                (tier) => (
                  <div key={tier.ko} className="rounded-xl border border-white bg-white p-4">
                    <p className="font-semibold text-surface-900">{tier[locale]}</p>
                    <p className="mt-1 text-sm text-brand-700">{tier.fee[locale]}</p>
                  </div>
                ),
              )}
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {memberPricingPreview.benefits[locale].map((b) => (
                <li
                  key={b}
                  className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-900"
                >
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <ComingSoonCta
                locale={locale}
                label={locale === "en" ? "Live member discounts later" : "실제 회원 할인·결제는 정식 오픈 후"}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12" aria-labelledby="marketing-process-heading">
        <div className="container-main">
          <h2 id="marketing-process-heading" className="text-xl font-bold text-surface-900">
            {locale === "en" ? "How production works" : "제작 과정"}
          </h2>
          <p className="mt-2 text-sm text-surface-600">
            {locale === "en"
              ? "AI-assisted automation with expert review—explained simply for customers."
              : "AI 자동화 + 전문가 검토형 제작 프로세스입니다."}
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {marketingProcessSteps.map((step) => (
              <li key={step.step} className="rounded-2xl border border-surface-200 bg-white p-4">
                <p className="text-xs font-semibold text-violet-700">
                  {String(step.step).padStart(2, "0")}
                </p>
                <p className="mt-1 font-semibold text-surface-900">{step.title[locale]}</p>
                <p className="mt-1 text-sm text-surface-600">{step.desc[locale]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pb-12" aria-labelledby="marketing-samples-heading">
        <div className="container-main">
          <h2 id="marketing-samples-heading" className="text-xl font-bold text-surface-900">
            {locale === "en" ? "Sample deliverable types" : "결과물 유형 Sample"}
          </h2>
          <p className="mt-2 text-sm text-surface-600">
            {locale === "en"
              ? "Marked as Sample / Preparing—not fabricated client case studies."
              : "Sample / 준비중으로 표시합니다. 허위 고객 실적이 아닙니다."}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {marketingSamples.map((sample) => (
              <article
                key={sample.id}
                className={`overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br shadow-sm ${sample.tone}`}
              >
                <div className="aspect-[16/10] p-4">
                  <div className="h-full rounded-xl border border-white/70 bg-white/70 p-3 backdrop-blur-sm">
                    <div className="h-2 w-16 rounded bg-violet-300/80" />
                    <div className="mt-3 space-y-1.5">
                      <div className="h-2 rounded bg-surface-200" />
                      <div className="h-2 w-4/5 rounded bg-surface-100" />
                      <div className="h-8 rounded-lg bg-violet-100/80" />
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/60 bg-white/80 px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-surface-900">{sample.title[locale]}</p>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200">
                      {sample.status === "sample"
                        ? locale === "en"
                          ? "Sample"
                          : "Sample"
                        : locale === "en"
                          ? "Preparing"
                          : "준비중"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-surface-500">{sample.kind[locale]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="marketing-intake" className="pb-16" aria-labelledby="marketing-intake-heading">
        <div className="container-main">
          <h2 id="marketing-intake-heading" className="text-xl font-bold text-surface-900">
            {locale === "en" ? "Request intake preview" : "고객 요구 입력 Preview"}
          </h2>
          <p className="mt-2 text-sm text-surface-600">
            {locale === "en"
              ? "Preview only. No live order, payment, or server storage in this phase."
              : "Preview 전용입니다. 이번 단계에서는 실제 주문·결제·서버 저장이 없습니다."}
          </p>
          <div className="mt-6">
            <MarketingIntakeForm locale={locale} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocalizedButton href="/contact?topic=marketing" variant="outline" className="min-h-11">
              {locale === "en" ? "General consultation" : "일반 상담 문의"}
            </LocalizedButton>
            <LocalizedButton href="/preview/commerce/service" variant="primary" className="min-h-11">
              {locale === "en" ? "Membership / pricing preview" : "회원·요금 Preview"}
            </LocalizedButton>
          </div>
        </div>
      </section>
    </div>
  );
}
