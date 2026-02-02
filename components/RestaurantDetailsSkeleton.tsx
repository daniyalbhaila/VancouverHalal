import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-bg-base pb-24">
            {/* Hero Skeleton - Matches exact aspect ratio of card */}
            <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1] lg:h-[400px]">
                <Skeleton className="w-full h-full rounded-none" />
            </div>

            <div className="px-5 -mt-8 relative z-10">
                {/* Floating Header Card Skeleton */}
                <div className="bg-bg-card rounded-2xl p-5 shadow-xl border border-border/50 backdrop-blur-md">
                    {/* Title & Rating */}
                    <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-8 w-3/4 mb-2 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                    </div>

                    {/* Meta Row */}
                    <div className="flex gap-2 mb-4">
                        <Skeleton className="h-4 w-12 rounded-full" />
                        <Skeleton className="h-4 w-24 rounded-full" />
                        <Skeleton className="h-4 w-32 rounded-full" />
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <Skeleton className="h-10 w-full rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                        <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                </div>

                {/* Info Section Skeletons */}
                <div className="mt-8 space-y-6">
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-1/3 rounded-md" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-6 w-1/4 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
