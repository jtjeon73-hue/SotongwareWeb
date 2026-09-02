import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { HomeDictionary } from "@/i18n/types";

interface WorkflowSectionProps {
  dict: HomeDictionary;
}

export function WorkflowSection({ dict }: WorkflowSectionProps) {
  const { workflow } = dict;

  return (
    <section className="section-padding bg-surface-900 text-white" aria-labelledby="workflow-heading">
      <div className="container-main">
        <SectionHeader
          id="workflow-heading"
          eyebrow={workflow.eyebrow}
          title={workflow.title}
          description={workflow.description}
          align="center"
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflow.steps.map((step) => (
            <li
              key={step.step}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold">
                {step.step}
              </span>
              <h3 className="mt-3 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-400">{step.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Button
            href={workflow.ctaHref}
            variant="secondary"
            className="min-h-11 !border-white/25 !bg-white/10 !text-white hover:!bg-white/20"
          >
            {workflow.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
