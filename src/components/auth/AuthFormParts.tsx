"use client";

import { cn } from "@/lib/utils";

export function AuthLoadingScreen({ message = "로그인 상태를 확인하는 중…" }: { message?: string }) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
        aria-hidden="true"
      />
      <p className="mt-4 text-sm text-surface-600">{message}</p>
    </div>
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
      <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-bold text-surface-900">{title}</h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-surface-600">{description}</p>
        )}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 border-t border-surface-100 pt-4">{footer}</div>}
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
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-surface-800">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          "min-h-11 w-full rounded-lg border px-3 py-2 text-sm text-surface-900 transition-colors",
          "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
          error ? "border-red-300 bg-red-50/30" : "border-surface-300 bg-white",
        )}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-surface-500">
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

export function FormAlert({ message, variant = "error" }: { message: string; variant?: "error" | "info" }) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg px-3 py-2.5 text-sm",
        variant === "error"
          ? "border border-red-200 bg-red-50 text-red-800"
          : "border border-brand-200 bg-brand-50 text-brand-900",
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
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors",
        "bg-brand-600 hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {loading ? "처리 중…" : children}
    </button>
  );
}

export function GoogleSignInButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm font-medium text-surface-800 transition-colors",
        "hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
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
      Google로 계속하기
    </button>
  );
}
