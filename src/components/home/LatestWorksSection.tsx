import Link from "next/link";
import { works } from "@/data/works";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

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
    <section className="section-padding bg-surface-50" aria-labelledby="latest-works-heading">
      <div className="container-main">
        <SectionHeader
          id="latest-works-heading"
          title="Latest Works"
          description="SotongWare가 만든 실제 결과물입니다. 앱, 전자책, 웹, 콘텐츠를 직접 체험하고 사용할 수 있습니다."
        />

        {hasWorks ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {works.slice(0, 6).map((work) => (
              <article
                key={work.id}
                className="rounded-2xl border border-surface-200 bg-white overflow-hidden"
              >
                <div className="aspect-video bg-surface-100 flex items-center justify-center">
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
          <div className="rounded-2xl border border-dashed border-surface-300 bg-white p-8 sm:p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100">
              <svg className="h-8 w-8 text-surface-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-semibold text-surface-900">
              곧 새로운 결과물이 등록됩니다
            </h3>
            <p className="mt-2 max-w-md mx-auto text-sm leading-relaxed text-surface-600">
              앱, 전자책, 웹사이트, 음악, Shorts 등 SotongWare가 제작한 결과물이
              이곳에 자동으로 표시됩니다. 가짜 프로젝트는 넣지 않습니다.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["앱", "전자책", "웹사이트", "자동화", "음악", "Shorts"].map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-600"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button href="/works" variant="outline">
            전체 결과물 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
