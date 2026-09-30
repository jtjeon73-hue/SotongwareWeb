/**
 * Mobile density contracts for ebook library/detail (source-level, no browser).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const lib = readFileSync(join(repoRoot, "src/components/ebook/EbookLibraryView.tsx"), "utf8");
const detail = readFileSync(join(repoRoot, "src/components/ebook/EbookDetailView.tsx"), "utf8");
const globals = readFileSync(join(repoRoot, "src/styles/globals.css"), "utf8");
const reader = readFileSync(join(repoRoot, "src/components/ebook/EbookReaderClient.tsx"), "utf8");
const authSafety = readFileSync(join(repoRoot, "src/lib/auth-safety.ts"), "utf8");

check("library uses local mobile padding (not only global section-padding)", lib.includes("py-6 sm:py-16 lg:py-20"));
check("library hero compact mobile marker", lib.includes('data-ebook-library-hero="compact-mobile"'));
check("library mobile title text-xl", lib.includes("text-xl font-bold"));
check("library description line-clamp-2 on mobile", lib.includes("line-clamp-2") && lib.includes("sm:line-clamp-none"));
check("library keeps getEbookCatalog", lib.includes("getEbookCatalog"));
check("mobile compact card present", lib.includes('data-ebook-card="mobile-compact"') && lib.includes("sm:hidden"));
check("desktop vertical card retained", lib.includes('data-ebook-card="desktop-vertical"') && lib.includes("sm:flex"));
check("desktop compact density marker", lib.includes('data-ebook-desktop-density="compact-lg"'));
check("desktop grid denser on xl", lib.includes("xl:grid-cols-4"));
check("mobile cover width ~80px (w-20)", lib.includes("w-20 shrink-0"));
check("mobile card shows priceNote", /mobile-compact[\s\S]*?priceNote/.test(lib));
{
  const mobileBlock = lib.slice(lib.indexOf('data-ebook-card="mobile-compact"'), lib.indexOf('data-ebook-card="desktop-vertical"'));
  check("mobile card uses compactPriceNoteForCard", mobileBlock.includes("compactPriceNoteForCard"));
  check("mobile price marker data-ebook-price", mobileBlock.includes('data-ebook-price="mobile-compact"'));
  check("mobile price no line-clamp-1 on priceNote row", !/priceNote[sS]{0,120}line-clamp-1/.test(mobileBlock));
  check("mobile price title full note", mobileBlock.includes("title={book.priceNote[locale]}"));
  const desktopBlock = lib.slice(lib.indexOf('data-ebook-card="desktop-vertical"'));
  check("desktop card full priceNote unchanged", desktopBlock.includes("{book.priceNote[locale]}") && !desktopBlock.includes("compactPriceNoteForCard"));
}
check("library imports ebook-price-note helper", lib.includes("@/lib/ebook-price-note"));
check("detail still full priceNote (no compact helper)", !detail.includes("compactPriceNoteForCard") && detail.includes("book.priceNote[locale]"));

check("desktop card also shows priceNote", /desktop-vertical[\s\S]*?priceNote/.test(lib));
check("read CTA retained", lib.includes("/read"));
check("aspect 3/4 retained", lib.includes("aspect-[3/4]"));
check("sm grid 2 / lg grid 3 retained", lib.includes("sm:grid-cols-2") && lib.includes("lg:grid-cols-3"));

check("detail local mobile padding", detail.includes("py-6 sm:py-16 lg:py-20"));
check("detail compact mobile hero", detail.includes('data-ebook-detail-hero="compact-mobile"'));
check("detail mobile 2-col cover", detail.includes("grid-cols-[104px_minmax(0,1fr)]"));
check("detail lg desktop grid retained", detail.includes("lg:grid-cols-[220px_minmax(0,1fr)]"));
check("detail mobile title text-xl", detail.includes("text-xl") && detail.includes("sm:text-3xl"));
check("detail summary clamped on mobile", detail.includes("line-clamp-3") && detail.includes("sm:line-clamp-none"));
{
  const heroAndBelow = detail.slice(detail.indexOf("data-ebook-detail-hero"));
  check(
    "detail price before commerce panel",
    heroAndBelow.indexOf("priceNote") > -1 &&
      heroAndBelow.indexOf("priceNote") < heroAndBelow.indexOf("<EbookCommercePolicyPanel"),
  );
  check(
    "detail read CTA before commerce panel",
    heroAndBelow.indexOf("/read") > -1 &&
      heroAndBelow.indexOf("/read") < heroAndBelow.indexOf("<EbookCommercePolicyPanel"),
  );
  check("detail mobile compact cover + desktop cover split", heroAndBelow.includes("sm:hidden") && heroAndBelow.includes("hidden sm:block"));
}
check("detail TOC retained", detail.includes("ebook-toc-heading"));
check("detail MembershipGate retained", detail.includes("MembershipGate"));

check("globals section-padding unchanged py-14", /section-padding\s*\{[\s\S]*?py-14 sm:py-16 lg:py-20/.test(globals));
check("Reader file untouched by this task marker absence of library hero", !reader.includes("data-ebook-library-hero"));
check("Google production bake still present", /isGoogleAuthUiEnabled[\s\S]*?NODE_ENV === "production"[\s\S]*?return true/.test(authSafety));

console.log(failed === 0 ? "\nEBOOK MOBILE DENSITY ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
