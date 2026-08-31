"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthProvider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AccessDenied } from "@/components/auth/AccessDenied";
import { AccessLevelBadge } from "@/components/membership/AccessLevelBadge";
import { ExternalSiteSecurityNotice } from "@/components/membership/ExternalSiteSecurityNotice";
import { businessAreas } from "@/data/businesses";
import {
  businessPortalAccess,
  canExposeExternalSiteLink,
  EXTERNAL_SITE_MEMBER_NOTICE,
} from "@/data/business-access";
import { memberContentCatalog } from "@/data/member-content-catalog";
import { canAccessLevel, fetchMemberContentBody } from "@/lib/entitlements";
import { getPublicExternalSiteUrl } from "@/lib/business-sites";
import type { PublicationStatus } from "@/types/membership";
import { publicationStatusLabels } from "@/data/business-access";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/Icons";

function MemberContentCard({
  contentId,
  title,
  teaser,
  accessLevel,
  publicationStatus,
  canAccess,
}: {
  contentId: string;
  title: string;
  teaser: string;
  accessLevel: "member" | "premium";
  publicationStatus: PublicationStatus;
  canAccess: boolean;
}) {
  const [body, setBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const isPublished = publicationStatus === "published";
  const showOpenButton = isPublished && canAccess;

  async function handleLoad() {
    if (!showOpenButton || body) return;
    setLoading(true);
    setLoadError(false);
    try {
      const doc = await fetchMemberContentBody(contentId);
      if (doc?.body) {
        setBody(doc.body);
      } else {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded-xl border border-surface-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-semibold text-surface-900">{title}</h3>
        <AccessLevelBadge accessLevel={accessLevel} publicationStatus={publicationStatus} />
      </div>
      <p className="mt-2 text-sm text-surface-600">{teaser}</p>

      {!isPublished ? (
        <p className="mt-4 text-sm text-surface-500">
          {publicationStatusLabels[publicationStatus]} — 콘텐츠가 준비되면 공개됩니다.
        </p>
      ) : !canAccess ? (
        <div className="mt-4">
          <AccessDenied
            title={accessLevel === "premium" ? "프리미엄 이용 권한이 필요합니다" : "회원 로그인이 필요합니다"}
            description={
              accessLevel === "premium"
                ? "이 콘텐츠는 프리미엄 이용 권한이 활성화된 회원만 열람할 수 있습니다. 결제 연동 전까지는 안내만 제공됩니다."
                : "회원 가입 후 이용할 수 있는 콘텐츠입니다."
            }
            showLoginCta={accessLevel === "member"}
            showDashboardCta={false}
          />
        </div>
      ) : (
        <div className="mt-4">
          {!body && !loadError && (
            <button
              type="button"
              onClick={handleLoad}
              disabled={loading}
              className="inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "불러오는 중…" : "콘텐츠 열기"}
            </button>
          )}
          {loadError && (
            <p className="text-sm text-surface-500">
              콘텐츠가 아직 준비 중이거나 접근 권한이 없습니다.
            </p>
          )}
          {body && (
            <div className="mt-3 rounded-lg bg-surface-50 p-4 text-sm leading-relaxed text-surface-800">
              {body}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function DashboardContent() {
  const { user, profile, entitlements } = useAuth();
  const displayName = profile?.displayName || user?.email?.split("@")[0] || "회원";

  const memberContents = memberContentCatalog.filter((c) => c.accessLevel === "member");
  const premiumContents = memberContentCatalog.filter((c) => c.accessLevel === "premium");

  return (
    <div className="section-padding bg-surface-50">
      <div className="container-main">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-600">회원 포털</p>
            <h1 className="mt-1 text-2xl font-bold text-surface-900">
              안녕하세요, {displayName}님
            </h1>
            <p className="mt-2 text-sm text-surface-600">
              이용 가능한 사업과 회원 콘텐츠를 확인하세요.
            </p>
          </div>
          <Button href="/account" variant="outline" className="min-h-11 shrink-0">
            계정 설정
          </Button>
        </div>

        <section className="mb-10" aria-labelledby="business-list-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="business-list-heading" className="text-lg font-bold text-surface-900">
              이용 가능한 사업
            </h2>
            <ExternalSiteSecurityNotice className="max-w-md text-xs leading-relaxed text-surface-500" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessAreas.map((area) => {
              const portal = businessPortalAccess[area.id];
              const externalUrl = getPublicExternalSiteUrl(area);
              const showExternalLink = canExposeExternalSiteLink(area.id);
              const hasAccess = canAccessLevel(
                portal.accessLevel,
                area.id,
                true,
                entitlements,
              );
              const isLocked = !hasAccess;

              return (
                <article
                  key={area.id}
                  className="flex flex-col rounded-xl border border-surface-200 bg-white p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <ServiceIcon name={area.icon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        <AccessLevelBadge
                          accessLevel={portal.accessLevel}
                          publicationStatus={portal.publicationStatus}
                        />
                        {isLocked && (
                          <span className="inline-flex rounded-md bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600 ring-1 ring-surface-200">
                            잠금
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-semibold text-surface-900">{area.titleKo}</h3>
                      <p className="mt-1 text-sm text-surface-600">{area.tagline}</p>
                      {!showExternalLink && (
                        <p className="mt-2 text-xs leading-relaxed text-surface-500">
                          {EXTERNAL_SITE_MEMBER_NOTICE}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    {isLocked ? (
                      <Button href="/signup" variant="primary" className="min-h-11 w-full">
                        무료 회원으로 보기
                      </Button>
                    ) : (
                      <>
                        <Button href={area.internalPath} variant="primary" className="min-h-11 w-full">
                          서비스 보기
                        </Button>
                        {showExternalLink && externalUrl && (
                          <Button href={externalUrl} variant="outline" external className="min-h-11 w-full">
                            전문 사이트 ↗
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-10" aria-labelledby="member-content-heading">
          <h2 id="member-content-heading" className="text-lg font-bold text-surface-900">
            무료 이용 가능 콘텐츠
          </h2>
          <p className="mt-1 text-sm text-surface-600">
            회원 가입 후 이용할 수 있는 콘텐츠입니다. 본문은 서버에서 권한 확인 후 로드됩니다.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {memberContents.map((item) => (
              <MemberContentCard
                key={item.id}
                contentId={item.id}
                title={item.title}
                teaser={item.teaser}
                accessLevel="member"
                publicationStatus={item.publicationStatus}
                canAccess={canAccessLevel(item.accessLevel, item.businessId, true, entitlements)}
              />
            ))}
          </div>
        </section>

        <section className="mb-10" aria-labelledby="premium-content-heading">
          <h2 id="premium-content-heading" className="text-lg font-bold text-surface-900">
            프리미엄 콘텐츠
          </h2>
          <p className="mt-1 text-sm text-surface-600">
            프리미엄 이용 권한이 활성화된 회원만 열람할 수 있습니다. 결제 연동은 향후 제공 예정입니다.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {premiumContents.map((item) => (
              <MemberContentCard
                key={item.id}
                contentId={item.id}
                title={item.title}
                teaser={item.teaser}
                accessLevel="premium"
                publicationStatus={item.publicationStatus}
                canAccess={canAccessLevel(item.accessLevel, item.businessId, true, entitlements)}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-lg font-bold text-surface-900">
            최근 이용 항목
          </h2>
          <div className="mt-4 rounded-xl border border-dashed border-surface-300 bg-white p-6 text-center">
            <p className="text-sm text-surface-500">
              최근 이용 기록은 향후 연결됩니다.
            </p>
            <Link
              href="/guide"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              서비스 이용 안내 보기 →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export function DashboardView() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
