export function PropertyCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="skeleton h-52 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-6 w-24 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-10 w-full rounded" />
        <div className="flex gap-3 py-2">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="skeleton h-4 w-16 rounded" />
          <div className="skeleton h-8 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="skeleton h-[400px] rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-10 w-3/4 rounded" />
          <div className="skeleton h-6 w-1/2 rounded" />
          <div className="skeleton h-48 w-full rounded-xl" />
        </div>
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-3">
      <div className="skeleton h-8 w-8 rounded" />
      <div className="skeleton h-8 w-24 rounded" />
      <div className="skeleton h-4 w-20 rounded" />
    </div>
  );
}
