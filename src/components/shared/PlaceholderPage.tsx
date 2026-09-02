import { LocalizedButton } from "@/components/locale/LocalizedButton";

interface PlaceholderPageProps {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  skeletonNote?: string;
}

export function PlaceholderPage({
  title,
  description,
  backHref = "/",
  backLabel = "홈으로",
  skeletonNote,
}: PlaceholderPageProps) {
  return (
    <div className="section-padding bg-white">
      <div className="container-main max-w-2xl">
        <h1 className="text-3xl font-bold text-surface-900">{title}</h1>
        <p className="mt-4 text-base leading-relaxed text-surface-600">{description}</p>
        {skeletonNote && <p className="mt-4 text-sm text-surface-500">{skeletonNote}</p>}
        <div className="mt-8">
          <LocalizedButton href={backHref} variant="outline">
            {backLabel}
          </LocalizedButton>
        </div>
      </div>
    </div>
  );
}
