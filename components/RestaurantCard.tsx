'use client';

import { Star, MapPin, Navigation } from 'lucide-react';
import type { RestaurantCard as RestaurantType } from '@/lib/data';
import { RestaurantImage } from '@/components/RestaurantImage';
import { TrustBadge } from '@/components/TrustBadge';

import Link from 'next/link';

import posthog from 'posthog-js';

export function RestaurantCard({
    data,
    priority = false
}: {
    data: RestaurantType & { distance?: number };
    priority?: boolean;
}) {
    const handleDirectionsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        posthog.capture('click_directions', {
            restaurant_id: data.id,
            restaurant_name: data.name,
            restaurant_slug: data.slug,
        });
    };

    return (
        <div
            className="group relative w-full aspect-[2/1] bg-zinc-900 rounded-2xl overflow-hidden shadow-md mb-3 mx-auto max-w-md transform-gpu ring-1 ring-black/5 active:scale-[0.98] transition-transform block"
            style={{ viewTransitionName: `restaurant-hero-${data.slug}` }}
        >
            {/* Absolute Link for Main Click Action - Z-Index 0 */}
            <Link
                href={`/restaurant/${data.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`View details for ${data.name}`}
            />

            {/* Full Background Media - Pointer events none to let clicks pass to Link if needed, but z-0 link covers it anyway */}
            <div className="absolute inset-0 pointer-events-none">
                <RestaurantImage
                    src={data.image}
                    alt={data.name}
                    seed={data.categories[0] || data.name}
                    className="transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) calc(100vw - 32px), 416px"
                    priority={priority}
                    quality={60}
                />

                {/* Gradient Overlays for Readability - Stronger bottom scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
            </div>

            {/* Top Badges - Z-Index 10 to float above Link if interactive, otherwise can be under */}
            <div className="absolute top-3 left-3 flex gap-2 z-10 pointer-events-none">
                {data.isOpenNow ? (
                    <div className="px-2 py-0.5 bg-emerald-500/90 backdrop-blur-md rounded-full shadow-sm flex items-center gap-1 border border-emerald-400/20">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Open</span>
                    </div>
                ) : (
                    <div className="px-2 py-0.5 bg-red-900/70 backdrop-blur-md rounded-full shadow-sm border border-red-200/10 flex items-center">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Closed</span>
                    </div>
                )}
            </div>

            {/* Top Right: Distance + Trust Shield */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10 pointer-events-none">
                {/* Trust Badge - Compact with text for clarity */}
                {data.halalStatus && (
                    <div className="pointer-events-auto">
                        <TrustBadge
                            status={data.halalStatus}
                            variant="compact"
                        />
                    </div>
                )}

                {data.distance && (
                    <div className="px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1 shadow-sm text-white/90">
                        <MapPin className="w-3 h-3 text-white" />
                        <span className="text-[10px] font-bold">{data.distance.toFixed(1)} km</span>
                    </div>
                )}
            </div>

            {/* Compact Content Content (Overlay) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20 pointer-events-none">
                <div className="flex justify-between items-end mb-1">
                    <h3 className="text-xl font-bold text-white font-manrope leading-tight line-clamp-1 drop-shadow-md">
                        {data.name}
                    </h3>

                    {/* Rating Bubble */}
                    <div className="flex items-center gap-1 bg-yellow-400 text-black px-1.5 py-0.5 rounded-md shrink-0 font-bold text-xs shadow-lg">
                        <span>{data.rating}</span>
                        <Star className="w-3 h-3 fill-black border-none" />
                        <span className="text-[10px] opacity-70">({data.reviews})</span>
                    </div>
                </div>

                {/* Meta Row */}
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium mb-3">
                    <span className="text-zinc-200">{data.price || '$$'}</span>
                    <span className="text-zinc-500">•</span>
                    <span>{data.categories[0]}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="truncate flex-1 opacity-80">{data.address.split(',')[0]}</span>
                </div>


                <div className="flex items-center justify-between">
                    {/* Tags (scrolling) */}
                    <div className="flex gap-1.5 overflow-hidden mask-gradient-right max-w-[70%]">
                        {data.categories.slice(0, 3).map((cat: string) => (
                            <span key={cat} className="whitespace-nowrap px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-md text-[10px] font-medium text-zinc-200 border border-white/10">
                                {cat}
                            </span>
                        ))}
                    </div>

                    {/* Directions Button - Z-Index 30 + Pointer Events Auto to capture click over Link */}
                    <a
                        href={data.googleUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.name + " " + data.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 pl-2 pr-3 py-1.5 bg-zinc-900 hover:bg-zinc-700 text-white rounded-full text-[10px] font-bold transition-colors pointer-events-auto cursor-pointer relative z-30 shadow-lg"
                        onClick={handleDirectionsClick}
                    >
                        <Navigation className="w-3 h-3" />
                        <span>Directions</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
