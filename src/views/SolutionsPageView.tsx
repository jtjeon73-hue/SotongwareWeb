import type { Locale } from "@/i18n/config";
import { pageLabels, solutionItems, placeholderLabels } from "@/i18n/page-labels";
import { localizePath } from "@/i18n/localized-path";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Link from "next/link";

export function SolutionsPageView({ locale }: { locale: Locale }) {
  const labels = pageLabels[locale].solutions;
  const items = solutionItems[locale];

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader title={labels.title} description={labels.description} />
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={localizePath(`/solutions/${item.slug}`, locale)}
              className="rounded-2xl border border-surface-200 p-6 transition-all hover:border-brand-300 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-surface-900">{item.title}</h2>
              <p className="mt-2 text-sm text-surface-600">{item.description}</p>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-sm text-surface-500">{placeholderLabels[locale].skeletonNote}</p>
      </div>
    </div>
  );
}
