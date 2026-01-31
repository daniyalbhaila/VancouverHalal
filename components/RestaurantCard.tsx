'use client';

import { Star, MapPin, Navigation } from 'lucide-react';
import { cn, getVibeGradient } from '@/lib/utils';
import type { RestaurantCard as RestaurantType } from '@/lib/data';

export function RestaurantCard({ data }: { data: RestaurantType & { distance?: number } }) {
    // Gradient helper for missing images
    const renderImageFallback = () => {
        const gradient = getVibeGradient(data.categories[0] || data.name);
        return (
            <div className={cn("w-full h-full relative overflow-hidden", gradient)}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="text-8xl font-black text-white mix-blend-overlay rotate-12">{data.name[0]}</span>
                </div>
            </div>
        );
    };

    return (
        <div
            className="group relative w-full aspect-[2/1] bg-zinc-900 rounded-2xl overflow-hidden shadow-md mb-3 mx-auto max-w-md transform-gpu ring-1 ring-black/5 active:scale-[0.98] transition-transform"
        >
            {/* Full Background Media */}
            <div className="absolute inset-0">
                {data.image ? (
                    <img
                        src={data.image}
                        alt={data.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : renderImageFallback()}

                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
            </div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
                {data.isOpenNow ? (
                    <div className="px-2 py-0.5 bg-emerald-500/90 backdrop-blur-md rounded-full shadow-sm flex items-center gap-1 border border-emerald-400/20">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Open</span>
                    </div>
                ) : (
                    <div className="px-2 py-0.5 bg-zinc-900/60 backdrop-blur-md rounded-full shadow-sm border border-white/10">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Closed</span>
                    </div>
                )}
            </div>

            {data.distance && (
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1 shadow-sm text-white/90 z-10">
                    <MapPin className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-bold">{data.distance.toFixed(1)} km</span>
                </div>
            )}

            {/* Compact Content Content (Overlay) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
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

                {/* Footer / Directions */}
                <div className="flex items-center justify-between">
                    {/* Tags (scrolling) */}
                    <div className="flex gap-1.5 overflow-hidden mask-gradient-right max-w-[70%]">
                        {data.categories.slice(0, 3).map((cat: string) => (
                            <span key={cat} className="whitespace-nowrap px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-md text-[10px] font-medium text-zinc-200 border border-white/10">
                                {cat}
                            </span>
                        ))}
                    </div>

                    <a
                        href={data.googleUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.name + " " + data.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 pl-2 pr-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-bold border border-white/10 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Navigation className="w-3 h-3" />
                        <span>Go</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
