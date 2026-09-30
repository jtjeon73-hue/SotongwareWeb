"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getKnowledgeSiteBySlug, knowledgeMemberRailMeta, KNOWLEDGE_MEMBER_GUIDE_ID } from "@/data/service-catalog";
import type { KnowledgeDisclaimerType } from "@/data/service-catalog";
import { useAuth } from "@/contexts/AuthProvider";
import {
  fetchKnowledgeMemberBody,
  KnowledgeMemberFetchError,
  type KnowledgeMemberBodyResult,
} from "@/lib/knowledge-member-api";
import { MembershipGate } from "@/components/access/MembershipGate";
import { EbookMarkdownParagraph } from "@/components/ebook/EbookMarkdownParagraph";
import { LocalizedLink } from "@/components/locale/LocalizedLink";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; body: KnowledgeMemberBodyResult }
  | { status: "denied" }
  | { status: "error" };

function ymylBanner(locale: Locale, type: KnowledgeDisclaimerType): string {
  if (type === "ymyl_health") {
    return locale === "en"
      ? "General health education only—not diagnosis or a substitute for medical care. For emergencies or serious symptoms, seek a medical facility."
      : "일반 건강정보·교육 목적입니다. 진단이나 의료행위를 대체하지 않습니다. 응급·심각 증상이 있으면 의료기관을 이용해 주세요.";
  }
  return locale === "en"
    ? "Educational finance content only. Not personalized investment, tax, or legal advice. Decisions are your responsibility."
    : "교육용 금융 정보입니다. 개인 맞춤 투자·세무·법률 조언이 아니며, 결정과 책임은 이용자에게 있습니다.";
}

function formatWon(amount: number, locale: Locale): string {
  return locale === "en"
    ? `₩${amount.toLocaleString("en-US")}`
    : `${amount.toLocaleString("ko-KR")}원`;
}

/** Honest pricing/preparing block — no fake live payment, no auto-renew. */
function PrepaidPlans({ locale }: { locale: Locale }) {
  const { plans } = knowledgeMemberRailMeta;
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-50 p-4" data-member-rail="plans">
      <p className="text-sm font-semibold text-surface-900">
        {locale === "en" ? "Basic membership (prepaid term)" : "Basic 회원 (기간제 이용권)"}
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {plans.map((plan) => (
          <li
            key={plan.productId}
            className="min-w-0 rounded-lg border border-surface-200 bg-white px-3 py-2.5"
          >
            <p className="text-sm font-semibold text-surface-900">{plan.label[locale]}</p>
            <p className="mt-0.5 text-base font-bold text-emerald-800">
              {formatWon(plan.amount, locale)}
              <span className="ml-1 text-xs font-medium text-surface-600">
                / {locale === "en" ? `${plan.termDays} days prepaid` : `${plan.termDays}일 선결제`}
              </span>
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-surface-600">
        {locale === "en"
          ? "Prepaid term — it does not auto-renew and no recurring charge is made. Checkout is preparing: this screen does not complete a real payment."
          : "기간제 선결제 이용권이며 자동갱신·정기결제가 아닙니다. 결제 오픈은 준비 중이며, 이 화면에서 실제 결제가 완료되지 않습니다."}
      </p>
      <span
        className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-surface-200 bg-white px-3 text-sm font-medium text-surface-600"
        aria-disabled="true"
      >
        {locale === "en" ? "Checkout preparing" : "결제 준비 중"}
      </span>
    </div>
  );
}

function RailTeaser({ locale }: { locale: Locale }) {
  const meta = knowledgeMemberRailMeta;
  return (
    <div data-member-rail="teaser">
      <p className="text-sm leading-relaxed text-surface-700">{meta.summary[locale]}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-surface-500">
        {locale === "en" ? "Routes inside" : "포함된 경로"}
      </p>
      <ul className="mt-2 grid gap-1.5 text-sm text-surface-700 sm:grid-cols-2">
        {meta.routeTitles.map((r) => (
          <li
            key={r.ko}
            className="min-w-0 break-words rounded-lg border border-surface-100 bg-surface-50 px-3 py-2"
          >
            {r[locale]}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RailBody({ body, locale }: { body: KnowledgeMemberBodyResult; locale: Locale }) {
  return (
    <div className="space-y-8" data-member-rail="authorized">
      {body.sections.map((section) => (
        <section key={section.id} aria-labelledby={`member-rail-${section.id}`} className="min-w-0">
          <h4 id={`member-rail-${section.id}`} className="text-base font-bold text-surface-900">
            {section.title[locale]}
          </h4>
          {section.disclaimerType ? (
            <div
              role="note"
              data-member-rail-ymyl={section.disclaimerType}
              className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
            >
              {ymylBanner(locale, section.disclaimerType)}
            </div>
          ) : null}
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-surface-800">
            {section.paragraphs.map((p, i) => (
              <EbookMarkdownParagraph key={i} text={p[locale]} />
            ))}
          </div>
          {section.relatedSiteSlugs.length > 0 && section.relatedSiteSlugs.length < 12 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {section.relatedSiteSlugs.map((slug) => {
                const site = getKnowledgeSiteBySlug(slug);
                if (!site) return null;
                return (
                  <li key={slug} className="min-w-0">
                    <LocalizedLink
                      href={`/knowledge/sites/${slug}`}
                      className="inline-flex min-h-9 max-w-full items-center rounded-full bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
                    >
                      <span className="truncate">{site.name[locale]}</span>
                    </LocalizedLink>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}

export function KnowledgeMemberRail({ locale }: { locale: Locale }) {
  const { user, loading: authLoading } = useAuth();
  const uid = user?.uid;
  const [load, setLoad] = useState<LoadState>({ status: "idle" });
  const meta = knowledgeMemberRailMeta;

  useEffect(() => {
    // Re-auth re-runs the server check; never keep a previous user's body.
    setLoad({ status: "idle" });
    if (authLoading || !uid) return;

    let cancelled = false;
    setLoad({ status: "loading" });
    fetchKnowledgeMemberBody({ guideId: KNOWLEDGE_MEMBER_GUIDE_ID })
      .then((body) => {
        if (!cancelled) setLoad({ status: "ready", body });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        if (
          e instanceof KnowledgeMemberFetchError &&
          (e.code === "permission-denied" || e.code === "unauthenticated")
        ) {
          setLoad({ status: "denied" });
        } else {
          setLoad({ status: "error" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [uid, authLoading]);

  const signedIn = Boolean(uid);

  return (
    <section
      className="mt-12 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6"
      aria-labelledby="knowledge-member-rail-heading"
      data-knowledge-section="member-benefit"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-800 ring-1 ring-sky-200">
          {locale === "en" ? "Basic member benefit" : "Basic 회원 혜택"}
        </span>
      </div>
      <h3
        id="knowledge-member-rail-heading"
        className="mt-3 min-w-0 break-words text-lg font-bold text-surface-900"
      >
        {meta.title[locale]}
      </h3>

      <div className="mt-4 space-y-5">
        {!signedIn || load.status === "idle" || load.status === "denied" ? (
          <>
            <RailTeaser locale={locale} />
            {signedIn && load.status === "denied" ? (
              <div data-member-rail="denied">
                <MembershipGate
                  locale={locale}
                  title={locale === "en" ? "Basic membership required" : "Basic 회원 이용권이 필요합니다"}
                  description={
                    locale === "en"
                      ? "The server did not find an active Basic membership term for this account. Checkout is preparing."
                      : "이 계정에서 활성 Basic 회원 이용권을 확인하지 못했습니다. 결제 오픈은 준비 중입니다."
                  }
                />
              </div>
            ) : null}
            {!signedIn ? (
              <div data-member-rail="guest">
                <MembershipGate
                  locale={locale}
                  title={locale === "en" ? "Sign in to read the rail" : "로그인 후 열람할 수 있습니다"}
                  description={
                    locale === "en"
                      ? "Basic members read this guide after the server checks an active membership. The 12 public hubs stay free."
                      : "Basic 회원은 서버가 활성 이용권을 확인한 뒤 이 안내서를 읽을 수 있습니다. 12개 공개 허브는 계속 무료입니다."
                  }
                />
              </div>
            ) : null}
            <PrepaidPlans locale={locale} />
          </>
        ) : null}

        {signedIn && load.status === "loading" ? (
          <div
            className="rounded-2xl border border-sky-200 bg-sky-50/80 p-5"
            role="status"
            data-member-rail="loading"
          >
            <p className="text-sm font-semibold text-sky-950">
              {locale === "en" ? "Checking membership…" : "회원 이용권을 확인하는 중…"}
            </p>
          </div>
        ) : null}

        {signedIn && load.status === "error" ? (
          <div
            className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5"
            role="alert"
            data-member-rail="fail-closed"
          >
            <p className="text-sm font-semibold text-rose-950">
              {locale === "en" ? "Could not load the rail" : "학습 레일을 불러오지 못했습니다"}
            </p>
            <p className="mt-2 text-sm text-rose-900/80">
              {locale === "en"
                ? "Fail-closed: member text is not shown when the server is unavailable."
                : "fail-closed: 서버 오류 시 회원 전용 본문을 표시하지 않습니다."}
            </p>
          </div>
        ) : null}

        {signedIn && load.status === "ready" ? <RailBody body={load.body} locale={locale} /> : null}
      </div>
    </section>
  );
}
