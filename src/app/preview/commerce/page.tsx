import Link from "next/link";
import {
  PREVIEW_BASE,
  previewBusinesses,
  previewProducts,
} from "@/data/preview-commerce";
import { PreviewCta, PreviewShell } from "@/components/preview/commerce/PreviewChrome";
import {
  BusinessIcon,
  IconPlate,
  JourneyIcon,
  previewCardMotion,
  type JourneyKind,
} from "@/components/preview/commerce/PreviewIcons";

const journey: { label: string; href: string; kind: JourneyKind }[] = [
  { label: "상품 발견", href: `${PREVIEW_BASE}/business/ebooks`, kind: "discover" },
  {
    label: "무료 미리보기",
    href: `${PREVIEW_BASE}/product/factory-start-ebook`,
    kind: "preview",
  },
  {
    label: "요금·결제",
    href: `${PREVIEW_BASE}/checkout?sku=factory-start-ebook`,
    kind: "pay",
  },
  { label: "내 자료실", href: `${PREVIEW_BASE}/library`, kind: "library" },
];

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
          <p className="text-sm font-medium text-brand-200">공식 홈페이지 시제품 V2</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            발견하고, 미리 보고, 고르고, 내 자료실로
          </h2>
          <p className="mt-4 text-base leading-relaxed text-surface-200">
            실제 가입과 결제는 없습니다. 사업부 아이콘만 보고도 성격을 느껴 보세요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PreviewCta href={`${PREVIEW_BASE}/pricing`}>요금 비교하기</PreviewCta>
            <PreviewCta
              href={`${PREVIEW_BASE}/product/${previewProducts[2].slug}`}
              variant="secondary"
            >
              전자책 미리보기
            </PreviewCta>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-surface-900">6개 사업부</h2>
          <p className="mt-2 text-surface-600">
            통일된 아이콘 가족으로 사업부 성격을 한눈에 구분합니다.
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previewBusinesses.map((biz) => (
            <li key={biz.slug}>
              <Link
                href={`${PREVIEW_BASE}/business/${biz.slug}`}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm hover:border-brand-300 ${previewCardMotion}`}
              >
                <div
                  className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${biz.accent}`}
                >
                  <IconPlate className="motion-safe:transition motion-safe:duration-200 motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-visible:scale-[1.04]">
                    <BusinessIcon
                      slug={biz.slug}
                      size="xl"
                      decorative={false}
                      title={biz.title}
                      className="text-white"
                    />
                  </IconPlate>
                </div>
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
          {journey.map((step) => (
            <li key={step.href}>
              <Link
                href={step.href}
                className={`flex min-h-14 items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 px-4 text-sm font-medium text-surface-800 hover:border-brand-300 hover:bg-white ${previewCardMotion}`}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <JourneyIcon kind={step.kind} size="sm" decorative />
                </span>
                {step.label}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </PreviewShell>
  );
}
