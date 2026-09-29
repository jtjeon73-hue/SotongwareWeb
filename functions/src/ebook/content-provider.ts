import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { EbookChapterBody, EbookContentProvider } from "./types";
import { PRIVATE_EBOOK_STORAGE_LAYOUT } from "./storage-path";

type PrivatePackage = {
  productId?: string;
  slug?: string;
  chapters?: Array<{
    id: string;
    title: { ko: string; en: string };
    accessTier: string;
    pages: EbookChapterBody["pages"];
  }>;
};

/**
 * Local/dev content provider — reads gitignored private ingest artifact.
 * Never expose this path to clients. Production must use Firebase Storage provider.
 *
 * Path convention (Phase 1 ingest):
 *   {root}/{productId}/r{revision}/private-content.json
 */
export class LocalPrivateArtifactProvider implements EbookContentProvider {
  constructor(
    private readonly rootDir: string,
    private readonly revision: number = 2,
  ) {}

  async getChapter(productId: string, chapterId: string): Promise<EbookChapterBody | null> {
    const id = productId.trim();
    const chapter = chapterId.trim();
    if (!id || !chapter) return null;

    const file = join(this.rootDir, id, `r${this.revision}`, "private-content.json");
    if (!existsSync(file)) return null;

    let pkg: PrivatePackage;
    try {
      pkg = JSON.parse(readFileSync(file, "utf8")) as PrivatePackage;
    } catch {
      return null;
    }

    const pkgId = pkg.productId || pkg.slug;
    if (pkgId !== id) return null;

    const found = (pkg.chapters || []).find((c) => c.id === chapter);
    if (!found || found.accessTier !== "premium") return null;
    if (!Array.isArray(found.pages) || found.pages.length === 0) return null;

    // Return only the requested chapter — never the whole book / provenance.
    return {
      id: found.id,
      title: found.title,
      accessTier: "premium",
      pages: found.pages,
    };
  }
}

/** In-memory provider for unit tests. */
export class MemoryEbookContentProvider implements EbookContentProvider {
  constructor(private readonly byKey: Map<string, EbookChapterBody>) {}

  static key(productId: string, chapterId: string): string {
    return `${productId}::${chapterId}`;
  }

  async getChapter(productId: string, chapterId: string): Promise<EbookChapterBody | null> {
    return this.byKey.get(MemoryEbookContentProvider.key(productId, chapterId)) ?? null;
  }
}

/** @deprecated Use PRIVATE_EBOOK_STORAGE_LAYOUT from storage-path.ts */
export const FUTURE_PRIVATE_STORAGE_LAYOUT = PRIVATE_EBOOK_STORAGE_LAYOUT;
