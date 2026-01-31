'use client';

export function SwipeCardSkeleton() {
  return (
    <div className="relative w-full h-full bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden select-none ring-1 ring-white/10">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-32" />

      <div className="absolute top-6 left-6 flex flex-col gap-2 items-start z-20">
        <div className="h-6 w-20 rounded-full bg-emerald-400/30" />
        <div className="h-6 w-24 rounded-full bg-white/10" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <div className="h-8 w-28 bg-yellow-400/40 rounded-lg mb-5" />
        <div className="h-10 w-4/5 bg-white/15 rounded-md mb-4" />
        <div className="flex gap-3 mb-6">
          <div className="h-4 w-10 bg-white/10 rounded" />
          <div className="h-4 w-12 bg-white/10 rounded" />
          <div className="h-4 w-24 bg-white/10 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-white/10 rounded-lg" />
          <div className="h-6 w-20 bg-white/10 rounded-lg" />
          <div className="h-6 w-14 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
