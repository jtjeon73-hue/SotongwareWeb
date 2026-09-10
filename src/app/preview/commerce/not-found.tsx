import Link from "next/link";
import { PREVIEW_BASE } from "@/data/preview-commerce";
import { PreviewBanner } from "@/components/preview/commerce/PreviewChrome";

export default function PreviewCommerceNotFound() {
  return (
    <div className="bg-surface-50">
      <PreviewBanner />
      <div className="container-main section-padding mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-semibold text-surface-900">페이지를 찾을 수 없습니다</h1>
        <p className="mt-3 text-sm text-surface-600">
          시제품 주소가 올바르지 않거나, 없는 상품·사업부입니다.
        </p>
        <Link
          href={PREVIEW_BASE}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-600 px-5 font-medium text-white hover:bg-brand-700"
        >
          시제품 허브로
        </Link>
      </div>
    </div>
  );
}
