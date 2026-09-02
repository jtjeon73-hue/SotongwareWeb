import type { Locale } from "@/i18n/config";
import { createLocalePageMetadata } from "@/i18n/metadata";
import { pageLabels } from "@/i18n/page-labels";
import { businessProcesses, commonProcessSteps } from "@/data/process";
import { businessAreas } from "@/data/businesses";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CommonProcessGrid, ProcessStepFlow } from "@/components/process/ProcessStepFlow";
import { LocalizedButton } from "@/components/locale/LocalizedButton";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].process;
  return createLocalePageMetadata({ locale, title: l.title, description: l.description, path: "/process" });
}

export default async function ProcessPage({ params }: PageProps) {
  const { locale } = await params;
  const l = pageLabels[locale].process;
  const commonTitle = locale === "en" ? "Common production process" : "공통 제작 프로세스";
  const commonDesc =
    locale === "en"
      ? "Core steps applied across all business areas."
      : "모든 분야에 공통으로 적용되는 핵심 단계입니다.";
  const businessTitle = locale === "en" ? "Process by business area" : "분야별 제작 프로세스";

  return (
    <div className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader eyebrow={l.eyebrow} title={l.title} description={l.description} />
        <section className="mb-12" aria-labelledby="common-process-heading">
          <h2 id="common-process-heading" className="text-lg font-bold text-surface-900">
            {commonTitle}
          </h2>
          <p className="mt-1 text-sm text-surface-600">{commonDesc}</p>
          <div className="mt-6">
            <CommonProcessGrid steps={commonProcessSteps} />
          </div>
        </section>
        <section aria-labelledby="business-process-heading">
          <h2 id="business-process-heading" className="text-lg font-bold text-surface-900">
            {businessTitle}
          </h2>
          <div className="mt-6 space-y-8">
            {businessAreas.map((area) => {
              const proc = businessProcesses.find((p) => p.id === area.id);
              if (!proc) return null;
              return (
                <div key={area.id} className="rounded-2xl border border-surface-200 p-6">
                  <h3 className="font-bold text-surface-900">
                    {locale === "en" ? area.title : area.titleKo}
                  </h3>
                  <div className="mt-4">
                    <ProcessStepFlow steps={proc.steps} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <div className="mt-10 flex flex-wrap gap-3">
          <LocalizedButton href="/contact" variant="primary" className="min-h-11">
            {locale === "en" ? "Contact us" : "상담·제작 문의"}
          </LocalizedButton>
          <LocalizedButton href="/guide" variant="outline" className="min-h-11">
            {locale === "en" ? "Usage guide" : "이용 안내"}
          </LocalizedButton>
        </div>
      </div>
    </div>
  );
}
