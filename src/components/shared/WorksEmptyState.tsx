import { Button } from "@/components/ui/Button";
import { worksEmptyContent } from "@/data/home";

interface WorksEmptyStateProps {
  compact?: boolean;
}

export function WorksEmptyState({ compact = false }: WorksEmptyStateProps) {
  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-surface-200 bg-white p-6 sm:p-8"
          : "rounded-2xl border border-surface-200 bg-white p-8 sm:p-10"
      }
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-brand-600">Works Catalog</p>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">
            {worksEmptyContent.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-surface-600 sm:text-base">
            {worksEmptyContent.description}
          </p>

          {!compact && (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-surface-500">
                공개까지의 흐름
              </p>
              <ol className="mt-3 flex flex-wrap items-center gap-2">
                {worksEmptyContent.pipeline.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="rounded-md bg-surface-100 px-2.5 py-1 text-xs font-medium text-surface-700">
                      {step}
                    </span>
                    {i < worksEmptyContent.pipeline.length - 1 && (
                      <span className="text-surface-300" aria-hidden="true">→</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-xs">
          {worksEmptyContent.categories.map((type) => (
            <span
              key={type}
              className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-xs font-medium text-surface-600"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-surface-100 pt-6 sm:flex-row sm:flex-wrap">
        <Button href="/services" variant="primary" size="md">
          서비스 보기
        </Button>
        <Button href="/#what-we-build-heading" variant="outline" size="md">
          제작 분야 보기
        </Button>
        <Button href="/ai-guide" variant="outline" size="md">
          목적별 안내
        </Button>
      </div>
    </div>
  );
}
