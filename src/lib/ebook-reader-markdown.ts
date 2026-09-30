/**
 * Safe Reader-side Markdown subset for Golden ebook paragraphs.
 * Renders via React text nodes only — never trusts raw HTML.
 */

export type InlineSeg = { type: "text" | "bold"; value: string };

export type EbookMdListItem = {
  kind: "bullet" | "check" | "checked";
  segments: InlineSeg[];
};

export type EbookMdBlock =
  | { type: "paragraph"; segments: InlineSeg[] }
  | { type: "ul"; items: EbookMdListItem[] }
  | { type: "ol"; items: { segments: InlineSeg[] }[] };

/** Split inline **bold** markers; unmatched markers stay as plain text. */
export function parseInlineMarkdown(input: string): InlineSeg[] {
  const s = String(input ?? "").replace(/\u0000/g, "");
  const out: InlineSeg[] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === "*" && s[i + 1] === "*") {
      const end = s.indexOf("**", i + 2);
      if (end !== -1) {
        out.push({ type: "bold", value: s.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    let j = i + 1;
    while (j < s.length && !(s[j] === "*" && s[j + 1] === "*")) j += 1;
    out.push({ type: "text", value: s.slice(i, j) });
    i = j;
  }
  return out.length ? out : [{ type: "text", value: "" }];
}

const UL_LINE = /^[-*+]\s+(.*)$/;
const OL_LINE = /^(\d+)\.\s+(.*)$/;
const CHECK_LINE = /^[-*+]\s+\[([ xX])\]\s+(.*)$/;

function nonEmptyLines(raw: string): string[] {
  return String(raw ?? "")
    .replace(/\u0000/g, "")
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);
}

function looksLikeUl(lines: string[]): boolean {
  return lines.length > 0 && lines.every((l) => UL_LINE.test(l.trim()));
}

function looksLikeOl(lines: string[]): boolean {
  return lines.length > 0 && lines.every((l) => OL_LINE.test(l.trim()));
}

/** Classify one Reader paragraph (may be multiline list from ingest). */
export function parseEbookParagraph(raw: string): EbookMdBlock {
  const lines = nonEmptyLines(raw);
  if (looksLikeUl(lines)) {
    const items: EbookMdListItem[] = lines.map((line) => {
      const trimmed = line.trim();
      const check = trimmed.match(CHECK_LINE);
      if (check) {
        const marked = check[1].toLowerCase() === "x";
        return {
          kind: marked ? "checked" : "check",
          segments: parseInlineMarkdown(check[2]),
        };
      }
      const bullet = trimmed.match(UL_LINE);
      return {
        kind: "bullet",
        segments: parseInlineMarkdown(bullet ? bullet[1] : trimmed),
      };
    });
    return { type: "ul", items };
  }
  if (looksLikeOl(lines)) {
    return {
      type: "ol",
      items: lines.map((line) => {
        const m = line.trim().match(OL_LINE);
        return { segments: parseInlineMarkdown(m ? m[2] : line.trim()) };
      }),
    };
  }
  const text = lines.join(" ").trim() || String(raw ?? "").replace(/\u0000/g, "");
  return { type: "paragraph", segments: parseInlineMarkdown(text) };
}

/** True when AST still contains raw HTML-looking tokens as text (escaped by React). */
export function inlineContainsAngleTag(segments: InlineSeg[]): boolean {
  return segments.some((seg) => /<[a-zA-Z/!]/.test(seg.value));
}
