import { Suspense } from 'react';
import SwipeContent from '@/app/_components/SwipeContent';
import { SwipeCardSkeleton } from '@/components/SwipeCardSkeleton';

export const revalidate = 3600;

function LoadingFallback() {
  return (
    <div className="fixed inset-0 pt-14 pb-28 flex flex-col items-center overflow-hidden bg-zinc-50">
      <div className="relative flex-1 w-full max-w-md px-4 mt-2 flex items-center">
        <div className="relative w-full h-[65vh] max-h-[500px]">
          <SwipeCardSkeleton />
        </div>
      </div>
      <div className="flex items-center gap-8 z-30 py-4">
        <div className="w-16 h-16 bg-zinc-200 rounded-full animate-pulse" />
        <div className="w-20 h-20 bg-zinc-200 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export default function SwipePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SwipeContent />
    </Suspense>
  );
}
