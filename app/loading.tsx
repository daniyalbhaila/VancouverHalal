import { RestaurantCardSkeleton } from '@/components/RestaurantCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] px-4 pt-6 pb-32">
      <div className="max-w-md mx-auto">
        <div className="h-7 w-40 bg-zinc-200 rounded-md mb-3 animate-pulse" />
        <div className="h-4 w-52 bg-zinc-100 rounded-md mb-6 animate-pulse" />
        {Array.from({ length: 5 }).map((_, index) => (
          <RestaurantCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
