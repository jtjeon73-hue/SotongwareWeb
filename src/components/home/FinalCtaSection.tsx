import { finalCtaContent } from "@/data/home";
import { Button } from "@/components/ui/Button";

export function FinalCtaSection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="final-cta-heading">
      <div className="container-main">
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 text-center sm:p-12">
          <h2
            id="final-cta-heading"
            className="text-2xl font-bold text-surface-900 sm:text-3xl"
          >
            {finalCtaContent.title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-surface-600">
            {finalCtaContent.description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            {finalCtaContent.actions.map((action) => (
              <Button
                key={action.href}
                href={action.href}
                variant={action.variant}
                size="lg"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
