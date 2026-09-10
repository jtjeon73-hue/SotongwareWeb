"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  PREVIEW_BASE,
  mockMemberLabels,
  type MockMemberState,
} from "@/data/preview-commerce";

const STATES: MockMemberState[] = [
  "guest",
  "free",
  "basic_active",
  "basic_expired",
  "basic_cancelled",
];

export function useMockMemberState(): MockMemberState {
  const params = useSearchParams();
  const raw = params.get("member") ?? "free";
  if (STATES.includes(raw as MockMemberState)) return raw as MockMemberState;
  return "free";
}

export function MemberStateSwitcher({ basePath }: { basePath: string }) {
  const current = useMockMemberState();
  const params = useSearchParams();

  const links = useMemo(() => {
    return STATES.map((state) => {
      const next = new URLSearchParams(params.toString());
      next.set("member", state);
      const q = next.toString();
      return { state, href: `${basePath}?${q}` };
    });
  }, [basePath, params]);

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-surface-900">회원 상태 예시 전환</p>
      <p className="mt-1 text-xs text-surface-500">
        시제품용입니다. 실제 계정·이용권한은 바뀌지 않습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map(({ state, href }) => {
          const active = state === current;
          return (
            <Link
              key={state}
              href={href}
              className={`inline-flex min-h-11 items-center rounded-lg border px-3 text-sm ${
                active
                  ? "border-brand-600 bg-brand-50 font-medium text-brand-800"
                  : "border-surface-200 bg-surface-50 text-surface-700 hover:bg-white"
              }`}
            >
              {mockMemberLabels[state]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AccessGateDemo({
  productTitle,
  requiresBasic,
}: {
  productTitle: string;
  requiresBasic: boolean;
}) {
  const member = useMockMemberState();
  const allowed =
    !requiresBasic ||
    member === "basic_active" ||
    member === "basic_cancelled";

  return (
    <div
      className={`mt-6 rounded-2xl border p-5 ${
        allowed
          ? "border-farm-500/40 bg-farm-50"
          : "border-rose-300 bg-rose-50"
      }`}
    >
      <p className="text-sm font-semibold text-surface-900">
        이용권한 {allowed ? "허용" : "차단"} 예시
      </p>
      <p className="mt-2 text-sm text-surface-700">
        {allowed
          ? `「${productTitle}」 전체를 열람할 수 있는 상태로 보입니다.`
          : `「${productTitle}」은 Basic 이용 중에만 열립니다. 지금은 ${mockMemberLabels[member]} 예시입니다.`}
      </p>
      {!allowed ? (
        <Link
          href={`${PREVIEW_BASE}/pricing`}
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          Basic 요금 보기
        </Link>
      ) : null}
    </div>
  );
}
