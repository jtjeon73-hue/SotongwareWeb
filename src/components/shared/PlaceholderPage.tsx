import { Button } from "@/components/ui/Button";

interface PlaceholderPageProps {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}

export function PlaceholderPage({
  title,
  description,
  backHref = "/",
  backLabel = "홈으로",
}: PlaceholderPageProps) {
  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-2xl">
        <h1 className="text-3xl font-bold text-surface-900">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-surface-600">
          {description}
        </p>
        <p className="mt-4 text-sm text-surface-500">
          이 페이지는 1차 골격 구축 단계에서 준비된 라우트입니다. 콘텐츠는 순차적으로 추가됩니다.
        </p>
        <div className="mt-8">
          <Button href={backHref} variant="outline">
            {backLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
