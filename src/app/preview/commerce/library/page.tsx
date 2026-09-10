"use client";

import { Suspense } from "react";
import Link from "next/link";
import {
  PREVIEW_BASE,
  mockLibraryItems,
  mockMemberLabels,
  mockOrders,
} from "@/data/preview-commerce";
import { PreviewCta, PreviewEmpty, PreviewShell } from "@/components/preview/commerce/PreviewChrome";
import {
  MemberStateSwitcher,
  useMockMemberState,
} from "@/components/preview/commerce/PreviewMemberState";
import {
  IconJourneyLibrary,
  IconStatusAllowed,
  IconStatusBlocked,
  MemberStatusIcon,
} from "@/components/preview/commerce/PreviewIcons";

function LibraryInner() {
  const member = useMockMemberState();
  const isGuest = member === "guest";
  const basicOk = member === "basic_active" || member === "basic_cancelled";

  return (
    <PreviewShell
      title="내 자료실"
      subtitle="구매내역 · 이용권한 · Basic 상태 예시"
      backHref={PREVIEW_BASE}
    >
      <div className="space-y-8">
        <MemberStateSwitcher basePath={`${PREVIEW_BASE}/library`} />

        <section className="rounded-2xl border border-surface-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <MemberStatusIcon
                state={member}
                size="md"
                decorative={false}
                title={mockMemberLabels[member]}
              />
            </span>
            <div>
              <p className="text-sm text-surface-500">현재 예시 상태</p>
              <p className="text-xl font-semibold text-surface-900">
                {mockMemberLabels[member]}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-surface-600">
            {member === "basic_active" && "정기이용이 유지되는 예시입니다."}
            {member === "basic_expired" &&
              "기간이 끝나 Free로 바뀐 예시입니다. Basic 포함 자료는 차단됩니다."}
            {member === "basic_cancelled" &&
              "해지 예약이 잡혀 있고, 기간이 끝날 때까지는 이용 가능한 예시입니다."}
            {member === "free" && "무료 회원으로 단건 구매 자료만 이용하는 예시입니다."}
            {member === "guest" && "로그인 전 빈 상태를 보여 줍니다."}
          </p>
          {(member === "basic_expired" || member === "free" || member === "guest") && (
            <div className="mt-4">
              <PreviewCta href={`${PREVIEW_BASE}/pricing`}>Basic 요금 보기</PreviewCta>
            </div>
          )}
        </section>

        {isGuest ? (
          <PreviewEmpty
            title="아직 자료가 없습니다"
            body="시제품에서는 회원 상태를 바꿔 구매 자료와 차단 예시를 볼 수 있습니다."
            actionHref={`${PREVIEW_BASE}/library?member=free`}
            actionLabel="Free 회원 예시 보기"
          />
        ) : (
          <>
            <section>
              <div className="flex items-center gap-2">
                <IconJourneyLibrary size="sm" className="text-brand-700" decorative />
                <h2 className="text-lg font-semibold text-surface-900">구매한 자료</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {mockLibraryItems.map((item) => {
                  const locked = item.status === "Basic 필요" && !basicOk;
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-200 bg-white px-4 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 text-surface-500">
                          {locked ? (
                            <IconStatusBlocked size="sm" decorative={false} title="접근 제한" />
                          ) : (
                            <IconStatusAllowed size="sm" decorative={false} title="접근 허용" />
                          )}
                        </span>
                        <div>
                          <p className="font-medium text-surface-900">{item.title}</p>
                          <p className="text-sm text-surface-500">
                            {item.type} · {locked ? "이용권한 없음" : item.status}
                          </p>
                        </div>
                      </div>
                      {locked ? (
                        <Link
                          href={`${PREVIEW_BASE}/pricing`}
                          className="inline-flex min-h-11 items-center rounded-lg bg-surface-900 px-4 text-sm text-white"
                        >
                          Basic 필요
                        </Link>
                      ) : (
                        <Link
                          href={`${PREVIEW_BASE}/product/${item.productSlug}?member=${member}`}
                          className="inline-flex min-h-11 items-center rounded-lg border border-surface-200 px-4 text-sm text-surface-800 hover:bg-surface-50"
                        >
                          열기
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-surface-900">구매 내역</h2>
              <ul className="mt-4 divide-y divide-surface-100 overflow-hidden rounded-2xl border border-surface-200 bg-white">
                {mockOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-surface-900">{order.title}</p>
                      <p className="text-surface-500">
                        {order.date} · {order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-surface-800">{order.amount}</p>
                      <p className="text-surface-500">{order.status}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </PreviewShell>
  );
}

export default function PreviewLibraryPage() {
  return (
    <Suspense
      fallback={
        <PreviewShell title="내 자료실" subtitle="불러오는 중…">
          <div className="h-40 animate-pulse rounded-2xl bg-surface-100" />
        </PreviewShell>
      }
    >
      <LibraryInner />
    </Suspense>
  );
}
