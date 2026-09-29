import { httpsCallable, type HttpsCallableResult } from "firebase/functions";
import { getFirebaseFunctions } from "@/lib/firebase";

export type EbookChapterBodyResult = {
  productId: string;
  chapterId: string;
  title: { ko: string; en: string };
  accessTier: "premium";
  pages: { paragraphs: { ko: string; en: string }[] }[];
};

export type EbookChapterFetchErrorCode =
  | "unauthenticated"
  | "permission-denied"
  | "invalid-argument"
  | "not-found"
  | "internal"
  | "unavailable";

export class EbookChapterFetchError extends Error {
  constructor(
    readonly code: EbookChapterFetchErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "EbookChapterFetchError";
  }
}

function mapCallableError(e: unknown): EbookChapterFetchError {
  const err = e as { code?: string; message?: string };
  const raw = String(err?.code || "");
  if (raw.includes("unauthenticated")) {
    return new EbookChapterFetchError("unauthenticated", "로그인이 필요합니다.");
  }
  if (raw.includes("permission-denied")) {
    return new EbookChapterFetchError("permission-denied", "이 콘텐츠에 접근할 권한이 없습니다.");
  }
  if (raw.includes("not-found")) {
    return new EbookChapterFetchError("not-found", "챕터를 찾을 수 없습니다.");
  }
  if (raw.includes("invalid-argument")) {
    return new EbookChapterFetchError("invalid-argument", "요청이 올바르지 않습니다.");
  }
  return new EbookChapterFetchError("unavailable", "본문을 불러오지 못했습니다.");
}

/**
 * Authenticated Callable — server verifies Auth token + productEntitlement/admin.
 * Never send isAdmin/userTier/previewAccess as authority (server ignores them).
 */
export async function fetchEbookChapterBody(input: {
  productId: string;
  chapterId: string;
}): Promise<EbookChapterBodyResult> {
  const functions = getFirebaseFunctions();
  if (!functions) {
    throw new EbookChapterFetchError("unavailable", "서비스를 사용할 수 없습니다.");
  }
  try {
    const fn = httpsCallable<{ productId: string; chapterId: string }, EbookChapterBodyResult>(
      functions,
      "getEbookChapterBody",
    );
    const res: HttpsCallableResult<EbookChapterBodyResult> = await fn({
      productId: input.productId,
      chapterId: input.chapterId,
    });
    const data = res.data;
    if (!data?.chapterId || !Array.isArray(data.pages)) {
      throw new EbookChapterFetchError("internal", "응답이 올바르지 않습니다.");
    }
    return data;
  } catch (e) {
    if (e instanceof EbookChapterFetchError) throw e;
    throw mapCallableError(e);
  }
}
