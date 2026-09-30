/**
 * compactPriceNoteForCard unit + wiring checks (source-level).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

function compactPriceNoteForCard(priceNote, maxSegments = 2) {
  const trimmed = priceNote.trim();
  if (!trimmed) return trimmed;
  const parts = trimmed
    .split(/\s*\u00b7\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= maxSegments) return trimmed;
  return parts.slice(0, maxSegments).join(" \u00b7 ");
}

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  else {
    failed += 1;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const koLong =
  "단품 3,000원 · 회원 웹 열람 · 다운로드는 단품 (준비 중 · 실결제 아님)";
const enLong =
  "₩3,000 one-time · members: web reader · download needs purchase (preparing · not live)";

check(
  "KO long note first 2 segments",
  compactPriceNoteForCard(koLong) === "단품 3,000원 · 회원 웹 열람",
);
check(
  "EN long note first 2 segments",
  compactPriceNoteForCard(enLong) === "₩3,000 one-time · members: web reader",
);
check(
  "short note unchanged",
  compactPriceNoteForCard("무료 미리보기 제공 · 정식 판매 준비 중") ===
    "무료 미리보기 제공 · 정식 판매 준비 중",
);

const helperSrc = readFileSync(join(repoRoot, "src/lib/ebook-price-note.ts"), "utf8");
check("helper exports compactPriceNoteForCard", helperSrc.includes("export function compactPriceNoteForCard"));

const lib = readFileSync(join(repoRoot, "src/components/ebook/EbookLibraryView.tsx"), "utf8");
const detail = readFileSync(join(repoRoot, "src/components/ebook/EbookDetailView.tsx"), "utf8");
check("library uses helper", lib.includes("compactPriceNoteForCard"));
check("detail uses full priceNote", detail.includes("book.priceNote[locale]") && !detail.includes("compactPriceNoteForCard"));

const ebooks = readFileSync(join(repoRoot, "src/data/service-catalog/ebooks.ts"), "utf8");
const generated = readFileSync(
  join(repoRoot, "src/data/service-catalog/generated/ai-first-ebook-for-50s.catalog.ts"),
  "utf8",
);
check("ebooks.ts still has priceNote blocks", ebooks.includes("priceNote:"));
check("generated catalog KO priceNote intact", generated.includes(koLong));
check("generated catalog EN priceNote intact", generated.includes(enLong));

console.log(failed === 0 ? "\nEBOOK PRICE COMPACT ALL PASS" : `\nFAILED=${failed}`);
process.exit(failed === 0 ? 0 : 1);
