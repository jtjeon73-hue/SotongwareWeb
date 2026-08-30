import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { SotongProduct } from "@/types/product";
import { canInstallFromStore } from "@/lib/commerce";
import { STATUS_LABELS } from "@/lib/products";
import { isContactSubmissionAvailable } from "@/config/platform-status";

export function ProductNextActions({ product }: { product: SotongProduct }) {
  const contactAvailable = isContactSubmissionAvailable();
  const storeAvailable = canInstallFromStore(product);
  const isApp = product.type === "app";

  const statusMessage =
    product.status === "published"
      ? storeAvailable
        ? "지금 이용할 수 있습니다."
        : "공개되었습니다. 배포 채널을 확인해 주세요."
      : product.status === "ready"
        ? "출시 준비 중입니다."
        : product.status === "testing"
          ? "테스트 중입니다. 곧 공개됩니다."
          : STATUS_LABELS[product.status];

  return (
    <section className="mt-8" aria-labelledby="next-actions-heading">
      <h2 id="next-actions-heading" className="text-sm font-semibold uppercase tracking-wider text-surface-500">
        다음 행동
      </h2>
      <p className="mt-2 text-sm text-surface-600">{statusMessage}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {storeAvailable && product.storeLinks?.playStore && (
          <Button href={product.storeLinks.playStore} variant="primary" external className="min-h-11">
            이용하기
          </Button>
        )}
        {product.status === "ready" && !storeAvailable && (
          <span className="inline-flex min-h-11 items-center rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
            출시 준비 중
          </span>
        )}
        {product.status === "testing" && (
          <span className="inline-flex min-h-11 items-center rounded-lg border border-surface-200 bg-surface-50 px-4 py-2 text-sm font-medium text-surface-600">
            테스트 중
          </span>
        )}
        {contactAvailable && isApp && (
          <Button href={`/contact?topic=app&product=${product.slug}`} variant="outline" className="min-h-11">
            이런 앱 제작 상담
          </Button>
        )}
        {!contactAvailable && isApp && (
          <Link
            href="/apps"
            className="inline-flex min-h-11 items-center rounded-lg border border-surface-200 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50"
          >
            앱 서비스 더 보기
          </Link>
        )}
        {contactAvailable && (product.accessMode === "inquiry" || product.accessMode === "paid") && (
          <Button href={`/contact?product=${product.slug}`} variant="primary" className="min-h-11">
            {product.type === "automation" ? "견적 요청" : "구매·상담"}
          </Button>
        )}
        <Button href="/products" variant="outline" className="min-h-11">
          다른 상품 보기
        </Button>
      </div>
    </section>
  );
}
