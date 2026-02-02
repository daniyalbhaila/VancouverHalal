import { Skeleton } from "@/components/ui/skeleton";
import { RestaurantCardSkeleton } from "./RestaurantCardSkeleton";

export function DiscoverySkeleton() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)] pb-32">
            <div className="sticky top-0 z-30 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-white/5 pb-2">
                <div className="px-4 pt-14 pb-2 max-w-md mx-auto">
                    {/* Header Lines */}
                    <div className="flex items-center justify-between mb-4">
                        <Skeleton className="h-8 w-32 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>

                    {/* Search/Filter Bar Placeholder */}
                    <div className="flex gap-2 overflow-hidden mb-2">
                        <Skeleton className="h-8 w-24 rounded-full shrink-0" />
                        <Skeleton className="h-8 w-20 rounded-full shrink-0" />
                        <Skeleton className="h-8 w-20 rounded-full shrink-0" />
                        <Skeleton className="h-8 w-20 rounded-full shrink-0" />
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="px-4 pt-4 max-w-md mx-auto space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <RestaurantCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
