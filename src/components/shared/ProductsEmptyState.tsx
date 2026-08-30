import { Button } from "@/components/ui/Button";

interface ProductsEmptyStateProps {
  compact?: boolean;
  typeLabel?: string;
}

export function ProductsEmptyState({ compact = false, typeLabel }: ProductsEmptyStateProps) {
  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-surface-200 bg-white p-6 sm:p-8"
          : "rounded-2xl border border-surface-200 bg-white p-8 sm:p-10"
      }
    >
      <p className="text-sm font-medium text-brand-600">
        {typeLabel ? `${typeLabel} Catalog` : "SotongWare Products"}
      </p>
      <h3 className="mt-2 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">
        새로운 결과물을 준비하고 있습니다
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-surface-600 sm:text-base">
        SotongWare에서 제작·검증을 마친 제품과 콘텐츠만 이곳에 공개합니다.
      </p>

      {!compact && (
        <p className="mt-4 text-sm text-surface-500">
          앱, 전자책, 교육, 콘텐츠, 자동화 — 제작·검수 완료 후 순차 공개됩니다.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-surface-100 pt-6 sm:flex-row sm:flex-wrap">
        <Button href="/#business-hub-heading" variant="primary" size="md" className="min-h-11">
          서비스 둘러보기
        </Button>
        <Button href="/contact" variant="outline" size="md" className="min-h-11">
          제작 문의
        </Button>
        <Button href="/products" variant="outline" size="md" className="min-h-11">
          디지털 상품
        </Button>
      </div>
    </div>
  );
}
