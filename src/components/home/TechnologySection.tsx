import { technologies } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";

const categories = ["산업", "개발", "기술", "콘텐츠"];

export function TechnologySection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="technology-heading">
      <div className="container-main">
        <SectionHeader
          id="technology-heading"
          title="Technology & Capability"
          description="실제 기술 역량을 기반으로 신뢰할 수 있는 솔루션을 제공합니다."
        />

        <div className="space-y-8">
          {categories.map((category) => {
            const items = technologies.filter((t) => t.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-500">
                  {category}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((tech) => (
                    <span
                      key={tech.id}
                      className="rounded-lg border border-surface-200 bg-surface-50 px-4 py-2 text-sm font-medium text-surface-700"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
