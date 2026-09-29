import type { EbookChapterBody, EbookContentProvider } from "./types";
import {
  EbookStoragePathError,
  canonicalEbookChapterObjectPath,
} from "./storage-path";

export interface StorageObjectReader {
  /** Returns object bytes, or null if missing. */
  download(objectPath: string): Promise<Buffer | null>;
}

type StoredChapterJson = {
  id?: string;
  title?: { ko?: string; en?: string };
  accessTier?: string;
  pages?: EbookChapterBody["pages"];
};

function parseChapterObject(
  productId: string,
  chapterId: string,
  buf: Buffer,
): EbookChapterBody | null {
  let parsed: StoredChapterJson;
  try {
    parsed = JSON.parse(buf.toString("utf8")) as StoredChapterJson;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  if (parsed.id !== chapterId) return null;
  if (parsed.accessTier !== "premium") return null;
  if (!parsed.title || typeof parsed.title.ko !== "string") return null;
  if (!Array.isArray(parsed.pages) || parsed.pages.length === 0) return null;
  for (const page of parsed.pages) {
    if (!page || !Array.isArray(page.paragraphs) || page.paragraphs.length === 0) return null;
  }
  return {
    id: chapterId,
    title: {
      ko: parsed.title.ko,
      en: typeof parsed.title.en === "string" ? parsed.title.en : parsed.title.ko,
    },
    accessTier: "premium",
    pages: parsed.pages,
  };
}

/**
 * Production content provider — Admin SDK / GCS server read only.
 * Client Firebase Storage SDK must never access these objects.
 */
export class FirebaseStorageEbookContentProvider implements EbookContentProvider {
  constructor(
    private readonly reader: StorageObjectReader,
    private readonly revision: number = 2,
  ) {}

  async getChapter(productId: string, chapterId: string): Promise<EbookChapterBody | null> {
    let objectPath: string;
    try {
      objectPath = canonicalEbookChapterObjectPath(productId, this.revision, chapterId);
    } catch (e) {
      if (e instanceof EbookStoragePathError) return null;
      throw e;
    }

    let buf: Buffer | null;
    try {
      buf = await this.reader.download(objectPath);
    } catch {
      // Fail closed — do not leak storage errors to clients via body.
      return null;
    }
    if (!buf) return null;
    return parseChapterObject(productId.trim(), chapterId.trim(), buf);
  }
}

/** In-memory GCS stand-in for unit tests. */
export class MemoryStorageObjectReader implements StorageObjectReader {
  constructor(private readonly objects: Map<string, Buffer>) {}

  async download(objectPath: string): Promise<Buffer | null> {
    return this.objects.get(objectPath) ?? null;
  }
}
