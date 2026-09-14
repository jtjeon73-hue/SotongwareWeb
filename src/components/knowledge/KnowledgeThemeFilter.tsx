"use client";

import type { Locale } from "@/i18n/config";
import type { KnowledgeThemeId } from "@/data/service-catalog";
import { knowledgeThemeLabels, knowledgeThemes } from "@/data/service-catalog";
import { LocalizedLink } from "@/components/locale/LocalizedLink";
import { useSearchParams } from "next/navigation";

function isTheme(v: string | null): v is KnowledgeThemeId {
  return !!v && (knowledgeThemes as string[]).includes(v);
}

export function KnowledgeThemeFilter({
  locale,
  active,
}: {
  locale: Locale;
  active?: KnowledgeThemeId;
}) {
  const searchParams = useSearchParams();
  const fromUrl = isTheme(searchParams.get("theme")) ? searchParams.get("theme")! : undefined;
  const themeFilter = active ?? fromUrl;

  return (
    <div className="flex flex-wrap gap-2">
      <LocalizedLink
        href="/knowledge"
        className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium ${
          !themeFilter ? "bg-emerald-600 text-white" : "border border-emerald-200 bg-white text-emerald-900"
        }`}
      >
        {locale === "en" ? "All" : "전체"}
      </LocalizedLink>
      {knowledgeThemes.map((id) => (
        <LocalizedLink
          key={id}
          href={`/knowledge?theme=${id}`}
          className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium ${
            themeFilter === id
              ? "bg-emerald-600 text-white"
              : "border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
          }`}
        >
          {knowledgeThemeLabels[id][locale]}
        </LocalizedLink>
      ))}
    </div>
  );
}
