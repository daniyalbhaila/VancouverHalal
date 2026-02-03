'use client';

import { useState, useMemo } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { RestaurantCard } from '@/lib/data';
import { X, Heart, RotateCcw, MapPin, Star } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { addDistanceToRestaurants, type RestaurantWithDistance } from '@/lib/restaurants';
import { RestaurantImage } from '@/components/RestaurantImage';
import { TrustBadge } from '@/components/TrustBadge';

interface SwipeDeckProps {
    restaurants: RestaurantCard[];
}

// Wrapper for the individual card to isolate MotionValue state
const SwipeableCard = ({
    restaurant,
    custom,
    onSwipe
}: {
    restaurant: RestaurantCard;
    custom: number;
    onSwipe: (dir: number) => void;
}) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    // Opacity for drag feedback
    const likeOpacity = useTransform(x, [50, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

    const handleDragEnd = (_: any, { offset }: PanInfo) => {
        const threshold = 100;
        if (offset.x > threshold) {
            onSwipe(1);
        } else if (offset.x < -threshold) {
            onSwipe(-1);
        }
    };

    const variants: any = {
        enter: (direction: number) => ({
            scale: 0.96,
            y: 15,
            opacity: 0.6,
            zIndex: 10,
        }),
        center: {
            zIndex: 20,
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: { duration: 0.3 }
        },
        exit: (direction: number) => ({
            zIndex: 50,
            x: direction < 0 ? -1000 : 1000,
            rotate: direction < 0 ? -20 : 20,
            opacity: 0,
            transition: { duration: 0.4, ease: "easeIn" }
        })
    };

    // Overlay variants to force visibility on button exit
    const overlayVariants: any = {
        exit: (direction: number) => ({
            opacity: direction === 1 ? 1 : 0 // Like
        }),
        exitNope: (direction: number) => ({
            opacity: direction === -1 ? 1 : 0 // Nope
        })
    };

    return (
        <motion.div
            custom={custom}
            variants={variants}
            initial="center"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            style={{ x, rotate }}
            className="absolute inset-x-4 inset-y-0 z-10 touch-none cursor-grab active:cursor-grabbing"
        >
            <div className="relative w-full h-full bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden select-none ring-1 ring-white/10">
                {/* Visual Content Helper */}
                <CardContent restaurant={restaurant} />

                {/* Overlays */}
                <motion.div
                    style={{ opacity: likeOpacity }}
                    variants={{ exit: (dir) => ({ opacity: dir === 1 ? 1 : 0 }) }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                    <div className="bg-emerald-500 rounded-full p-6 shadow-2xl shadow-emerald-500/50 scale-150">
                        <Heart className="w-16 h-16 fill-white text-white" />
                    </div>
                </motion.div>

                <motion.div
                    style={{ opacity: nopeOpacity }}
                    variants={{ exit: (dir) => ({ opacity: dir === -1 ? 1 : 0 }) }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                >
                    <div className="bg-rose-500 rounded-full p-6 shadow-2xl shadow-rose-500/50 scale-150">
                        <X className="w-16 h-16 text-white" />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

// Extracted for cleanliness
const CardContent = ({ restaurant }: { restaurant: RestaurantWithDistance }) => {
    return (
        <>
            {/* Full Background Media */}
            <div className="absolute inset-0">
                <RestaurantImage
                    src={restaurant.image}
                    alt={restaurant.name}
                    seed={restaurant.categories[0] || restaurant.name}
                    className="pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 600px"
                    quality={70}
                />

                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-32" />
            </div>

            {/* Top Left: Open/Closed Only - Same as RestaurantCard */}
            <div className="absolute top-4 left-4 z-20">
                {restaurant.isOpenNow ? (
                    <div className="px-2 py-0.5 bg-emerald-500/90 backdrop-blur-md rounded-full shadow-sm flex items-center gap-1 border border-emerald-400/20">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Open</span>
                    </div>
                ) : (
                    <div className="px-2 py-0.5 bg-red-900/70 backdrop-blur-md rounded-full shadow-sm border border-red-200/10 flex items-center">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Closed</span>
                    </div>
                )}
            </div>

            {/* Top Right: Trust Badge + Distance - Same as RestaurantCard */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                <TrustBadge status={restaurant.halalStatus} variant="compact" />
                {restaurant.distance && (
                    <div className="px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1 shadow-sm text-white/90">
                        <MapPin className="w-3 h-3 text-white" />
                        <span className="text-[10px] font-bold">{restaurant.distance.toFixed(1)} km</span>
                    </div>
                )}
            </div>

            {/* Content Content (Moved up mostly) */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20 pointer-events-none">
                {/* Rating Badge - Floating above text */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black rounded-lg font-bold text-sm mb-4 shadow-lg shadow-yellow-400/20">
                    <span className="text-base">{restaurant.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-black border-none" />
                </div>

                <h2 className="text-4xl font-black font-manrope leading-none mb-3 tracking-tight drop-shadow-sm line-clamp-2">
                    {restaurant.name}
                </h2>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-sm text-zinc-300 font-medium mb-6">
                    <span>{restaurant.price || '$$'}</span>
                    <span className="text-zinc-600">•</span>
                    <span>{restaurant.categories[0]}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="truncate max-w-[150px]">{restaurant.address.split(',')[0]}</span>
                </div>

                {/* Category Tags Only (Trust Badge moved to top-right) */}
                <div className="flex flex-wrap gap-2">
                    {restaurant.categories.slice(0, 3).map((cat: string) => (
                        <span key={cat} className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-xs font-semibold border border-white/10 text-white/90">
                            {cat}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default function SwipeDeck({ restaurants }: SwipeDeckProps) {
    const { location } = useLocation();
    const { toggleFavorite } = useFavorites();

    const cards = useMemo(() => {
        return addDistanceToRestaurants(restaurants, location);
    }, [restaurants, location]);

    const [[currentIndex, direction], setPage] = useState([0, 0]);
    const activeIndex = currentIndex;
    const nextIndex = currentIndex + 1;

    // Background card variants
    const backVariants = {
        center: {
            scale: 0.96,
            y: 15,
            zIndex: 10,
            opacity: 0.6,
            x: 0,
            rotate: 0,
            transition: { duration: 0.3 }
        }
    };

    const swipe = (newDirection: number) => {
        if (newDirection === 1) {
            const currentCard = cards[currentIndex];
            if (currentCard) {
                toggleFavorite(currentCard.id);
            }
        }
        setPage([currentIndex + 1, newDirection]);
    };

    if (currentIndex >= cards.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6 animate-in fade-in duration-500">
                <button
                    onClick={() => setPage([0, 0])}
                    className="px-8 py-4 bg-zinc-900 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 pt-14 pb-28 flex flex-col items-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 bg-[var(--bg-base)] transition-colors duration-500" />

            {/* Card Area - Takes remaining space */}
            <div className="relative flex-1 w-full max-w-md px-4 mt-2 perspective-1000 z-10 flex items-center">
                <div className="relative w-full h-[65vh] max-h-[500px]">
                    {/* Background Card */}
                    {nextIndex < cards.length && (
                        <div className="absolute inset-0 z-0">
                            <motion.div
                                key={cards[nextIndex].id}
                                variants={backVariants}
                                initial="center"
                                animate="center"
                                className="w-full h-full"
                            >
                                <div className="relative w-full h-full bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden select-none ring-1 ring-white/10">
                                    <CardContent restaurant={cards[nextIndex]} />
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Active Card */}
                    <AnimatePresence custom={direction} mode="popLayout">
                        <SwipeableCard
                            key={cards[activeIndex].id}
                            restaurant={cards[activeIndex]}
                            custom={direction}
                            onSwipe={swipe}
                        />
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls - Fixed at bottom, own space */}
            <div className="flex items-center gap-8 z-30 py-4">
                <button
                    onClick={() => swipe(-1)}
                    className="w-16 h-16 bg-white rounded-full shadow-lg text-rose-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border border-zinc-100"
                >
                    <X className="w-7 h-7" strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => swipe(1)}
                    className="w-20 h-20 bg-emerald-400 rounded-full shadow-xl shadow-emerald-400/40 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                    <Heart className="w-9 h-9 fill-black" strokeWidth={0} />
                </button>
            </div>
        </div>
    );
}
