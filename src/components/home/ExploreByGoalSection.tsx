import Link from "next/link";
import { exploreGoals } from "@/data/home";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceIcon } from "@/components/ui/Icons";

export function ExploreByGoalSection() {
  return (
    <section className="section-padding section-alt" aria-labelledby="explore-goal-heading">
      <div className="container-main">
        <SectionHeader
          id="explore-goal-heading"
          eyebrow="Find Your Path"
          title="목적으로 찾기"
          description="기술 용어를 몰라도 괜찮습니다. 지금 필요한 목적만 선택하면 관련 서비스와 결과물로 안내합니다."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exploreGoals.map((goal) => (
            <Link
              key={goal.id}
              href={goal.href}
              className="group flex items-start gap-4 rounded-xl border border-surface-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50/30 sm:p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100">
                <ServiceIcon name={goal.icon} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-surface-900 group-hover:text-brand-700 sm:text-base">
                  {goal.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-surface-600">
                  {goal.description}
                </p>
                <span className="mt-2 inline-flex text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                  안내 보기 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
