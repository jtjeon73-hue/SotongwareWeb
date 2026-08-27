import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/data/services";
import { ServiceIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Services",
  description: "산업자동화, 앱, 웹, 전자책, 콘텐츠 개발 서비스",
};

export default function ServicesPage() {
  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          title="Services"
          description="SotongWare의 다섯 가지 핵심 제작 서비스입니다. 상세 페이지는 순차적으로 확장됩니다."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="flex gap-4 rounded-2xl border border-surface-200 p-6 hover:border-brand-300 hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <ServiceIcon name={service.icon} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-surface-900">{service.title}</h2>
                <p className="mt-1 text-sm text-surface-600">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
