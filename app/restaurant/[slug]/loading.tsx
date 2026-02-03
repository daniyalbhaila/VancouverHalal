'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Star, MapPin, Phone, Globe, Navigation } from 'lucide-react';

// This loading skeleton is shown instantly while the restaurant detail page loads
export default function RestaurantLoading() {
    return (
        <div className="min-h-screen bg-[var(--bg-base)]">
            {/* Hero Image Skeleton */}
            <div className="relative h-72 sm:h-80 md:h-96 bg-zinc-200 dark:bg-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Back Button */}
                <button className="absolute top-4 left-4 z-10 p-2 bg-black/30 backdrop-blur-md rounded-full">
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>

                {/* Shimmer effect */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 -mt-8 relative z-10">
                {/* Name & Rating */}
                <div className="flex justify-between items-start gap-4 mb-4">
                    <Skeleton className="h-8 w-56 rounded-lg" />
                    <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded-md">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Trust Badge */}
                <Skeleton className="h-6 w-32 rounded-full mb-3" />

                {/* Meta line */}
                <Skeleton className="h-4 w-48 mb-6" />

                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                    <Skeleton className="h-12 flex-1 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                </div>

                {/* Dietary Flags Section */}
                <div className="mb-6">
                    <Skeleton className="h-5 w-40 mb-3" />
                    <div className="grid grid-cols-3 gap-3">
                        <Skeleton className="h-20 rounded-xl" />
                        <Skeleton className="h-20 rounded-xl" />
                        <Skeleton className="h-20 rounded-xl" />
                    </div>
                </div>

                {/* Address Section */}
                <div className="mb-6">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-64 mb-1" />
                    <Skeleton className="h-4 w-32" />
                </div>

                {/* Hours Section */}
                <div>
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-48" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
