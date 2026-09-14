"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { EbookCatalogItem } from "@/data/service-catalog";
import { personaToTier, tierMeetsRequirement } from "@/types/access-tier";
import { AccessBadge } from "@/components/access/AccessBadge";
import { MembershipGate } from "@/components/access/MembershipGate";
import { PreviewPersonaBar, usePreviewPersona } from "@/components/access/PreviewPersonaBar";
import { LocalizedLink } from "@/components/locale/LocalizedLink";

function progressKey(slug: string) {
  return `sw-ebook-progress:${slug}`;
}

export function EbookReaderClient({ book, locale }: { book: EbookCatalogItem; locale: Locale }) {
  const persona = usePreviewPersona();
  const userTier = personaToTier(persona);

  const flatPages = useMemo(() => {
    const pages: {
      chapterId: string;
      chapterTitle: string;
      accessTier: (typeof book.chapters)[0]["accessTier"];
      paragraphs: string[];
    }[] = [];
    for (const ch of book.chapters) {
      for (const page of ch.pages) {
        pages.push({
          chapterId: ch.id,
          chapterTitle: ch.title[locale],
          accessTier: ch.accessTier,
          paragraphs: page.paragraphs.map((p) => p[locale]),
        });
      }
    }
    return pages;
  }, [book, locale]);

  const [index, setIndex] = useState(0);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(progressKey(book.slug));
      if (!raw) return;
      const parsed = JSON.parse(raw) as { index?: number; fontScale?: number };
      if (typeof parsed.index === "number" && parsed.index >= 0 && parsed.index < flatPages.length) {
        setIndex(parsed.index);
      }
      if (typeof parsed.fontScale === "number" && parsed.fontScale >= 0.9 && parsed.fontScale <= 1.4) {
        setFontScale(parsed.fontScale);
      }
    } catch {
      /* ignore */
    }
  }, [book.slug, flatPages.length]);

  useEffect(() => {
    try {
      localStorage.setItem(progressKey(book.slug), JSON.stringify({ index, fontScale }));
    } catch {
      /* ignore */
    }
  }, [book.slug, index, fontScale]);

  const page = flatPages[index];
  const unlocked = page ? tierMeetsRequirement(userTier, page.accessTier) : false;
  const progress = flatPages.length ? Math.round(((index + 1) / flatPages.length) * 100) : 0;

  return (
    <div className="min-h-[70vh] bg-[linear-gradient(180deg,#eef6ff_0%,#ffffff_30%)]">
      <div className="border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="container-main flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <LocalizedLink href={`/ebooks/${book.slug}`} className="text-sm font-medium text-brand-700">
              ← {locale === "en" ? "Book detail" : "도서 상세"}
            </LocalizedLink>
            <h1 className="text-lg font-bold text-surface-900">{book.title[locale]}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-surface-600">
            <span>
              {locale === "en" ? "Progress" : "진행률"} {progress}%
            </span>
            <button
              type="button"
              className="min-h-10 rounded-lg border border-surface-200 px-3 hover:bg-surface-50"
              onClick={() => setFontScale((v) => Math.max(0.9, Number((v - 0.1).toFixed(1))))}
              aria-label={locale === "en" ? "Decrease text size" : "글자 작게"}
            >
              A−
            </button>
            <button
              type="button"
              className="min-h-10 rounded-lg border border-surface-200 px-3 hover:bg-surface-50"
              onClick={() => setFontScale((v) => Math.min(1.4, Number((v + 0.1).toFixed(1))))}
              aria-label={locale === "en" ? "Increase text size" : "글자 크게"}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      <div className="container-main grid gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <PreviewPersonaBar locale={locale} />
          <nav aria-label={locale === "en" ? "Chapters" : "목차"} className="rounded-2xl border border-surface-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-surface-500">
              {locale === "en" ? "Contents" : "목차"}
            </p>
            <ul className="mt-3 space-y-2">
              {book.toc.map((item) => {
                const firstIdx = flatPages.findIndex((p) => p.chapterId === item.id);
                const locked = !tierMeetsRequirement(userTier, item.accessTier);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={firstIdx < 0}
                      onClick={() => firstIdx >= 0 && setIndex(firstIdx)}
                      className={`flex w-full items-start justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-sky-50 ${
                        page?.chapterId === item.id ? "bg-sky-50 font-semibold text-brand-800" : "text-surface-700"
                      }`}
                    >
                      <span>{item.title[locale]}</span>
                      {locked ? <AccessBadge tier={item.accessTier} locale={locale} /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <p className="text-[11px] leading-relaxed text-surface-500">
            {locale === "en"
              ? "Reader preview disables text selection as a soft DRM cue. Full DRM is deferred."
              : "Reader Preview는 소프트 DRM 신호로 텍스트 선택을 제한합니다. 완전한 DRM은 별도 단계입니다."}
          </p>
        </aside>

        <main className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-8">
          {page ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-surface-800">{page.chapterTitle}</p>
                <AccessBadge tier={page.accessTier} locale={locale} />
              </div>
              <div
                className={`mt-6 space-y-4 leading-relaxed text-surface-800 ${unlocked ? "select-none" : ""}`}
                style={{ fontSize: `${fontScale}rem` }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {unlocked ? (
                  page.paragraphs.map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <MembershipGate locale={locale} />
                )}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-surface-100 pt-4">
                <button
                  type="button"
                  className="min-h-11 rounded-lg border border-surface-200 px-4 text-sm font-medium disabled:opacity-40"
                  disabled={index <= 0}
                  onClick={() => setIndex((v) => Math.max(0, v - 1))}
                >
                  {locale === "en" ? "Previous" : "이전"}
                </button>
                <p className="text-sm text-surface-500">
                  {index + 1} / {flatPages.length}
                </p>
                <button
                  type="button"
                  className="min-h-11 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
                  disabled={index >= flatPages.length - 1}
                  onClick={() => setIndex((v) => Math.min(flatPages.length - 1, v + 1))}
                >
                  {locale === "en" ? "Next" : "다음"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-surface-600">{locale === "en" ? "No pages" : "페이지 없음"}</p>
          )}
        </main>
      </div>
    </div>
  );
}
