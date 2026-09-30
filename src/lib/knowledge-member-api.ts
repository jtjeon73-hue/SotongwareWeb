import { httpsCallable, type HttpsCallableResult } from "firebase/functions";
import { getFirebaseFunctions } from "@/lib/firebase";

export type KnowledgeMemberSection = {
  id: string;
  title: { ko: string; en: string };
  paragraphs: { ko: string; en: string }[];
  relatedSiteSlugs: string[];
  disclaimerType?: "ymyl_health" | "ymyl_finance";
};

export type KnowledgeMemberBodyResult = {
  guideId: string;
  title: { ko: string; en: string };
  summary: { ko: string; en: string };
  accessTier: "member";
  sections: KnowledgeMemberSection[];
};

export type KnowledgeMemberFetchErrorCode =
  | "unauthenticated"
  | "permission-denied"
  | "invalid-argument"
  | "not-found"
  | "internal"
  | "unavailable";

export class KnowledgeMemberFetchError extends Error {
  constructor(
    readonly code: KnowledgeMemberFetchErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "KnowledgeMemberFetchError";
  }
}

function mapCallableError(e: unknown): KnowledgeMemberFetchError {
  const err = e as { code?: string };
  const raw = String(err?.code || "");
  if (raw.includes("unauthenticated")) {
    return new KnowledgeMemberFetchError("unauthenticated", "로그인이 필요합니다.");
  }
  if (raw.includes("permission-denied")) {
    return new KnowledgeMemberFetchError("permission-denied", "이 콘텐츠에 접근할 권한이 없습니다.");
  }
  if (raw.includes("not-found")) {
    return new KnowledgeMemberFetchError("not-found", "학습 가이드를 찾을 수 없습니다.");
  }
  if (raw.includes("invalid-argument")) {
    return new KnowledgeMemberFetchError("invalid-argument", "요청이 올바르지 않습니다.");
  }
  return new KnowledgeMemberFetchError("unavailable", "본문을 불러오지 못했습니다.");
}

/**
 * Authenticated Callable — server verifies Auth token + membership entitlement/admin.
 * Only guideId is sent — client privilege flags are never authority.
 */
export async function fetchKnowledgeMemberBody(input: {
  guideId: string;
}): Promise<KnowledgeMemberBodyResult> {
  const functions = getFirebaseFunctions();
  if (!functions) {
    throw new KnowledgeMemberFetchError("unavailable", "서비스를 사용할 수 없습니다.");
  }
  try {
    const fn = httpsCallable<{ guideId: string }, KnowledgeMemberBodyResult>(
      functions,
      "getKnowledgeMemberBody",
    );
    const res: HttpsCallableResult<KnowledgeMemberBodyResult> = await fn({
      guideId: input.guideId,
    });
    const data = res.data;
    if (!data?.guideId || !Array.isArray(data.sections)) {
      throw new KnowledgeMemberFetchError("internal", "응답이 올바르지 않습니다.");
    }
    return data;
  } catch (e) {
    if (e instanceof KnowledgeMemberFetchError) throw e;
    throw mapCallableError(e);
  }
}
