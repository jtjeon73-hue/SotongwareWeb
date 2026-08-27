import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function SectionHeader({
  title,
  description,
  eyebrow,
  align = "left",
  className,
  id,
}: SectionHeaderProps) {
  return (
    <div
      id={id}
      className={cn(
        "mb-8 sm:mb-10 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-bold tracking-tight text-surface-900",
          eyebrow ? "mt-2 text-2xl sm:text-3xl lg:text-4xl" : "text-2xl sm:text-3xl lg:text-4xl",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-surface-600 sm:mt-4 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
