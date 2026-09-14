import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import { EbookReaderClient } from "@/components/ebook/EbookReaderClient";
import type { EbookCatalogItem } from "@/data/service-catalog";

export function EbookReaderView({ book, locale }: { book: EbookCatalogItem; locale: Locale }) {
  return (
    <Suspense fallback={null}>
      <EbookReaderClient book={book} locale={locale} />
    </Suspense>
  );
}
