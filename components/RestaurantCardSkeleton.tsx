'use client';

export function RestaurantCardSkeleton() {
  return (
    <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-md mb-3 mx-auto max-w-md bg-zinc-900/80">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="h-5 w-40 bg-white/20 rounded-md mb-3" />
        <div className="flex gap-2 mb-3">
          <div className="h-3 w-10 bg-white/10 rounded" />
          <div className="h-3 w-6 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-white/10 rounded-full" />
          <div className="h-4 w-12 bg-white/10 rounded-full" />
          <div className="h-4 w-20 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
