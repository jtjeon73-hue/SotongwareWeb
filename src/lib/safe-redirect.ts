const DEFAULT_REDIRECT = "/dashboard";

/**
 * 로그인/회원가입 후 redirect 쿼리 검증
 * - `/`로 시작하는 내부 경로만 허용
 * - `//`, 프로토콜, javascript:, 역슬래시, 외부 URL 거부
 */
export function sanitizeRedirectPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") {
    return DEFAULT_REDIRECT;
  }

  const trimmed = raw.trim();
  if (!trimmed.startsWith("/")) {
    return DEFAULT_REDIRECT;
  }

  if (trimmed.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }

  if (trimmed.includes("\\")) {
    return DEFAULT_REDIRECT;
  }

  const lower = trimmed.toLowerCase();
  if (lower.includes("javascript:")) {
    return DEFAULT_REDIRECT;
  }

  // 프로토콜 상대·절대 URL (예: /http:, /https:)
  if (/^\/[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return DEFAULT_REDIRECT;
  }

  // URL 인코딩된 프로토콜 우회 (예: /%2f%2fevil.com)
  if (lower.includes("%2f%2f") || lower.includes("%5c")) {
    return DEFAULT_REDIRECT;
  }

  // 호스트가 포함된 형태 (예: /@evil.com, /evil.com)
  if (/^\/\/[^/]/.test(trimmed)) {
    return DEFAULT_REDIRECT;
  }

  return trimmed;
}

export { DEFAULT_REDIRECT };
