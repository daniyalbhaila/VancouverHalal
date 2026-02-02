'use client';

export function RestaurantCardSkeleton() {
  return (
    <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-md mb-3 mx-auto max-w-md bg-zinc-900/80">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Top badges */}
      <div className="absolute top-3 left-3 flex gap-2 z-10">
        <div className="h-5 w-14 rounded-full bg-white/15" />
      </div>
      <div className="absolute top-3 right-3 h-5 w-16 rounded-full bg-white/10 z-10" />

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-end justify-between mb-2">
          <div className="h-6 w-44 bg-white/20 rounded-md" />
          <div className="h-5 w-16 bg-yellow-400/40 rounded-md" />
        </div>
        <div className="flex gap-2 mb-3">
          <div className="h-3 w-8 bg-white/10 rounded" />
          <div className="h-3 w-4 bg-white/10 rounded" />
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="h-4 w-14 bg-white/10 rounded-full" />
            <div className="h-4 w-12 bg-white/10 rounded-full" />
            <div className="h-4 w-16 bg-white/10 rounded-full" />
          </div>
          <div className="h-7 w-20 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent z-50 pointer-events-none" />
    </div>
  );
}
