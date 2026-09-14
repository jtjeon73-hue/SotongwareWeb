/**
 * Member · Commerce service readiness Preview — static mock only.
 * No Auth, PG, Firestore, or Functions calls.
 */
import Link from "next/link";
import {
  PREVIEW_BASE,
  mockLibraryItems,
  mockOrders,
  previewPlans,
  previewProducts,
} from "@/data/preview-commerce";
import { PreviewCta, PreviewShell } from "@/components/preview/commerce/PreviewChrome";
import {
  IconJourneyPay,
  IconStatusBasicActive,
  IconStatusFree,
  previewCardMotion,
} from "@/components/preview/commerce/PreviewIcons";

const sampleProducts = previewProducts.filter((p) =>
  ["factory-start-ebook", "field-check-app", "weekly-quiz-pack", "free-tip-sheet"].includes(p.slug),
);

export default function CommerceServicePreviewPage() {
  return (
    <PreviewShell
      title="회원·결제 서비스 준비 현황"
      subtitle="정식 서비스 오픈 전 미리보기입니다. 실제 가입·결제는 진행되지 않습니다."
      backHref="/"
      backLabel="홈"
    >
      <section className="relative overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-surface-50 px-6 py-10 sm:px-10">
        <p className="text-sm font-medium text-brand-700">SotongWare · 준비 중</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-surface-900 sm:text-4xl">
          회원 · 상품 · 결제 · 구매내역 · 이용권 구조가 준비되고 있습니다
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-surface-600 sm:text-base">
          아래 화면은 출시 전 공개용 미리보기입니다. 토스페이먼츠 결제와 운영 회원가입은
          정식 오픈 후에 이용할 수 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PreviewCta href={`${PREVIEW_BASE}/pricing`}>멤버십 요금 보기</PreviewCta>
          <PreviewCta href={`${PREVIEW_BASE}/checkout?sku=factory-start-ebook`} variant="secondary">
            결제 화면 미리보기
          </PreviewCta>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-surface-900">1. 회원·멤버십</h2>
        <p className="mt-2 text-sm text-surface-600">
          무료 회원과 Basic(월 2,000원 · 연 20,000원) 구조를 준비 중입니다. 현재 실제 가입·구독은
          열려 있지 않습니다.
        </p>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {previewPlans.map((plan) => {
            const Icon = plan.id === "free" ? IconStatusFree : IconStatusBasicActive;
            const highlighted = "highlighted" in plan && plan.highlighted;
            return (
              <li
                key={plan.id}
                className={`rounded-2xl border p-5 ${
                  highlighted ? "border-brand-400 bg-brand-50" : "border-surface-200 bg-white"
                } ${previewCardMotion}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                      highlighted ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-700"
                    }`}
                  >
                    <Icon size="sm" decorative={false} title={plan.name} />
                  </span>
                  <div>
                    <p className="font-semibold text-surface-900">{plan.name}</p>
                    <p className="text-sm text-surface-500">{plan.period}</p>
                  </div>
                </div>
                <p className="mt-4 text-2xl font-semibold text-surface-900">{plan.priceLabel}</p>
                <p className="mt-2 text-sm text-surface-600">{plan.summary}</p>
                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-950">
                  실제 가입·구독 · 준비중
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-surface-900">2. 상품</h2>
        <p className="mt-2 text-sm text-surface-600">
          전자책, 앱·디지털 상품, 지식·교육 등 판매 가능한 상품 구조를 미리 보여 드립니다.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {sampleProducts.map((p) => (
            <li key={p.slug}>
              <Link
                href={`${PREVIEW_BASE}/product/${p.slug}`}
                className={`flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-5 shadow-sm hover:border-brand-300 ${previewCardMotion}`}
              >
                <p className="text-xs font-medium text-brand-700">{p.business}</p>
                <h3 className="mt-2 text-lg font-semibold text-surface-900">{p.title}</h3>
                <p className="mt-1 text-sm text-surface-600">{p.subtitle}</p>
                <p className="mt-4 text-sm font-medium text-surface-800">{p.priceLabel}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <PreviewCta href={PREVIEW_BASE} variant="secondary">
            전체 상품·사업부 허브
          </PreviewCta>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-surface-900">3. 결제 화면</h2>
        <p className="mt-2 text-sm text-surface-600">
          상품명·가격·구매자·결제수단·주문 요약 화면을 준비했습니다. 토스페이먼츠 연동은 정식 오픈
          예정입니다.
        </p>
        <div className="mt-6 mx-auto max-w-lg rounded-3xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <IconJourneyPay size="md" decorative={false} title="결제" />
          </div>
          <p className="text-sm text-surface-500">주문 요약 예시</p>
          <h3 className="mt-2 text-2xl font-semibold text-surface-900">현장 자동화 첫걸음</h3>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-surface-100 pb-3">
              <dt className="text-surface-500">금액</dt>
              <dd className="font-medium text-surface-800">12,000원</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-surface-100 pb-3">
              <dt className="text-surface-500">구매자</dt>
              <dd className="font-medium text-surface-800">회원 예시</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-surface-500">결제 수단</dt>
              <dd className="font-medium text-surface-800">토스페이먼츠 · 준비중</dd>
            </div>
          </dl>
          <p className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
            현재 결제 시스템 준비 중입니다. 정식 서비스 오픈 후 이용할 수 있습니다.
          </p>
          <button
            type="button"
            disabled
            className="mt-4 inline-flex w-full min-h-11 cursor-not-allowed items-center justify-center rounded-xl bg-surface-300 px-4 text-sm font-medium text-surface-600"
          >
            결제하기 (준비중)
          </button>
          <div className="mt-4">
            <PreviewCta href={`${PREVIEW_BASE}/checkout?sku=factory-start-ebook`} variant="secondary">
              결제 확인 화면 열기
            </PreviewCta>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-surface-900">4. 구매내역</h2>
        <p className="mt-2 text-sm text-surface-600">
          결제 상태·구매일·상품·금액이 어떻게 보이는지 예시입니다. 실제 구매 기록은 표시되지 않습니다.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-surface-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-50 text-surface-500">
              <tr>
                <th className="px-4 py-3 font-medium">구매일</th>
                <th className="px-4 py-3 font-medium">상품</th>
                <th className="px-4 py-3 font-medium">금액</th>
                <th className="px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((o) => (
                <tr key={o.id} className="border-t border-surface-100">
                  <td className="px-4 py-3 text-surface-700">{o.date}</td>
                  <td className="px-4 py-3 font-medium text-surface-900">{o.title}</td>
                  <td className="px-4 py-3 text-surface-700">{o.amount}</td>
                  <td className="px-4 py-3 text-surface-600">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-semibold text-surface-900">5. 이용권</h2>
        <p className="mt-2 text-sm text-surface-600">
          구매·구독 후 콘텐츠 접근권이 어떻게 열리는지 예시입니다.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {mockLibraryItems.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-medium text-brand-700">{item.type}</p>
              <h3 className="mt-2 font-semibold text-surface-900">{item.title}</h3>
              <p className="mt-3 text-sm text-surface-600">{item.status}</p>
              <Link
                href={`${PREVIEW_BASE}/product/${item.productSlug}`}
                className="mt-4 inline-flex text-sm font-medium text-brand-700 hover:underline"
              >
                상품 화면 →
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <PreviewCta href={`${PREVIEW_BASE}/library?member=basic_active`}>
            자료실 이용권 예시 보기
          </PreviewCta>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-surface-200 bg-surface-50 p-6 text-center sm:p-8">
        <p className="text-sm font-medium text-surface-800">
          정식 서비스 오픈 전까지 실제 회원가입·결제·구매는 진행되지 않습니다.
        </p>
        <p className="mt-2 text-sm text-surface-600">
          문의가 있으시면 상담 페이지로 연락해 주세요.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PreviewCta href="/contact" variant="secondary">
            상담·제작 문의
          </PreviewCta>
          <PreviewCta href={`${PREVIEW_BASE}/showcase-v4`} variant="quiet">
            브랜드 쇼케이스
          </PreviewCta>
        </div>
      </section>
    </PreviewShell>
  );
}
