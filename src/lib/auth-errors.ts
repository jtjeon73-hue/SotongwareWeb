import type { Locale } from "@/i18n/config";
import { getAuthErrorMessage as getAuthErrorMessageForLocale } from "@/i18n/auth-labels";

/** @deprecated Pass locale explicitly — use getAuthErrorMessage(err, locale) */
export function getAuthErrorMessage(error: unknown, locale: Locale = "ko"): string {
  return getAuthErrorMessageForLocale(error, locale);
}
