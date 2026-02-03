'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ScrollReset } from '@/components/ScrollReset';

// Loading skeleton matching the actual restaurant detail page layout
export default function RestaurantLoading() {
    return (
        <div className="min-h-screen bg-bg-base poub-32">
            <ScrollReset />
            {/* Back Button - Fixed like the real page */}
            <Link
                href="/"
                className="fixed top-4 left-4 z-50 p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white shadow-lg"
            >
                <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* Hero Image Skeleton - Same aspect ratio as real page */}
            <div className="relative w-full aspect-[4/3] md:aspect-[2.5/1] lg:h-[450px] bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Shimmer */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="px-5 -mt-8 relative z-10 pb-32">
                {/* Floating Header Card */}
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <Skeleton className="h-8 w-48 rounded-lg" />
                        <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                    {/* Meta line */}
                    <Skeleton className="h-4 w-32 mb-1" />
                </div>

                {/* Actions Grid (Desktop) */}
                <div className="hidden md:flex gap-3 mt-6">
                    <Skeleton className="h-12 flex-1 rounded-xl" />
                    <Skeleton className="h-12 flex-1 rounded-xl" />
                    <Skeleton className="h-12 flex-1 rounded-xl" />
                </div>

                {/* Tabs Skeleton */}
                <div className="mt-6 flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl max-w-sm mx-auto">
                    <div className="flex-1 py-2.5 px-4 bg-white dark:bg-zinc-700 rounded-lg shadow-sm mx-0.5">
                        <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                    <div className="flex-1 py-2.5 px-4 mx-0.5">
                        <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                </div>

                {/* Tab Content (Overview) */}
                <div className="mt-6 space-y-6">
                    {/* Trust Card (Top of Overview) */}
                    <div className="p-3 rounded-2xl bg-zinc-50 border border-border/50">
                        <div className="flex justify-between items-center mb-2">
                            <Skeleton className="h-6 w-32 rounded-lg" />
                        </div>
                        <Skeleton className="h-3 w-48" />
                    </div>

                    {/* Hours */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-border/50">
                        <Skeleton className="h-5 w-32 mb-3" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Map Card (Collapsed) */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-border/50 flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-bg-card/90 backdrop-blur-xl border-t border-border/50 z-40 pb-safe">
                <div className="flex gap-3 justify-center">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-12 flex-[1.5] rounded-xl" />
                </div>
            </div>
        </div>
    );
}
