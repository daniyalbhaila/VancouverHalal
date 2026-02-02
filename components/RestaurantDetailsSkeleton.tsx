import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-bg-base pb-32">
            {/* Back Button Skeleton */}
            <div className="fixed top-4 left-4 z-50">
                <Skeleton className="w-10 h-10 rounded-full" />
            </div>

            {/* Hero Skeleton - Matches exact aspect ratio */}
            <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1] lg:h-[400px]">
                <Skeleton className="w-full h-full rounded-none" />
            </div>

            <div className="px-5 -mt-8 relative z-10">
                {/* Floating Header Card Skeleton */}
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-border/50">
                    {/* Title & Rating */}
                    <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-7 w-3/5 rounded-md" />
                        <Skeleton className="h-7 w-16 rounded-lg" />
                    </div>

                    {/* Meta Row */}
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>

                {/* Desktop Actions - Hidden on Mobile */}
                <div className="hidden md:flex gap-3 mt-6">
                    <Skeleton className="flex-1 h-12 rounded-xl" />
                    <Skeleton className="flex-1 h-12 rounded-xl" />
                    <Skeleton className="flex-1 h-12 rounded-xl" />
                </div>

                {/* Info Sections */}
                <div className="mt-6 space-y-4">
                    {/* Hours Row Skeleton */}
                    <div className="bg-bg-card rounded-2xl border border-border/50 p-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-5 h-5 rounded-full" />
                            <Skeleton className="h-4 w-32 rounded-md" />
                        </div>
                    </div>

                    {/* Map Preview Skeleton */}
                    <div className="rounded-2xl overflow-hidden border border-border/50">
                        <Skeleton className="h-[180px] w-full rounded-none" />
                        <div className="p-4 bg-bg-card">
                            <Skeleton className="h-4 w-3/4 rounded-md mb-3" />
                            <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar Skeleton (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-bg-card/90 backdrop-blur-xl border-t border-border/50 z-40 pb-safe">
                <div className="flex gap-3 justify-center">
                    <Skeleton className="flex-1 max-w-[100px] h-16 rounded-xl" />
                    <Skeleton className="flex-1 max-w-[100px] h-16 rounded-xl" />
                    <Skeleton className="flex-[1.5] max-w-[150px] h-16 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
