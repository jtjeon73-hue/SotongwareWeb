"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { isAuthEmulatorEnabled, getAuthTargetLabel } from "@/lib/auth-safety";

export function AuthLoadingScreen({ message = "로그인 상태를 확인하는 중…" }: { message?: string }) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 motion-reduce:animate-none"
        aria-hidden="true"
      />
      <p className="mt-4 text-sm text-surface-600">{message}</p>
    </div>
  );
}

export function AuthEmulatorBanner() {
  if (!isAuthEmulatorEnabled()) return null;
  return (
    <div
      role="status"
      className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-950"
    >
      {getAuthTargetLabel()} — 운영 계정·실이메일 발송이 아닙니다.
    </div>
  );
}

function MembershipShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="swAuthShield" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="swAuthLock" x1="18" y1="20" x2="30" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8fafc" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <path
        d="M24 4L40 10v12c0 10.5-6.8 18.8-16 22-9.2-3.2-16-11.5-16-22V10L24 4z"
        fill="url(#swAuthShield)"
      />
      <rect x="18" y="22" width="12" height="10" rx="2" fill="url(#swAuthLock)" opacity="0.95" />
      <path d="M21 22v-3a3 3 0 016 0v3" fill="none" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <AuthEmulatorBanner />
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.35)] sm:p-8",
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-[#0f2744] before:via-sky-500 before:to-[#0f2744]",
        )}
      >
        <div className="mb-5 flex items-start gap-3">
          <MembershipShieldIcon className="h-11 w-11 shrink-0 drop-shadow-sm" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
            {description && (
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
            )}
          </div>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 border-t border-slate-100 pt-4">{footer}</div>}
      </div>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  required,
  error,
  hint,
  showPasswordToggle,
}: FormFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPasswordToggle !== false ? (revealed ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-sky-700"> *</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            "min-h-11 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 transition-colors",
            "focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/25",
            isPassword && showPasswordToggle !== false ? "pr-20" : "",
            error ? "border-red-300 bg-red-50/30" : "border-slate-300 bg-white",
          )}
        />
        {isPassword && showPasswordToggle !== false && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute inset-y-0 right-1 my-1 inline-flex min-h-9 min-w-[4.5rem] items-center justify-center rounded-md px-2 text-xs font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-pressed={revealed}
          >
            {revealed ? "숨기기" : "표시"}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormAlert({
  message,
  variant = "error",
}: {
  message: string;
  variant?: "error" | "info" | "success";
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg px-3 py-2.5 text-sm",
        variant === "error" && "border border-red-200 bg-red-50 text-red-800",
        variant === "info" && "border border-sky-200 bg-sky-50 text-sky-950",
        variant === "success" && "border border-emerald-200 bg-emerald-50 text-emerald-900",
      )}
    >
      {message}
    </div>
  );
}

export function SubmitButton({
  children,
  loading,
  disabled,
  loadingLabel,
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  loadingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors",
        "bg-[#0f2744] hover:bg-[#163556] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {loading ? (loadingLabel ?? "…") : children}
    </button>
  );
}

export function GoogleSignInButton({
  onClick,
  loading,
  label = "Google로 계속하기",
}: {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors",
        "hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {label}
    </button>
  );
}
