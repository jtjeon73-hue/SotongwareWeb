"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { EbookCatalogItem } from "@/data/service-catalog";
import { useAuth } from "@/contexts/AuthProvider";
import {
  EbookChapterFetchError,
  fetchEbookChapterBody,
  type EbookChapterBodyResult,
} from "@/lib/ebook-chapter-api";
import {
  higherAccessTier,
  personaToTier,
  tierMeetsRequirement,
  type AccessTier,
} from "@/types/access-tier";
import { AccessBadge } from "@/components/access/AccessBadge";
import { MembershipGate } from "@/components/access/MembershipGate";
import { PreviewPersonaBar, usePreviewPersona } from "@/components/access/PreviewPersonaBar";
import { LocalizedLink } from "@/components/locale/LocalizedLink";

function progressKey(slug: string) {
  return `sw-ebook-progress:${slug}`;
}

type ReaderSlot = {
  chapterId: string;
  chapterTitle: string;
  accessTier: AccessTier;
  paragraphs: string[];
  bodySource: "inline" | "private";
};

type PrivateLoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; body: EbookChapterBodyResult }
  | { status: "denied" }
  | { status: "error" };

function PremiumChapterPanel({
  locale,
  signedIn,
  load,
}: {
  locale: Locale;
  signedIn: boolean;
  load: PrivateLoadState;
}) {
  if (!signedIn) {
    return (
      <div data-ebook-body="premium-locked">
        <MembershipGate
          locale={locale}
          title={locale === "en" ? "Premium chapter" : "프리미엄 챕터"}
          description={
            locale === "en"
              ? "Sign in with a purchase or admin account. Preview persona cannot unlock server content."
              : "구매 또는 admin 계정으로 로그인이 필요합니다. Preview persona만으로는 서버 본문을 열 수 없습니다."
          }
        />
      </div>
    );
  }

  if (load.status === "loading" || load.status === "idle") {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-5" role="status" data-ebook-body="loading">
        <p className="text-sm font-semibold text-sky-950">
          {locale === "en" ? "Loading premium chapter…" : "프리미엄 본문을 불러오는 중…"}
        </p>
      </div>
    );
  }

  if (load.status === "denied") {
    return (
      <div data-ebook-body="premium-denied">
        <MembershipGate
          locale={locale}
          title={locale === "en" ? "Access denied" : "접근 권한 없음"}
          description={
            locale === "en"
              ? "Server entitlement check failed. Purchase this ebook or use an admin account."
              : "서버 entitlement 검증에 실패했습니다. 해당 전자책 구매 또는 admin 권한이 필요합니다."
          }
        />
      </div>
    );
  }

  if (load.status === "error") {
    return (
      <div
        className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5"
        role="alert"
        data-ebook-body="fail-closed"
      >
        <p className="text-sm font-semibold text-rose-950">
          {locale === "en" ? "Could not load chapter" : "본문을 불러오지 못했습니다"}
        </p>
        <p className="mt-2 text-sm text-rose-900/80">
          {locale === "en"
            ? "Fail-closed: premium text is not shown when the server is unavailable."
            : "fail-closed: 서버 오류 시 프리미엄 본문을 표시하지 않습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ebook-body="premium-authorized">
      {load.body.pages.flatMap((page, pi) =>
        page.paragraphs.map((para, i) => <p key={`${pi}-${i}`}>{para[locale]}</p>),
      )}
    </div>
  );
}

export function EbookReaderClient({ book, locale }: { book: EbookCatalogItem; locale: Locale }) {
  const { user } = useAuth();
  const persona = usePreviewPersona();
  // PreviewPersona affects free/member UX simulation only — never authorizes private fetch.
  const previewTier = personaToTier(persona);
  const signedIn = Boolean(user);

  const flatPages = useMemo(() => {
    const slots: ReaderSlot[] = [];
    for (const ch of book.chapters) {
      if (ch.pages.length === 0) {
        slots.push({
          chapterId: ch.id,
          chapterTitle: ch.title[locale],
          accessTier: ch.accessTier,
          paragraphs: [],
          bodySource: "private",
        });
        continue;
      }
      for (const page of ch.pages) {
        slots.push({
          chapterId: ch.id,
          chapterTitle: ch.title[locale],
          accessTier: ch.accessTier,
          paragraphs: page.paragraphs.map((p) => p[locale]),
          bodySource: "inline",
        });
      }
    }
    return slots;
  }, [book, locale]);

  const [index, setIndex] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [privateCache, setPrivateCache] = useState<Record<string, PrivateLoadState>>({});

  useEffect(() => {
    // Re-auth must re-run server entitlement checks (never keep preview/forged unlock state).
    setPrivateCache({});
  }, [user?.uid]);

  const page = flatPages[index];
  // Inline free preview may use preview persona; private chapters never trust preview for unlock.
  const inlineUserTier = higherAccessTier(signedIn ? "member" : "free", previewTier);
  const inlineUnlocked =
    page?.bodySource === "inline" ? tierMeetsRequirement(inlineUserTier, page.accessTier) : false;

  const loadPrivate = useCallback(
    async (chapterId: string) => {
      if (!user) {
        setPrivateCache((prev) => ({ ...prev, [chapterId]: { status: "denied" } }));
        return;
      }
      setPrivateCache((prev) => ({ ...prev, [chapterId]: { status: "loading" } }));
      try {
        const body = await fetchEbookChapterBody({
          productId: book.slug,
          chapterId,
        });
        setPrivateCache((prev) => ({ ...prev, [chapterId]: { status: "ready", body } }));
      } catch (e) {
        if (e instanceof EbookChapterFetchError && e.code === "permission-denied") {
          setPrivateCache((prev) => ({ ...prev, [chapterId]: { status: "denied" } }));
        } else if (e instanceof EbookChapterFetchError && e.code === "unauthenticated") {
          setPrivateCache((prev) => ({ ...prev, [chapterId]: { status: "denied" } }));
        } else {
          setPrivateCache((prev) => ({ ...prev, [chapterId]: { status: "error" } }));
        }
      }
    },
    [book.slug, user],
  );

  useEffect(() => {
    if (!page || page.bodySource !== "private") return;
    const existing = privateCache[page.chapterId];
    if (existing && existing.status !== "idle") return;
    if (!signedIn) {
      setPrivateCache((prev) => ({ ...prev, [page.chapterId]: { status: "denied" } }));
      return;
    }
    void loadPrivate(page.chapterId);
  }, [page, signedIn, privateCache, loadPrivate]);

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

  const privateState: PrivateLoadState =
    page?.bodySource === "private"
      ? privateCache[page.chapterId] || { status: signedIn ? "idle" : "denied" }
      : { status: "idle" };

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
                const showBadge = item.accessTier !== "free";
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
                      {showBadge ? <AccessBadge tier={item.accessTier} locale={locale} /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <p className="text-[11px] leading-relaxed text-surface-500">
            {locale === "en"
              ? "Premium chapters load only after server entitlement checks. Preview persona is mock-only."
              : "프리미엄 장은 서버 entitlement 검증 후에만 로드됩니다. Preview persona는 mock 전용입니다."}
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
                className={`mt-6 space-y-4 leading-relaxed text-surface-800 ${
                  page.bodySource === "inline" && inlineUnlocked ? "select-none" : ""
                }`}
                style={{ fontSize: `${fontScale}rem` }}
                onContextMenu={(e) => e.preventDefault()}
              >
                {page.bodySource === "private" ? (
                  <PremiumChapterPanel locale={locale} signedIn={signedIn} load={privateState} />
                ) : inlineUnlocked ? (
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
