import { RestaurantCardSkeleton } from '@/components/RestaurantCardSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <RestaurantCardSkeleton />
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="h-14 w-14 rounded-full bg-zinc-200 animate-pulse" />
          <div className="h-16 w-16 rounded-full bg-zinc-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
