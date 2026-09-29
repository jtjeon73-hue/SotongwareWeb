/**
 * Canonical private ebook object paths (server-only).
 * Never expose these paths to clients or Callable responses.
 */

const PRODUCT_ID_RE = /^[a-z0-9][a-z0-9-]{0,120}$/;
const CHAPTER_ID_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;

export class EbookStoragePathError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = "EbookStoragePathError";
  }
}

function assertSafeSegment(value: string, kind: "productId" | "chapterId"): string {
  const v = value.trim();
  if (!v) throw new EbookStoragePathError("empty", `${kind} required`);
  if (v.includes("..") || v.includes("/") || v.includes("\\") || v.includes("\0")) {
    throw new EbookStoragePathError("traversal", `${kind} traversal rejected`);
  }
  const re = kind === "productId" ? PRODUCT_ID_RE : CHAPTER_ID_RE;
  if (!re.test(v)) {
    throw new EbookStoragePathError("invalid", `${kind} invalid`);
  }
  return v;
}

export function assertSafeRevision(revision: number): number {
  if (!Number.isInteger(revision) || revision < 1 || revision > 9999) {
    throw new EbookStoragePathError("invalid_revision", "revision invalid");
  }
  return revision;
}

/** private/ebooks/{productId}/r{revision}/chapters/{chapterId}.json */
export function canonicalEbookChapterObjectPath(
  productId: string,
  revision: number,
  chapterId: string,
): string {
  const p = assertSafeSegment(productId, "productId");
  const r = assertSafeRevision(revision);
  const c = assertSafeSegment(chapterId, "chapterId");
  return `private/ebooks/${p}/r${r}/chapters/${c}.json`;
}

/** Future binary layout (not implemented in Phase 3). */
export function canonicalEbookBinaryObjectPath(
  productId: string,
  revision: number,
  fileName: "book.pdf" | "book.epub",
): string {
  const p = assertSafeSegment(productId, "productId");
  const r = assertSafeRevision(revision);
  return `private/ebooks/${p}/r${r}/files/${fileName}`;
}

export const PRIVATE_EBOOK_STORAGE_LAYOUT = {
  chapterObject: "private/ebooks/{productId}/r{revision}/chapters/{chapterId}.json",
  pdfObject: "private/ebooks/{productId}/r{revision}/files/book.pdf",
  epubObject: "private/ebooks/{productId}/r{revision}/files/book.epub",
  clientAccess: "deny_all",
  accessVia: "Functions Admin SDK only (Callable getEbookChapterBody)",
} as const;
