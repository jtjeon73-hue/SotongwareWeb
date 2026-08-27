import Link from "next/link";
import { services } from "@/data/services";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceIcon } from "@/components/ui/Icons";

export function WhatWeBuildSection() {
  return (
    <section className="section-padding bg-white" aria-labelledby="what-we-build-heading">
      <div className="container-main">
        <SectionHeader
          id="what-we-build-heading"
          title="What We Build"
          description="다섯 가지 핵심 영역에서 실제 문제를 해결하고, 지속적인 가치를 만드는 디지털 자산을 제작합니다."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group rounded-2xl border border-surface-200 bg-surface-50 p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <ServiceIcon name={service.icon} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-surface-900">
                {service.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-brand-600">
                {service.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-surface-600">
                {service.description}
              </p>
              <ul className="mt-4 space-y-2">
                {service.valuePoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-surface-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="mt-5 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                자세히 보기
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
