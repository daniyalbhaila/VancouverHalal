'use client';

import { RestaurantCard as RestaurantType } from '@/lib/data';
import { RestaurantCard } from '@/components/RestaurantCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Loader2, SlidersHorizontal, MapPin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation } from '@/hooks/useLocation';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { addDistanceToRestaurants, type RestaurantWithDistance } from '@/lib/restaurants';
import { motion, AnimatePresence } from 'framer-motion';
import { RestaurantCardSkeleton } from '@/components/RestaurantCardSkeleton';
import { MapSkeleton } from '@/components/MapSkeleton';
import { computeIsOpenNow } from '@/lib/hours';
import { SourceDisclaimer } from '@/components/SourceDisclaimer';
import Link from 'next/link';

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
    const handleFeedbackClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
        const uj = (window as any).uj;
        if (uj && typeof uj.showWidget === 'function') {
            event.preventDefault();
            uj.showWidget({ section: 'feedback' });
        }
    }, []);

    const { location, loading: locationLoading, requestLocation, error: locationError } = useLocation();
    const [view, setView] = useState<'list' | 'map'>('list');
    const [timeTick, setTimeTick] = useState(0);
    const [visibleCount, setVisibleCount] = useState(24);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const hasPromptedLocation = useRef(false);

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
    const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);
    const [radius, setRadius] = useState(20); // Default 20km
    const [sortBy, setSortBy] = useState<'recommended' | 'distance' | 'rating'>('recommended'); // Default to recommended
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setVisibleCount(24);
    }, [selectedCategory, showOpenOnly, showCertifiedOnly, radius, sortBy, view]);

    useEffect(() => {
        if (hasPromptedLocation.current) return;
        if (location || locationLoading || locationError) return;
        hasPromptedLocation.current = true;
        requestLocation();
    }, [location, locationLoading, locationError, requestLocation]);

    // We no longer need an initial fetch effect because data is passed in!
    // But we still need to derive distance when location becomes available.

    // Filter & Sort Logic - using useMemo for synchronous computation (no double render!)

    // --- MOCK DATA INJECTION (Toggle with ?mock=true) ---
    const showMocks = process.env.NODE_ENV === 'development' && searchParams.get('mock') === 'true';

    // Create 3 complete mock restaurants (prepend to list for visibility)
    const mockRestaurants: RestaurantType[] = useMemo(() => showMocks ? [
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
    ] : [], [showMocks]);
    // ---------------------------------------------------

    const filteredRestaurants = useMemo(() => {


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

        // 2.5 Filter by Certified
        if (showCertifiedOnly) {
            result = result.filter(r => r.halalStatus === 'certified');
        }

        // 3. Filter by Radius (only if location is known)
        if (location && radius <= 50) {
            result = result.filter(r => (r.distance || 0) <= radius);
        }

        // 4. Sort (mock items have high ratings, so they'll stay near top with 'recommended')
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
    }, [selectedCategory, showOpenOnly, showCertifiedOnly, radius, sortBy, initialRestaurants, location, timeTick, searchParams, showMocks, mockRestaurants]);

    const visibleRestaurants = useMemo(() => {
        return filteredRestaurants.slice(0, visibleCount);
    }, [filteredRestaurants, visibleCount]);

    const hasMore = filteredRestaurants.length > visibleCount;

    useEffect(() => {
        if (!hasMore || view !== 'list') return;
        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry?.isIntersecting) {
                    setVisibleCount((count) => Math.min(count + 24, filteredRestaurants.length));
                }
            },
            { rootMargin: '400px 0px' }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [hasMore, filteredRestaurants.length, view]);

    // Derive Available Categories from current "scope" (Radius + OpenNow)
    // We do NOT filter by 'selectedCategory' here, so the user can switch categories
    const availableCategories = useMemo(() => {
        // 1. Get base set (Radius + OpenNow protected)
        // We need to re-run the base filters WITHOUT the category filter
        // Ideally we could refactor the above useMemo to return both, but for now we'll do a lightweight pass

        let pool = showMocks
            ? [...mockRestaurants, ...initialRestaurants]
            : initialRestaurants;

        // Apply Live Status
        pool = pool.map((restaurant) => ({
            ...restaurant,
            isOpenNow: computeIsOpenNow(restaurant.openingHours, restaurant.isOpenNow),
        }));

        // Apply Radius (if location)
        if (location) {
            const withDist = addDistanceToRestaurants(pool, location);
            if (showMocks) {
                // Mock override
                withDist.forEach(r => {
                    if (r.id.startsWith('mock-')) r.distance = 0.1; // @ts-ignore
                });
            }
            if (radius <= 50) {
                pool = withDist.filter(r => (r.distance || 0) <= radius);
            } else {
                pool = withDist;
            }
        }

        // Apply Open Now
        if (showOpenOnly) {
            pool = pool.filter(r => r.isOpenNow);
        }

        // Now count categories
        const counts: Record<string, number> = {};
        pool.forEach(r => {
            r.categories.forEach((rawCat: string) => {
                let cat = rawCat;
                if (cat === 'Halal') return; // Skip generic tag
                if (cat === 'meal_takeaway') cat = 'Takeaway';
                if (cat === 'meal_delivery') cat = 'Delivery';

                // Normalize slightly? Or just strict string match
                counts[cat] = (counts[cat] || 0) + 1;
            });
        });

        // Sort by count
        const sorted = Object.entries(counts)
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([cat]) => cat);

        return ["All", ...sorted];

    }, [initialRestaurants, location, radius, showOpenOnly, showMocks]); // mockRestaurants is internal, showMocks is dependent on searchParams

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
                        Halal Maps
                    </h1>
                </div>
                <p className="text-sm font-medium text-[var(--text-secondary)] font-newsreader italic">
                    Vancouver's top rated dining guide
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
                    showCertifiedOnly={showCertifiedOnly}
                    onToggleCertified={setShowCertifiedOnly}
                    availableCategories={availableCategories}
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
                            <>
                                <span className="text-amber-600">{locationError ? 'Location blocked' : 'Location needed'}</span>
                                <button
                                    onClick={requestLocation}
                                    className="text-amber-700 font-semibold hover:underline"
                                >
                                    Enable
                                </button>
                            </>
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

            <div className="px-4 pt-3">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <span>Missing a spot?</span>
                        <Link href="/suggest" className="font-semibold text-[var(--text-primary)] hover:underline">
                            Suggest one
                        </Link>
                    </div>
                    <a
                        href="https://halalmaps.userjot.com/"
                        onClick={handleFeedbackClick}
                        className="font-semibold text-[var(--text-primary)] hover:underline"
                    >
                        Feedback
                    </a>
                </div>
            </div>


            {/* Feed Container */}
            <div className={cn("pb-32 pt-4 px-4 max-w-md mx-auto min-h-[500px]", view === 'map' ? 'hidden' : 'block')}>
                {/* Show loading state until location is resolved */}
                {locationLoading ? (
                    <div className="space-y-3">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">Finding nearby spots...</p>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <RestaurantCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredRestaurants.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {visibleRestaurants.map((restaurant, index) => (
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
                                    priority={index < 2}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="text-center py-20 text-zinc-500">
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
                                    setShowCertifiedOnly(false);
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
                {filteredRestaurants.length > 0 && hasMore && view === 'list' && (
                    <div className="py-6">
                        <div ref={loadMoreRef} className="h-6" />
                        <p className="text-center text-xs text-[var(--text-secondary)]">Loading more…</p>
                    </div>
                )}

                {filteredRestaurants.length > 0 && !hasMore && (
                    <div className="text-center py-8">
                        <div className="inline-block w-12 h-1 bg-zinc-200 rounded-full mb-4"></div>
                        <p className="text-zinc-500 text-sm font-medium mb-2">You've reached the end</p>
                        <SourceDisclaimer variant="footer" />
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
