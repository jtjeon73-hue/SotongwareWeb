import { authorizeEbookChapterAccess } from "./authorize";
import type {
  AuthContext,
  ChapterBodyResponse,
  EbookContentProvider,
  ProductEntitlementLookup,
} from "./types";

export class EbookChapterAccessError extends Error {
  constructor(
    readonly code:
      | "unauthenticated"
      | "permission-denied"
      | "invalid-argument"
      | "not-found"
      | "internal",
    message: string,
  ) {
    super(message);
    this.name = "EbookChapterAccessError";
  }
}

function asNonEmptyString(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/**
 * Core handler — authorization separated from content storage.
 * Client flags (isAdmin, userTier, previewAccess, email, uid, accessLevel) are ignored.
 */
export async function handleGetEbookChapterBody(input: {
  auth: AuthContext | null;
  data: Record<string, unknown>;
  entitlements: ProductEntitlementLookup;
  content: EbookContentProvider;
  now?: Date;
}): Promise<ChapterBodyResponse> {
  const productId = asNonEmptyString(input.data.productId ?? input.data.slug, 120);
  const chapterId = asNonEmptyString(input.data.chapterId, 80);

  if (!productId || !chapterId) {
    throw new EbookChapterAccessError("invalid-argument", "productId와 chapterId가 필요합니다.");
  }

  // Explicitly discard client-forged privilege fields (must not affect authz).
  void input.data.isAdmin;
  void input.data.userTier;
  void input.data.previewAccess;
  void input.data.email;
  void input.data.uid;
  void input.data.userId;
  void input.data.accessLevel;

  if (!input.auth?.uid) {
    throw new EbookChapterAccessError("unauthenticated", "로그인이 필요합니다.");
  }

  const rows = await input.entitlements.listProductEntitlements(input.auth.uid);
  const authz = authorizeEbookChapterAccess({
    auth: input.auth,
    productId,
    entitlements: rows,
    now: input.now,
  });

  if (!authz.ok) {
    throw new EbookChapterAccessError("permission-denied", "이 콘텐츠에 접근할 권한이 없습니다.");
  }

  const chapter = await input.content.getChapter(productId, chapterId);
  if (!chapter) {
    throw new EbookChapterAccessError("not-found", "챕터를 찾을 수 없습니다.");
  }

  // Minimal response — no provenance, paths, SHA, or sibling chapters.
  return {
    productId,
    chapterId: chapter.id,
    title: chapter.title,
    accessTier: "premium",
    pages: chapter.pages,
  };
}
