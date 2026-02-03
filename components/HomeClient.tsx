'use client';

import { RestaurantCard as RestaurantType } from '@/lib/data';
import { RestaurantCard } from '@/components/RestaurantCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Loader2, SlidersHorizontal, MapPin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { addDistanceToRestaurants, type RestaurantWithDistance } from '@/lib/restaurants';
import { motion, AnimatePresence } from 'framer-motion';
import { RestaurantCardSkeleton } from '@/components/RestaurantCardSkeleton';
import { MapSkeleton } from '@/components/MapSkeleton';
import { computeIsOpenNow } from '@/lib/hours';
import { SourceDisclaimer } from '@/components/SourceDisclaimer';

const MapComponent = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => (
        <MapSkeleton />
    ),
});

interface HomeClientProps {
    initialRestaurants: RestaurantType[];
}

export default function HomeClient({ initialRestaurants }: HomeClientProps) {
    const searchParams = useSearchParams();

    const { location, loading: locationLoading } = useLocation();
    const [view, setView] = useState<'list' | 'map'>('list');
    const [timeTick, setTimeTick] = useState(0);

    // Sync view with URL param on mount and updates
    useEffect(() => {
        const viewParam = searchParams.get('view');
        if (viewParam === 'map') {
            setView('map');
        } else {
            setView('list');
        }
    }, [searchParams]);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setTimeTick((tick) => tick + 1);
        }, 60 * 1000);
        return () => window.clearInterval(interval);
    }, []);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showOpenOnly, setShowOpenOnly] = useState(false);
    const [radius, setRadius] = useState(20); // Default 20km
    const [sortBy, setSortBy] = useState<'recommended' | 'distance' | 'rating'>('recommended'); // Default to recommended
    const [showFilters, setShowFilters] = useState(false);

    // We no longer need an initial fetch effect because data is passed in!
    // But we still need to derive distance when location becomes available.

    // Filter & Sort Logic - using useMemo for synchronous computation (no double render!)
    const filteredRestaurants = useMemo(() => {
        // --- MOCK DATA INJECTION (Toggle with ?mock=true) ---
        const showMocks = process.env.NODE_ENV === 'development' && searchParams.get('mock') === 'true';

        // Create 3 complete mock restaurants (prepend to list for visibility)
        const mockRestaurants: RestaurantType[] = showMocks ? [
            {
                id: 'mock-certified',
                slug: 'paramount-fine-foods-mock',
                name: "✅ Paramount Fine Foods",
                location: { lat: 49.2827, lng: -123.1207 },
                image: '/hero-placeholder.jpg',
                categories: ['Middle Eastern', 'BBQ'],
                rating: 9.9,
                reviews: 50000,
                address: '123 Mock St, Vancouver',
                price: '$$',
                isOpenNow: true,
                googleUrl: '',
                phone: null,
                website: null,
                openingHours: null,
                halalStatus: 'certified'
            },
            {
                id: 'mock-community',
                slug: 'manouseh-mock',
                name: "👥 Manoush'eh",
                location: { lat: 49.2800, lng: -123.1100 },
                image: '/hero-placeholder.jpg',
                categories: ['Lebanese', 'Bakery'],
                rating: 9.8,
                reviews: 40000,
                address: '456 Mock Ave, Vancouver',
                price: '$$',
                isOpenNow: true,
                googleUrl: '',
                phone: null,
                website: null,
                openingHours: null,
                halalStatus: 'community_listed'
            },
            {
                id: 'mock-verbal',
                slug: 'earls-kitchen-mock',
                name: "💬 Earls Kitchen (Verbal)",
                location: { lat: 49.2750, lng: -123.1300 },
                image: '/hero-placeholder.jpg',
                categories: ['Burgers', 'Steak'],
                rating: 9.7,
                reviews: 30000,
                address: '789 Mock Blvd, Vancouver',
                price: '$$$',
                isOpenNow: true,
                googleUrl: '',
                phone: null,
                website: null,
                openingHours: null,
                halalStatus: 'verbally_confirmed'
            }
        ] : [];
        // ---------------------------------------------------

        const combinedData = showMocks
            ? [...mockRestaurants, ...initialRestaurants]
            : initialRestaurants;

        const withLiveStatus = combinedData.map((restaurant) => ({
            ...restaurant,
            isOpenNow: computeIsOpenNow(restaurant.openingHours, restaurant.isOpenNow),
        }));

        // For mocks: Add distance of 0 to skip radius filter, then filter/sort normally
        let result: RestaurantWithDistance[] = addDistanceToRestaurants(withLiveStatus, location);

        // Force mock items to have tiny distance so they pass radius filter
        if (showMocks) {
            result = result.map(r =>
                r.id.startsWith('mock-') ? { ...r, distance: 0.1 } : r
            );
        }

        // 0. Calculate Distance if location is available
        // 1. Filter by Category
        if (selectedCategory) {
            result = result.filter(r =>
                r.categories.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()))
            );
        }

        // 2. Filter by Open Now
        if (showOpenOnly) {
            result = result.filter(r => r.isOpenNow);
        }

        // 3. Filter by Radius (only if location is known)
        if (location && radius <= 50) {
            result = result.filter(r => (r.distance || 0) <= radius);
        }

        // 4. Sort (mock items have high ratings, so they'll stay near top with 'recommended')
        result.sort((a, b) => {
            if (sortBy === 'distance' && location) {
                return (a.distance || 0) - (b.distance || 0);
            } else if (sortBy === 'rating') {
                return b.rating - a.rating;
            } else if (sortBy === 'recommended') {
                const distancePenalty = (a.distance || 0) * 0.2;
                const reviewBonusA = Math.log10(a.reviews + 1) * 0.1;
                const scoreA = a.rating + reviewBonusA - distancePenalty;

                const distancePenaltyB = (b.distance || 0) * 0.2;
                const reviewBonusB = Math.log10(b.reviews + 1) * 0.1;
                const scoreB = b.rating + reviewBonusB - distancePenaltyB;

                return scoreB - scoreA;
            }
            return 0;
        });

        return result;
    }, [selectedCategory, showOpenOnly, radius, sortBy, initialRestaurants, location, timeTick, searchParams]);



    return (
        <div
            className="min-h-screen bg-[var(--bg-base)] relative transition-colors"
        >
            {/* Header / Title Section */}
            <div
                className={cn(
                    "bg-[var(--bg-base)] px-5 pt-8 pb-4",
                    "origin-top transform-gpu transition-[max-height,opacity,transform,padding] duration-200 ease-out",
                    "max-h-40 opacity-100 translate-y-0",
                    "motion-reduce:transition-none",
                    view === 'map' && "max-h-0 opacity-0 -translate-y-2 pt-0 pb-0 overflow-hidden pointer-events-none"
                )}
            >
                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-manrope">
                        Vancouver Halal
                    </h1>
                </div>
                <p className="text-sm font-medium text-[var(--text-secondary)] font-newsreader italic">
                    Top rated dining & hidden gems
                </p>
            </div>

            <div className={cn(
                "sticky top-0 z-30",
                "bg-[var(--glass-bg)] backdrop-blur-xl shadow-sm border-b border-[var(--glass-border)]",
                "transform-gpu transition-all duration-300"
            )}>
                <CategoryFilter
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                    showOpenOnly={showOpenOnly}
                    onToggleOpen={setShowOpenOnly}
                />

                {/* Sub-Header: Filters & Location Status */}
                <div className="px-4 py-2 flex items-center justify-between text-xs border-t border-zinc-50">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <MapPin className="w-3 h-3" />
                        {locationLoading ? (
                            <span className="animate-pulse">Locating...</span>
                        ) : location ? (
                            <span>Within <span className="font-bold text-[var(--text-primary)]">{radius > 50 ? 'Unlimited' : `${radius}km`}</span></span>
                        ) : (
                            <span className="text-amber-500">Location needed for distance</span>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn("flex items-center gap-1 font-bold transition-colors", showFilters ? "text-emerald-500" : "text-[var(--text-secondary)]")}
                    >
                        <SlidersHorizontal className="w-3 h-3" />
                        <span>Filters</span>
                    </button>
                </div>

                {/* Expandable Filter Controls */}
                {showFilters && (
                    <div className="px-4 py-4 bg-[var(--bg-card)] border-t border-[var(--glass-border)] space-y-4 animate-in slide-in-from-top-2">
                        {/* Radius Slider */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)]">
                                <span>Radius</span>
                                <span>{radius > 50 ? "Unlimited" : `${radius} km`}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="51"
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                                className="w-full h-2 bg-[var(--glass-border)] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        {/* Sort Toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text-secondary)]">Sort by:</span>
                            <div className="flex bg-[var(--bg-card)] rounded-lg p-1 border border-[var(--glass-border)] shadow-sm w-full">
                                <button
                                    onClick={() => setSortBy('recommended')}
                                    className={cn("flex-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all", sortBy === 'recommended' ? "bg-[var(--text-primary)] text-[var(--bg-base)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
                                >
                                    Rec.
                                </button>
                                <button
                                    onClick={() => setSortBy('distance')}
                                    className={cn("flex-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all", sortBy === 'distance' ? "bg-[var(--text-primary)] text-[var(--bg-base)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
                                >
                                    Dist.
                                </button>
                                <button
                                    onClick={() => setSortBy('rating')}
                                    className={cn("flex-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all", sortBy === 'rating' ? "bg-[var(--text-primary)] text-[var(--bg-base)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
                                >
                                    Rating
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* Feed Container */}
            <div className={cn("pb-32 pt-4 px-4 max-w-md mx-auto min-h-[500px]", view === 'map' ? 'hidden' : 'block')}>
                <div className="mb-6">
                    <SourceDisclaimer variant="footer" />
                </div>

                {/* Show loading state until location is resolved */}
                {locationLoading ? (
                    <div className="space-y-3">
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">Finding nearby spots...</p>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <RestaurantCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredRestaurants.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {filteredRestaurants.map((restaurant, index) => (
                            <motion.div
                                key={restaurant.id}
                                layout
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="relative"
                            >
                                <RestaurantCard
                                    data={{ ...restaurant, distance: restaurant.distance ?? undefined }}
                                    priority={index < 4}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-20 text-zinc-400">
                        <p className="mb-4">No match found inside {radius}km.</p>
                        <div className="flex flex-col gap-2 items-center">
                            <button
                                onClick={() => setRadius(50)}
                                className="text-emerald-500 font-bold text-sm"
                            >
                                Increase Radius to 50km
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedCategory("");
                                    setShowOpenOnly(false);
                                    setRadius(50);
                                }}
                                className="px-4 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* End of list state */}
                {filteredRestaurants.length > 0 && (
                    <div className="text-center py-8">
                        <div className="inline-block w-12 h-1 bg-zinc-200 rounded-full mb-4"></div>
                        <p className="text-zinc-400 text-sm font-medium mb-2">You've reached the end</p>
                    </div>
                )}
            </div>

            {/* Map View (Only mounted when visible) */}
            {view === 'map' && (
                <div className="fixed inset-0 top-0 z-20 bg-zinc-50">
                    <MapSkeleton />
                    <MapComponent restaurants={filteredRestaurants} isVisible />
                </div>
            )}


        </div >
    );
}
