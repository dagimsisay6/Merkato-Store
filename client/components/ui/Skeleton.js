function SkeletonBox({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-muted/60 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-(--shadow-soft)">
      <SkeletonBox className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <SkeletonBox className="h-3 w-1/3" />
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <SkeletonBox className="mt-2 h-5 w-1/3" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <SkeletonBox className="aspect-square w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <SkeletonBox className="h-4 w-1/4" />
          <SkeletonBox className="h-8 w-3/4" />
          <SkeletonBox className="h-4 w-1/3" />
          <SkeletonBox className="h-10 w-1/3" />
          <SkeletonBox className="h-20 w-full" />
          <div className="flex gap-3">
            <SkeletonBox className="h-12 w-32 rounded-full" />
            <SkeletonBox className="h-12 w-32 rounded-full" />
            <SkeletonBox className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-4">
        <SkeletonBox className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-3 w-36" />
        </div>
      </div>
      <SkeletonBox className="h-6 w-20 rounded-full" />
      <SkeletonBox className="h-6 w-16" />
      <SkeletonBox className="h-9 w-24 rounded-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-3 rounded-3xl border border-border bg-card p-6">
        <SkeletonBox className="h-6 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBox key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
