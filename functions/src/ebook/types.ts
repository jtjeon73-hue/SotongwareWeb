/** Localized paragraph — matches public catalog shape (ko/en). */
export type EbookParagraph = { ko: string; en: string };

export type EbookPage = { paragraphs: EbookParagraph[] };

export type EbookChapterBody = {
  id: string;
  title: { ko: string; en: string };
  accessTier: "premium";
  pages: EbookPage[];
};

export type ProductEntitlementRow = {
  productId: string;
  status: string;
  expiresAt: Date | null;
};

export type AuthContext = {
  uid: string;
  /** Decoded ID token claims from Firebase Auth — only role=admin is trusted for admin. */
  token: Record<string, unknown>;
};

export type ChapterBodyResponse = {
  productId: string;
  chapterId: string;
  title: { ko: string; en: string };
  accessTier: "premium";
  pages: EbookPage[];
};

export interface EbookContentProvider {
  getChapter(productId: string, chapterId: string): Promise<EbookChapterBody | null>;
}

export interface ProductEntitlementLookup {
  listProductEntitlements(uid: string): Promise<ProductEntitlementRow[]>;
}
