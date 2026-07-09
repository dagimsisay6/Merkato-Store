import Link from "next/link";

export function SectionHeader({ eyebrow, title, subtitle, viewAll }) {
  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </span>
        <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {viewAll && (
        <Link href={viewAll} className="hidden text-sm font-semibold text-primary hover:underline sm:inline">
          View all →
        </Link>
      )}
    </div>
  );
}
