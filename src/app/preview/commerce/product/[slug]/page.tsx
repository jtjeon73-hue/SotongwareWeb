import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  PREVIEW_BASE,
  getPreviewBusiness,
  getPreviewProduct,
  previewProductSlugs,
} from "@/data/preview-commerce";
import { PreviewCta, PreviewShell } from "@/components/preview/commerce/PreviewChrome";
import {
  AccessGateDemo,
  MemberStateSwitcher,
} from "@/components/preview/commerce/PreviewMemberState";
import {
  BusinessIcon,
  IconJourneyPreview,
  IconPlate,
} from "@/components/preview/commerce/PreviewIcons";

export function generateStaticParams() {
  return previewProductSlugs.map((slug) => ({ slug }));
}

export default async function PreviewProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getPreviewProduct(slug);
  if (!product) notFound();
  const biz = getPreviewBusiness(product.business);

  const checkoutHref =
    product.access === "basic_included"
      ? `${PREVIEW_BASE}/pricing`
      : product.priceWon === null
        ? `${PREVIEW_BASE}/checkout?sku=${product.slug}&mode=inquiry`
        : `${PREVIEW_BASE}/checkout?sku=${product.slug}&mode=one_time`;

  const ctaLabel =
    product.access === "basic_included"
      ? "Basic으로 이용하기"
      : product.priceWon === null
        ? "견적 문의 흐름"
        : product.access === "free"
          ? "무료로 열기"
          : "구매 화면으로";

  return (
    <PreviewShell
      title={product.title}
      subtitle={product.subtitle}
      backHref={`${PREVIEW_BASE}/business/${product.business}`}
      backLabel={biz?.title ?? "사업부"}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div
            className={`relative overflow-hidden rounded-3xl ${product.coverTone} px-6 py-14 text-white sm:py-16`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/80">{biz?.title}</p>
                <h2 className="mt-2 text-3xl font-semibold">{product.title}</h2>
                <p className="mt-3 max-w-md text-white/90">{product.priceLabel}</p>
                {product.basicDiscountLabel ? (
                  <p className="mt-2 text-sm text-amber-100">{product.basicDiscountLabel}</p>
                ) : null}
              </div>
              <IconPlate>
                <BusinessIcon
                  slug={product.business}
                  size="lg"
                  decorative={false}
                  title={biz?.title}
                  className="text-white"
                />
              </IconPlate>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-surface-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <IconJourneyPreview size="sm" decorative />
              </span>
              <h3 className="text-lg font-semibold text-surface-900">무료 미리보기</h3>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-surface-700">
              {product.previewText}
            </p>
            {product.toc ? (
              <ol className="mt-5 list-decimal space-y-1 pl-5 text-sm text-surface-600">
                {product.toc.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : null}
          </section>

          <Suspense fallback={null}>
            <AccessGateDemo
              productTitle={product.title}
              requiresBasic={product.access === "basic_included"}
            />
          </Suspense>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-surface-500">이 화면의 핵심 행동</p>
            <p className="mt-1 text-2xl font-semibold text-surface-900">{product.priceLabel}</p>
            <ul className="mt-4 space-y-2 text-sm text-surface-600">
              {product.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-brand-600">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              {product.access === "free" ? (
                <PreviewCta href={`${PREVIEW_BASE}/library?member=free`}>{ctaLabel}</PreviewCta>
              ) : (
                <PreviewCta href={checkoutHref}>{ctaLabel}</PreviewCta>
              )}
              <PreviewCta href={`${PREVIEW_BASE}/pricing`} variant="secondary">
                Free / Basic 비교
              </PreviewCta>
            </div>
          </div>

          <Suspense fallback={null}>
            <MemberStateSwitcher basePath={`${PREVIEW_BASE}/product/${product.slug}`} />
          </Suspense>
        </aside>
      </div>
    </PreviewShell>
  );
}
