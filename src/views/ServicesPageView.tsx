import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { services } from "@/data/services";
import { serviceLabels, pageLabels } from "@/i18n/page-labels";
import { localizePath } from "@/i18n/localized-path";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceIcon } from "@/components/ui/Icons";

export function ServicesPageView({ locale }: { locale: Locale }) {
  const labels = pageLabels[locale].services;

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader title={labels.title} description={labels.description} />
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => {
            const en = serviceLabels.en[service.slug];
            const title = locale === "en" && en ? en.title : service.title;
            const description = locale === "en" && en ? en.description : service.description;
            return (
              <Link
                key={service.id}
                href={localizePath(service.href, locale)}
                className="flex gap-4 rounded-2xl border border-surface-200 p-6 transition-all hover:border-brand-300 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                  <ServiceIcon name={service.icon} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-surface-900">{title}</h2>
                  <p className="mt-1 text-sm text-surface-600">{description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
