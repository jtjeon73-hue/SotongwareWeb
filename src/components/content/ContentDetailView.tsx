import type { Locale } from "@/i18n/config";
import type { ContentCatalogItem } from "@/data/service-catalog";
import { contentFormatLabels } from "@/data/service-catalog";
import { AccessBadge, OpsStatusBadge } from "@/components/access/AccessBadge";
import { ComingSoonCta, MembershipGate } from "@/components/access/MembershipGate";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { PreviewPersonaBar } from "@/components/access/PreviewPersonaBar";
import { Suspense } from "react";

const TONE: Record<string, string> = {
  rose: "from-rose-200 via-pink-50 to-white",
  sky: "from-sky-200 via-cyan-50 to-white",
  amber: "from-amber-200 via-orange-50 to-white",
  violet: "from-violet-200 via-fuchsia-50 to-white",
  emerald: "from-emerald-200 via-teal-50 to-white",
  slate: "from-slate-300 via-slate-100 to-white",
};

export function ContentDetailView({ item, locale }: { item: ContentCatalogItem; locale: Locale }) {
  return (
    <div className="bg-[linear-gradient(180deg,#fff7fb_0%,#ffffff_50%)]">
      <div className="section-padding">
        <div className="container-main max-w-3xl">
          <LocalizedLink href="/contents" className="text-sm font-medium text-rose-700">
            ← {locale === "en" ? "Content library" : "콘텐츠 라이브러리"}
          </LocalizedLink>
          <div className={`mt-6 aspect-video rounded-2xl border border-rose-100 bg-gradient-to-br ${TONE[item.coverTone]}`} />
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-800 ring-1 ring-rose-200">
              {contentFormatLabels[item.formatId][locale]}
            </span>
            <AccessBadge tier={item.accessTier} locale={locale} />
            <OpsStatusBadge status={item.status} locale={locale} />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-surface-950">{item.title[locale]}</h1>
          <p className="mt-3 text-base leading-relaxed text-surface-700">{item.summary[locale]}</p>
          <p className="mt-3 text-sm text-surface-500">
            {item.theme[locale]} · {item.channel[locale]}
          </p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <PreviewPersonaBar locale={locale} />
            </Suspense>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-rose-200 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-surface-800">
              {locale === "en" ? "Playback preview placeholder" : "재생 Preview 자리"}
            </p>
            <p className="mt-2 text-sm text-surface-600">
              {locale === "en"
                ? "Real embeds link only after review. No fake view counts."
                : "실제 임베드는 검수 후 연결합니다. 가짜 조회수는 표시하지 않습니다."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <ComingSoonCta locale={locale} label={locale === "en" ? "Play when published" : "공개 후 재생"} />
              <ComingSoonCta locale={locale} label={locale === "en" ? "Purchase later" : "구매·구독 준비중"} />
            </div>
          </div>
          <div className="mt-6">
            <MembershipGate locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
