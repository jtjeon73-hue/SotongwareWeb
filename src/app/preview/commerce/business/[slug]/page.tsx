import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PREVIEW_BASE,
  getPreviewBusiness,
  previewBusinessSlugs,
  productsForBusiness,
  type PreviewBusinessSlug,
} from "@/data/preview-commerce";
import { PreviewCta, PreviewShell } from "@/components/preview/commerce/PreviewChrome";

export function generateStaticParams() {
  return previewBusinessSlugs.map((slug) => ({ slug }));
}

export default async function PreviewBusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const biz = getPreviewBusiness(slug);
  if (!biz) notFound();

  const products = productsForBusiness(slug as PreviewBusinessSlug);

  return (
    <PreviewShell
      title={biz.title}
      subtitle={biz.heroLine}
      backHref={PREVIEW_BASE}
      backLabel="허브"
    >
      <section className={`overflow-hidden rounded-3xl bg-gradient-to-br ${biz.accent} px-6 py-10 text-white sm:px-10`}>
        <p className="text-sm text-white/80">{biz.mood}</p>
        <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight">{biz.short}</h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {biz.experience.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-surface-900">대표 체험</h2>
        <p className="mt-1 text-sm text-surface-600">이 사업부에서 바로 눌러볼 수 있는 화면입니다.</p>

        {slug === "automation" ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-surface-200 bg-white p-5">
              <p className="text-xs font-medium text-brand-700">공정 화면</p>
              <div className="mt-3 space-y-2 rounded-xl bg-surface-950 p-4 font-mono text-xs text-farm-500">
                <p>LINE-A RUN ████████░░ 94%</p>
                <p>ALARM 3 · DOWNTIME -18%</p>
                <p>SHIFT OK</p>
              </div>
            </div>
            <div className="rounded-2xl border border-surface-200 bg-white p-5">
              <p className="text-xs font-medium text-brand-700">개선 전후</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-rose-50 p-4 text-rose-900">Before · 수기 집계</div>
                <div className="rounded-xl bg-farm-50 p-4 text-farm-900">After · 실시간 화면</div>
              </div>
              <div className="mt-4">
                <PreviewCta href={`${PREVIEW_BASE}/checkout?sku=plc-dashboard-pack&mode=inquiry`}>
                  견적 문의 흐름 보기
                </PreviewCta>
              </div>
            </div>
          </div>
        ) : null}

        {slug === "apps" ? (
          <div className="mt-6 rounded-2xl border border-surface-200 bg-white p-5">
            <p className="text-xs font-medium text-brand-700">앱 화면 스택</p>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {["홈", "점검", "보고"].map((label) => (
                <div
                  key={label}
                  className="min-w-[140px] rounded-[1.5rem] border border-surface-300 bg-surface-100 p-3"
                >
                  <div className="h-48 rounded-[1.1rem] bg-gradient-to-b from-brand-600 to-brand-900 p-3 text-sm text-white">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {slug === "ebooks" ? (
          <div className="mt-6 rounded-2xl border border-surface-200 bg-amber-50/60 p-5">
            <p className="text-sm text-amber-950">서점형 진열 — 표지를 눌러 미리보기로 이동합니다.</p>
          </div>
        ) : null}

        {slug === "knowledge" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["무료 정보", "퀴즈", "회원 노트"].map((label) => (
              <div key={label} className="rounded-2xl border border-emerald-200 bg-white p-4 text-sm font-medium text-emerald-950">
                {label}
              </div>
            ))}
          </div>
        ) : null}

        {slug === "marketing" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-surface-200 p-6 text-sm text-surface-700">홍보 전 · 정보 나열</div>
            <div className="rounded-2xl bg-rose-700 p-6 text-sm text-white">홍보 후 · 한 행동</div>
          </div>
        ) : null}

        {slug === "contents" ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {["음악", "쇼츠", "만화", "이미지"].map((label) => (
              <span key={label} className="rounded-full bg-cyan-100 px-4 py-2 text-sm text-cyan-950">
                {label} 감상
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-surface-900">상품 목록</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={`${PREVIEW_BASE}/product/${product.slug}`}
                className="flex h-full gap-4 rounded-2xl border border-surface-200 bg-white p-4 hover:border-brand-300"
              >
                <div className={`h-20 w-16 shrink-0 rounded-lg ${product.coverTone}`} />
                <div className="min-w-0">
                  <h3 className="font-semibold text-surface-900">{product.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-surface-600">{product.subtitle}</p>
                  <p className="mt-2 text-sm font-medium text-brand-700">{product.priceLabel}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {products.length === 0 ? (
          <p className="mt-4 text-sm text-surface-600">이 사업부 샘플 상품은 곧 추가됩니다.</p>
        ) : null}
      </section>
    </PreviewShell>
  );
}
