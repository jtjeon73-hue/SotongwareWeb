import type { Locale } from "@/i18n/config";
import type { ContentComicPanel } from "@/data/service-catalog/types";

/**
 * Mobile-first vertical comic reader. No fake player chrome.
 * Panels must already be publication-gated by the parent.
 */
export function ComicPanelReader({
  panels,
  locale,
  title,
}: {
  panels: ContentComicPanel[];
  locale: Locale;
  title: string;
}) {
  const ordered = [...panels].sort((a, b) => a.order - b.order);

  return (
    <div
      className="mt-6 min-w-0 overflow-x-hidden"
      data-content-renderer="comic"
      data-content-stage="comic-reader"
      data-comic-panel-count={ordered.length}
    >
      <p className="sr-only">{title}</p>
      <ol className="mx-auto flex w-full max-w-md min-w-0 list-none flex-col gap-3 p-0 sm:max-w-lg">
        {ordered.map((panel, index) => (
          <li key={`${panel.order}-${panel.src}`} className="min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- static public comic panels */}
            <img
              src={panel.src}
              alt={panel.alt[locale]}
              width={1080}
              height={1350}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="h-auto w-full max-w-full rounded-xl border border-rose-100 bg-white object-contain shadow-sm"
              data-comic-panel-order={panel.order}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
