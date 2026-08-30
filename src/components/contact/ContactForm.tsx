"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { httpsCallable } from "firebase/functions";
import { getFirebaseFunctions, isFirebaseConfigured } from "@/lib/firebase";
import { trackEvent } from "@/lib/analytics";
import {
  INQUIRY_TYPES,
  TOPIC_TO_INQUIRY,
  type ContactFormData,
  type InquiryType,
} from "@/types/contact";
import { isContactSubmissionAvailable } from "@/config/platform-status";

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  subject?: string;
  message?: string;
  privacyConsent?: string;
}

interface ContactFormProps {
  defaultTopic?: string;
  defaultProductSlug?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

function validateForm(data: ContactFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) errors.name = "이름을 입력해 주세요.";
  else if (data.name.length > 100) errors.name = "이름은 100자 이내로 입력해 주세요.";

  if (!data.email.trim()) errors.email = "이메일을 입력해 주세요.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "올바른 이메일 형식을 입력해 주세요.";
  } else if (data.email.length > 200) {
    errors.email = "이메일은 200자 이내로 입력해 주세요.";
  }

  if (!data.phone.trim()) errors.phone = "연락처를 입력해 주세요.";
  else if (data.phone.length > 30) errors.phone = "연락처는 30자 이내로 입력해 주세요.";

  if (!data.inquiryType) errors.inquiryType = "문의 유형을 선택해 주세요.";

  if (!data.subject.trim()) errors.subject = "제목을 입력해 주세요.";
  else if (data.subject.length > 200) errors.subject = "제목은 200자 이내로 입력해 주세요.";

  if (!data.message.trim()) errors.message = "문의 내용을 입력해 주세요.";
  else if (data.message.length > 5000) errors.message = "문의 내용은 5000자 이내로 입력해 주세요.";

  if (!data.privacyConsent) errors.privacyConsent = "개인정보 처리 동의가 필요합니다.";

  return errors;
}

export function ContactForm({ defaultTopic, defaultProductSlug }: ContactFormProps) {
  const startedRef = useRef(false);
  const contactAvailable = isContactSubmissionAvailable();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const initialInquiry: InquiryType =
    defaultTopic && TOPIC_TO_INQUIRY[defaultTopic]
      ? TOPIC_TO_INQUIRY[defaultTopic]
      : "general";

  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: initialInquiry,
    subject: defaultProductSlug ? `[상품 문의] ${defaultProductSlug}` : "",
    message: "",
    privacyConsent: false,
    website: "",
  });

  const trackStart = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("contact_start", {
      inquiry_type: form.inquiryType,
      source_page: "/contact",
    });
  }, [form.inquiryType]);

  useEffect(() => {
    if (defaultProductSlug && !form.message) {
      setForm((prev) => ({
        ...prev,
        message: `상품(${defaultProductSlug}) 관련 문의입니다.\n`,
      }));
    }
  }, [defaultProductSlug, form.message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const errors = validateForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!isFirebaseConfigured()) {
      setGlobalError("문의 시스템이 아직 설정되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      trackEvent("contact_error", { inquiry_type: form.inquiryType, source_page: "/contact" });
      return;
    }

    setStatus("submitting");
    setGlobalError(null);

    trackEvent("contact_submit", {
      inquiry_type: form.inquiryType,
      source_page: "/contact",
    });

    try {
      const functions = getFirebaseFunctions();
      if (!functions) throw new Error("Firebase not configured");

      const submitContact = httpsCallable(functions, "submitContactInquiry");
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company?.trim() || undefined,
        inquiryType: form.inquiryType,
        subject: form.subject.trim(),
        message: form.message.trim(),
        source: "sotongware-web",
        sourcePage: "/contact",
        productSlug: defaultProductSlug || undefined,
        website: form.website || undefined,
      });

      setStatus("success");
      trackEvent("contact_success", {
        inquiry_type: form.inquiryType,
        source_page: "/contact",
      });
      trackEvent("conversion_complete", {
        conversion_type: "contact_inquiry",
        inquiry_type: form.inquiryType,
        source_page: "/contact",
      });
    } catch {
      setStatus("error");
      setGlobalError("문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      trackEvent("contact_error", {
        inquiry_type: form.inquiryType,
        source_page: "/contact",
      });
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <p className="font-semibold">문의가 정상적으로 접수되었습니다.</p>
        <p className="mt-2 text-sm">담당자가 확인 후 연락드리겠습니다.</p>
        <Link href="/" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-700">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website ?? ""}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      {globalError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {globalError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-surface-900">
            이름 <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            maxLength={100}
            className="mt-1 block w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            value={form.name}
            onFocus={trackStart}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-surface-900">
            이메일 <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            maxLength={200}
            className="mt-1 block w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            value={form.email}
            onFocus={trackStart}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-surface-900">
            연락처 <span className="text-red-600">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            maxLength={30}
            className="mt-1 block w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            value={form.phone}
            onFocus={trackStart}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-surface-900">
            회사/소속 <span className="text-surface-400">(선택)</span>
          </label>
          <input
            id="company"
            type="text"
            maxLength={200}
            className="mt-1 block w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            value={form.company ?? ""}
            onFocus={trackStart}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="inquiryType" className="block text-sm font-medium text-surface-900">
          문의 유형 <span className="text-red-600">*</span>
        </label>
        <select
          id="inquiryType"
          required
          className="mt-1 block w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          value={form.inquiryType}
          onFocus={trackStart}
          onChange={(e) => setForm({ ...form, inquiryType: e.target.value as InquiryType })}
        >
          {INQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {fieldErrors.inquiryType && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.inquiryType}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-surface-900">
          제목 <span className="text-red-600">*</span>
        </label>
        <input
          id="subject"
          type="text"
          required
          maxLength={200}
          className="mt-1 block w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          value={form.subject}
          onFocus={trackStart}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        {fieldErrors.subject && <p className="mt-1 text-xs text-red-600">{fieldErrors.subject}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-surface-900">
          문의 내용 <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={6}
          maxLength={5000}
          className="mt-1 block w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          value={form.message}
          onFocus={trackStart}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        {fieldErrors.message && <p className="mt-1 text-xs text-red-600">{fieldErrors.message}</p>}
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-surface-700">
          <input
            type="checkbox"
            required
            className="mt-1 rounded border-surface-300"
            checked={form.privacyConsent}
            onChange={(e) => setForm({ ...form, privacyConsent: e.target.checked })}
          />
          <span>
            <Link href="/privacy" className="font-medium text-brand-600 hover:text-brand-700">
              개인정보처리방침
            </Link>
            에 동의합니다. <span className="text-red-600">*</span>
          </span>
        </label>
        {fieldErrors.privacyConsent && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.privacyConsent}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || !contactAvailable}
        className="inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "submitting"
          ? "문의 접수 중..."
          : contactAvailable
            ? "문의 접수"
            : "문의 접수 준비 중"}
      </button>
    </form>
  );
}
