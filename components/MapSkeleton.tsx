'use client';

export function MapSkeleton() {
  return (
    <div className="absolute inset-0 bg-[var(--bg-base)]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40" />
      <div className="absolute top-24 left-8 h-3 w-24 rounded-full bg-zinc-200/80 animate-pulse" />
      <div className="absolute top-24 right-8 h-3 w-20 rounded-full bg-zinc-200/80 animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-6 w-6">
          <div className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping" />
          <div className="absolute inset-1 rounded-full bg-blue-500/70" />
        </div>
      </div>
      <div className="absolute bottom-24 left-16 h-10 w-24 rounded-full bg-zinc-200/70 animate-pulse" />
      <div className="absolute bottom-32 right-20 h-10 w-20 rounded-full bg-zinc-200/70 animate-pulse" />
    </div>
  );
}
