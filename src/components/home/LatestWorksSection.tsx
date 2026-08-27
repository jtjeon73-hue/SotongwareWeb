import Link from "next/link";
import { works } from "@/data/works";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WorksEmptyState } from "@/components/shared/WorksEmptyState";

const workTypeLabels: Record<string, string> = {
  app: "앱",
  ebook: "전자책",
  website: "웹사이트",
  automation: "자동화",
  music: "음악",
  shorts: "Shorts",
  video: "영상",
  article: "아티클",
};

export function LatestWorksSection() {
  const hasWorks = works.length > 0;

  return (
    <section className="section-padding section-alt" aria-labelledby="latest-works-heading">
      <div className="container-main">
        <SectionHeader
          id="latest-works-heading"
          eyebrow="Portfolio"
          title="Latest Works"
          description="SotongWare가 실제로 만들고 배포한 결과물입니다. 앱, 전자책, 웹, 콘텐츠를 직접 체험할 수 있습니다."
        />

        {hasWorks ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {works.slice(0, 6).map((work) => (
              <article
                key={work.id}
                className="overflow-hidden rounded-xl border border-surface-200 bg-white"
              >
                <div className="flex aspect-video items-center justify-center bg-surface-100">
                  {work.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={work.thumbnail} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm text-surface-400">
                      {workTypeLabels[work.type] ?? work.type}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-brand-600">
                    {workTypeLabels[work.type] ?? work.type}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-surface-900">
                    {work.title}
                  </h3>
                  {work.subtitle && (
                    <p className="mt-1 text-sm text-surface-600">{work.subtitle}</p>
                  )}
                  <Link
                    href={`/works/${work.slug}`}
                    className="mt-3 inline-flex text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    자세히 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <WorksEmptyState compact />
        )}
      </div>
    </section>
  );
}
