import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  crumbs,
  children,
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-gold/10" />
      <div className="absolute -right-32 -top-32 -z-10 h-[360px] w-[360px] rounded-full bg-gold/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        {crumbs && crumbs.length > 0 && (
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            {crumbs.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5"
              >
                {i > 0 && <ChevronRight className="h-3 w-3" />}

                {c.href ? (
                  <Link
                    href={c.href}
                    className="transition hover:text-primary"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">
                    {c.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
