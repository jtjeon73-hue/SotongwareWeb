"use client";

import type { InlineSeg } from "@/lib/ebook-reader-markdown";
import { parseEbookParagraph } from "@/lib/ebook-reader-markdown";

function InlineMarkdown({ segments }: { segments: InlineSeg[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "bold" ? (
          <strong key={i} className="font-semibold text-surface-900">
            {seg.value}
          </strong>
        ) : (
          <span key={i}>{seg.value}</span>
        ),
      )}
    </>
  );
}

/**
 * Render one catalog/callable paragraph with a safe Markdown subset.
 * Uses React text children only — no dangerouslySetInnerHTML, no raw HTML allowlist.
 */
export function EbookMarkdownParagraph({ text }: { text: string }) {
  const block = parseEbookParagraph(text);

  if (block.type === "ul") {
    return (
      <ul className="list-none space-y-2 pl-0">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-0.5 w-5 shrink-0 text-center text-surface-500" aria-hidden="true">
              {item.kind === "check" ? "☐" : item.kind === "checked" ? "☑" : "•"}
            </span>
            <span className="min-w-0 flex-1 break-words">
              <InlineMarkdown segments={item.segments} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol className="list-decimal space-y-2 pl-5">
        {block.items.map((item, i) => (
          <li key={i} className="min-w-0 break-words pl-1">
            <InlineMarkdown segments={item.segments} />
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p className="min-w-0 break-words">
      <InlineMarkdown segments={block.segments} />
    </p>
  );
}
