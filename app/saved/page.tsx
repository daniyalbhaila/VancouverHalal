import { Suspense } from 'react';
import SavedContent from '@/app/_components/SavedContent';
import { RestaurantCardSkeleton } from '@/components/RestaurantCardSkeleton';

export const revalidate = 3600;

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] px-4 pt-6 pb-32">
      <div className="max-w-md mx-auto">
        <div className="h-6 w-32 bg-zinc-200 rounded-md mb-5 animate-pulse" />
        {Array.from({ length: 4 }).map((_, index) => (
          <RestaurantCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function SavedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SavedContent />
    </Suspense>
  );
}
