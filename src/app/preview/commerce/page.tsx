import Link from "next/link";
import {
  PREVIEW_BASE,
  previewBusinesses,
  previewProducts,
} from "@/data/preview-commerce";
import { PreviewCta, PreviewShell } from "@/components/preview/commerce/PreviewChrome";

export default function PreviewCommerceHubPage() {
  return (
    <PreviewShell
      title="SotongWare 한곳에서 살펴보기"
      subtitle="6개 사업부 · 상품 · 요금 · 결제 · 내 자료실 시제품"
    >
      <section className="relative overflow-hidden rounded-3xl bg-surface-950 px-6 py-12 text-white sm:px-10 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(12,140,233,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(34,197,94,0.18),transparent_50%)]"
        />
        <div className="relative max-w-2xl">
          <p className="text-sm font-medium text-brand-200">공식 홈페이지 시제품 V1</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            발견하고, 미리 보고, 고르고, 내 자료실로
          </h2>
          <p className="mt-4 text-base leading-relaxed text-surface-200">
            실제 가입과 결제는 없습니다. 버튼만 눌러 전체 고객 흐름을 검토해 주세요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PreviewCta href={`${PREVIEW_BASE}/pricing`}>요금 비교하기</PreviewCta>
            <PreviewCta href={`${PREVIEW_BASE}/product/${previewProducts[2].slug}`} variant="secondary">
              전자책 미리보기
            </PreviewCta>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-surface-900">6개 사업부</h2>
          <p className="mt-2 text-surface-600">
            통일된 SotongWare 브랜드 안에서 사업부마다 다른 분위기를 느껴 보세요.
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previewBusinesses.map((biz) => (
            <li key={biz.slug}>
              <Link
                href={`${PREVIEW_BASE}/business/${biz.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
              >
                <div className={`h-24 bg-gradient-to-br ${biz.accent}`} />
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-medium text-brand-700">{biz.mood}</p>
                  <h3 className="mt-1 text-lg font-semibold text-surface-900 group-hover:text-brand-800">
                    {biz.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-surface-600">{biz.short}</p>
                  <p className="mt-4 text-sm font-medium text-brand-700">
                    {biz.primaryAction} →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-3xl border border-surface-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-surface-900">추천 체험 순서</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["상품 발견", `${PREVIEW_BASE}/business/ebooks`],
            ["미리보기·가격", `${PREVIEW_BASE}/product/factory-start-ebook`],
            ["결제 화면", `${PREVIEW_BASE}/checkout?sku=factory-start-ebook`],
            ["내 자료실", `${PREVIEW_BASE}/library`],
          ].map(([label, href], i) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 px-4 text-sm font-medium text-surface-800 hover:border-brand-300 hover:bg-white"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
                  {i + 1}
                </span>
                {label}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </PreviewShell>
  );
}
