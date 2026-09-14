"use client";

import { useState } from "react";

/** Preview-only: never calls Toss or Functions. */
export function PreviewPaymentBlockedButton({
  label = "결제하기",
}: {
  label?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() =>
          setMessage(
            "현재 결제 시스템 준비 중입니다. 정식 서비스 오픈 후 이용할 수 있습니다.",
          )
        }
        className="inline-flex w-full min-h-11 items-center justify-center rounded-xl border border-brand-600 bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
      >
        {label}
      </button>
      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
