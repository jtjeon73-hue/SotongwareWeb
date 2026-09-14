"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { MarketingPackageId, MarketingServiceId, MarketingWorkOrderDraft } from "@/types/marketing-order";
import {
  budgetRangeOptions,
  buildWorkOrderDraft,
  getPackageById,
  intakeChannelOptions,
  marketingOfferServices,
  marketingPackages,
} from "@/data/marketing-services";
import { ComingSoonCta } from "@/components/access/MembershipGate";

const emptyForm = {
  industry: "",
  productOrService: "",
  goal: "",
  targetAudience: "",
  style: "",
  referenceUrl: "",
  deadline: "",
  budgetRange: "",
  notes: "",
};

export function MarketingIntakeForm({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<"quick" | "detail">("quick");
  const [packageId, setPackageId] = useState<MarketingPackageId>("standard");
  const [deliverables, setDeliverables] = useState<MarketingServiceId[]>(["sns", "blog"]);
  const [channels, setChannels] = useState<string[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [draft, setDraft] = useState<MarketingWorkOrderDraft | null>(null);
  const [submittedPreview, setSubmittedPreview] = useState(false);

  const pkg = getPackageById(packageId);

  function toggleDeliverable(id: MarketingServiceId) {
    setDeliverables((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleChannel(label: string) {
    setChannels((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
  }

  function onPreviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Fail-closed: no network, no Firestore, no PII persistence
    const next = buildWorkOrderDraft({
      packageId,
      requirement: {
        industry: form.industry.trim(),
        productOrService: form.productOrService.trim(),
        goal: form.goal.trim(),
        targetAudience: form.targetAudience.trim(),
        deliverables,
        channels,
        style: form.style.trim(),
        referenceUrl: form.referenceUrl.trim() || undefined,
        deadline: form.deadline.trim() || undefined,
        budgetRange: form.budgetRange || undefined,
        notes: mode === "detail" ? form.notes.trim() || undefined : undefined,
      },
      membershipTier: {
        membershipTier: "free",
        notes:
          locale === "en"
            ? "Membership pricing is separate from production fees (preview policy)."
            : "회원료와 제작비는 별도입니다(정책 Preview).",
      },
    });
    setDraft(next);
    setSubmittedPreview(true);
  }

  const summaryLines = useMemo(() => {
    if (!draft) return [];
    return [
      `${locale === "en" ? "Package" : "패키지"}: ${draft.packageId}`,
      `${locale === "en" ? "Services" : "제작물"}: ${draft.serviceIds.join(", ")}`,
      `${locale === "en" ? "Industry" : "업종"}: ${draft.customerRequirement.industry || "—"}`,
      `${locale === "en" ? "Goal" : "목표"}: ${draft.customerRequirement.goal || "—"}`,
      `${locale === "en" ? "Revisions" : "수정"}: ${draft.revisionAllowance}`,
    ];
  }, [draft, locale]);

  return (
    <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["quick", locale === "en" ? "Quick request" : "빠른 신청"],
            ["detail", locale === "en" ? "Detailed request" : "상세 신청"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`min-h-10 rounded-full px-4 text-sm font-medium ${
              mode === id ? "bg-violet-600 text-white" : "border border-violet-200 text-violet-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form className="mt-6 space-y-5" onSubmit={onPreviewSubmit} noValidate>
        <fieldset>
          <legend className="text-sm font-semibold text-surface-900">
            {locale === "en" ? "Package" : "패키지 선택"}
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {marketingPackages.map((p) => (
              <label
                key={p.id}
                className={`cursor-pointer rounded-xl border px-3 py-3 text-sm ${
                  packageId === p.id
                    ? "border-violet-500 bg-violet-50 ring-1 ring-violet-300"
                    : "border-surface-200 hover:border-violet-200"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="package"
                  checked={packageId === p.id}
                  onChange={() => {
                    setPackageId(p.id);
                    setDeliverables(p.suggestedServiceIds);
                  }}
                />
                <span className="font-semibold text-surface-900">{p.name[locale]}</span>
                <span className="mt-1 block text-xs text-violet-700">{p.priceLabel[locale]}</span>
              </label>
            ))}
          </div>
          {pkg ? <p className="mt-2 text-xs text-surface-500">{pkg.blurb[locale]}</p> : null}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            locale={locale}
            label={locale === "en" ? "Industry" : "업종/사업 분야"}
            value={form.industry}
            onChange={(v) => setForm((s) => ({ ...s, industry: v }))}
            required
          />
          <Field
            locale={locale}
            label={locale === "en" ? "Product or service" : "홍보할 상품/서비스"}
            value={form.productOrService}
            onChange={(v) => setForm((s) => ({ ...s, productOrService: v }))}
            required
          />
          <Field
            locale={locale}
            label={locale === "en" ? "Goal" : "목표"}
            value={form.goal}
            onChange={(v) => setForm((s) => ({ ...s, goal: v }))}
            required
          />
          <Field
            locale={locale}
            label={locale === "en" ? "Audience" : "주요 고객층"}
            value={form.targetAudience}
            onChange={(v) => setForm((s) => ({ ...s, targetAudience: v }))}
          />
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-surface-900">
            {locale === "en" ? "Desired deliverables" : "원하는 제작물"}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {marketingOfferServices.map((s) => {
              const on = deliverables.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleDeliverable(s.id)}
                  className={`min-h-10 rounded-full px-3 text-sm ${
                    on ? "bg-violet-600 text-white" : "border border-surface-200 text-surface-700"
                  }`}
                >
                  {s.title[locale]}
                </button>
              );
            })}
          </div>
        </fieldset>

        {mode === "detail" ? (
          <>
            <fieldset>
              <legend className="text-sm font-semibold text-surface-900">
                {locale === "en" ? "Channels" : "홍보 채널"}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {intakeChannelOptions.map((c) => {
                  const label = c[locale];
                  const on = channels.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleChannel(label)}
                      className={`min-h-10 rounded-full px-3 text-sm ${
                        on ? "bg-sky-600 text-white" : "border border-surface-200 text-surface-700"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                locale={locale}
                label={locale === "en" ? "Style / mood" : "분위기/스타일"}
                value={form.style}
                onChange={(v) => setForm((s) => ({ ...s, style: v }))}
              />
              <Field
                locale={locale}
                label={locale === "en" ? "Reference URL" : "참고 URL"}
                value={form.referenceUrl}
                onChange={(v) => setForm((s) => ({ ...s, referenceUrl: v }))}
              />
              <Field
                locale={locale}
                label={locale === "en" ? "Desired deadline" : "원하는 납기"}
                value={form.deadline}
                onChange={(v) => setForm((s) => ({ ...s, deadline: v }))}
              />
              <label className="block text-sm">
                <span className="font-medium text-surface-800">
                  {locale === "en" ? "Budget range" : "예산 범위"}
                </span>
                <select
                  className="mt-1.5 min-h-11 w-full rounded-lg border border-surface-200 px-3"
                  value={form.budgetRange}
                  onChange={(e) => setForm((s) => ({ ...s, budgetRange: e.target.value }))}
                >
                  <option value="">{locale === "en" ? "Select" : "선택"}</option>
                  {budgetRangeOptions.map((b) => (
                    <option key={b.ko} value={b[locale]}>
                      {b[locale]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-medium text-surface-800">
                {locale === "en" ? "Additional notes" : "추가 요청사항"}
              </span>
              <textarea
                className="mt-1.5 min-h-24 w-full rounded-lg border border-surface-200 px-3 py-2"
                value={form.notes}
                onChange={(e) => setForm((s) => ({ ...s, notes: e.target.value }))}
              />
            </label>
          </>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-surface-100 pt-5">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-lg bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            {locale === "en" ? "Preview request summary" : "신청 내용 미리보기"}
          </button>
          <ComingSoonCta
            locale={locale}
            label={locale === "en" ? "Live intake preparing" : "실제 신청·결제는 준비중"}
          />
        </div>
      </form>

      {submittedPreview && draft ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4" role="status">
          <p className="text-sm font-semibold text-amber-950">
            {locale === "en"
              ? "Service preparing — this is a local preview only"
              : "서비스 준비 중 — 이 기기에만 보이는 Preview입니다"}
          </p>
          <p className="mt-1 text-xs text-amber-900/80">
            {locale === "en"
              ? "Nothing was saved to our servers. Future handoff will map this draft to a Control work order."
              : "서버에 저장되지 않았습니다. 향후 이 초안이 Control 작업지시로 매핑될 예정입니다."}
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-800">
            {locale === "en" ? "Planned work-order summary" : "예정 작업지시 요약"}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-950">
            {summaryLines.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
          <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-white/80 p-3 text-[11px] text-surface-700">
            {JSON.stringify(draft, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  locale: Locale;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-surface-800">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        className="mt-1.5 min-h-11 w-full rounded-lg border border-surface-200 px-3"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
