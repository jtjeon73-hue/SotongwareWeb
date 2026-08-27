import Link from "next/link";
import { services } from "@/data/services";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceIcon } from "@/components/ui/Icons";

export function WhatWeBuildSection() {
  const featured = services.find((s) => s.featured);
  const others = services.filter((s) => !s.featured);

  return (
    <section className="section-padding bg-white" aria-labelledby="what-we-build-heading">
      <div className="container-main">
        <SectionHeader
          id="what-we-build-heading"
          eyebrow="Core Capabilities"
          title="What We Build"
          description="다섯 가지 영역에서 실제 문제를 해결하는 디지털 자산을 제작합니다. 각 영역의 결과물은 Works에서 확인할 수 있습니다."
        />

        {featured && (
          <article
            className="mb-6 rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 sm:p-8 lg:p-10"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                  Core Strength
                </span>
                <div className="mt-4 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <ServiceIcon name={featured.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-surface-900 sm:text-2xl">
                      {featured.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-brand-700">
                      {featured.subtitle}
                    </p>
                  </div>
                </div>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                      만드는 것
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-surface-800">
                      {featured.makesWhat}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                      고객 가치
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-surface-800">
                      {featured.customerValue}
                    </dd>
                  </div>
                </dl>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {featured.valuePoints.map((point) => (
                    <li
                      key={point}
                      className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-surface-700 ring-1 ring-brand-100"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Link
                  href={featured.href}
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  서비스 상세
                </Link>
                {featured.worksHref && (
                  <Link
                    href={featured.worksHref}
                    className="inline-flex items-center justify-center rounded-lg border border-brand-300 bg-white px-5 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    관련 결과물 보기
                  </Link>
                )}
              </div>
            </div>
          </article>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {others.map((service) => (
            <article
              key={service.id}
              className="group rounded-xl border border-surface-200 p-5 transition-colors hover:border-surface-300 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-brand-700 group-hover:bg-brand-50">
                  <ServiceIcon name={service.icon} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-surface-900 sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-brand-600">{service.subtitle}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                    만드는 것
                  </dt>
                  <dd className="mt-0.5 text-sm text-surface-700">{service.makesWhat}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-surface-400">
                    고객 가치
                  </dt>
                  <dd className="mt-0.5 text-sm text-surface-600">{service.customerValue}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={service.href}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  서비스 보기 →
                </Link>
                {service.worksHref && (
                  <Link
                    href={service.worksHref}
                    className="text-sm font-medium text-surface-500 hover:text-surface-700"
                  >
                    결과물 →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
