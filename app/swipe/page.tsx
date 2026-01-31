'use client';

import { useEffect, useState, useRef } from 'react';
import SwipeDeck from '@/components/SwipeDeck';
import { RestaurantCard } from '@/lib/data';
import { Loader2 } from 'lucide-react';

export default function SwipePage() {
    const [restaurants, setRestaurants] = useState<RestaurantCard[]>([]);
    const [loading, setLoading] = useState(true);
    const hasInitialized = useRef(false); // Guard for Strict Mode

    useEffect(() => {
        // Prevent double-invocation in React Strict Mode
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        async function init() {
            try {
                const res = await fetch('/api/restaurants');
                let data: RestaurantCard[] = await res.json();

                // Random Shuffle for Discovery (Once per mount)
                data = data
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value);

                setRestaurants(data);
            } finally {
                setLoading(false);
            }
        }

        init();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-zinc-400 font-medium animate-pulse">Finding nearest spots...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 relative">
            {/* Simple Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-white/80 to-transparent pt-safe">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Discover</h1>
                    <p className="text-xs text-zinc-500 font-medium">Halal spots near you</p>
                </div>
            </div>

            <SwipeDeck restaurants={restaurants} />
        </div>
    );
}
