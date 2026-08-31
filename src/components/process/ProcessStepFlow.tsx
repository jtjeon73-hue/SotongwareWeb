import { cn } from "@/lib/utils";

interface ProcessStepFlowProps {
  steps: readonly string[] | string[];
  className?: string;
  compact?: boolean;
}

export function ProcessStepFlow({ steps, className, compact }: ProcessStepFlowProps) {
  return (
    <ol className={cn("flex flex-col gap-2", className)}>
      {steps.map((step, index) => (
        <li key={`${step}-${index}`} className="flex items-start gap-2">
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700",
              compact ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-xs",
            )}
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn("font-medium text-surface-900", compact ? "text-sm" : "text-base")}>
              {step}
            </p>
            {index < steps.length - 1 && (
              <span className="mt-1 block text-xs text-surface-400" aria-hidden="true">
                ↓
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

interface CommonProcessGridProps {
  steps: readonly { step: string; title: string; description: string }[];
}

export function CommonProcessGrid({ steps }: CommonProcessGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((item, index) => (
        <div
          key={item.step}
          className="relative rounded-xl border border-surface-200 bg-white p-4"
        >
          <p className="text-xs font-bold text-brand-600">{item.step}</p>
          <h3 className="mt-1 text-sm font-semibold text-surface-900">{item.title}</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-surface-600">{item.description}</p>
          {index < steps.length - 1 && (
            <span
              className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-surface-300 lg:inline"
              aria-hidden="true"
            >
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
