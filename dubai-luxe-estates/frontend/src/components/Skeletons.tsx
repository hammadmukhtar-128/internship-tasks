export function PropertyCardSkeleton() {
  return (
    <div className="card-luxury animate-pulse overflow-hidden">
      <div className="h-64 w-full bg-ink/5" />
      <div className="space-y-3 p-6">
        <div className="h-5 w-1/2 rounded bg-ink/10" />
        <div className="h-4 w-3/4 rounded bg-ink/10" />
        <div className="h-4 w-full rounded bg-ink/10" />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
