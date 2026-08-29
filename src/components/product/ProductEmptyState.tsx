import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { ProductType } from "@/types/product";

interface ProductEmptyStateProps {
  type?: ProductType;
  title?: string;
  description?: string;
}

const TYPE_LABELS: Partial<Record<ProductType, string>> = {
  app: "앱",
  ebook: "전자책",
  knowledge: "교육 콘텐츠",
  content: "콘텐츠",
  marketing: "마케팅 상품",
  automation: "자동화 솔루션",
};

export function ProductEmptyState({
  type,
  title = "등록된 상품이 준비 중입니다",
  description = "SotongWare에서 제작·검수가 완료된 상품만 등록합니다. 가짜 데이터는 넣지 않습니다.",
}: ProductEmptyStateProps) {
  const typeLabel = type ? TYPE_LABELS[type] : "디지털 상품";

  return (
    <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 sm:p-10">
      <p className="text-sm font-medium text-brand-600">{typeLabel} Catalog</p>
      <h3 className="mt-2 text-xl font-bold text-surface-900">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-surface-600">{description}</p>
      <p className="mt-2 text-sm text-surface-500">
        Sotong24Work 제작 완료 → 검수 → 승인 후 이곳에 자동 등록될 예정입니다.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href="/contact" variant="primary" size="md">
          제작 의뢰
        </Button>
        <Button href="/products" variant="outline" size="md">
          전체 상품 보기
        </Button>
        <Link href="/services" className="inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700">
          서비스 살펴보기 →
        </Link>
      </div>
    </div>
  );
}
