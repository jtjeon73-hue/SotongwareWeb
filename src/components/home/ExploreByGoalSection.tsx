import Link from "next/link";
import { exploreGoals } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceIcon } from "@/components/ui/Icons";

export function ExploreByGoalSection() {
  return (
    <section className="section-padding bg-surface-50" aria-labelledby="explore-goal-heading">
      <div className="container-main">
        <SectionHeader
          id="explore-goal-heading"
          title="Explore by Goal"
          description="기술 이름을 몰라도 괜찮습니다. 원하는 목적만 선택하면 관련 서비스와 결과물을 안내합니다."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exploreGoals.map((goal) => (
            <Link
              key={goal.id}
              href={goal.href}
              className="group flex items-start gap-4 rounded-2xl border border-surface-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100">
                <ServiceIcon name={goal.icon} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-surface-900 group-hover:text-brand-700">
                  {goal.title}
                </h3>
                <p className="mt-1 text-sm text-surface-600">
                  {goal.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
