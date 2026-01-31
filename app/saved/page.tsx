'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { RestaurantCard } from '@/lib/data';
import { RestaurantCard as CardComponent } from '@/components/RestaurantCard';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
    const { favorites } = useFavorites();
    const [savedRestaurants, setSavedRestaurants] = useState<RestaurantCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                // Fetch all restaurants and filter by ID
                // Ideally this would be a specific API call, but for now we filter locally
                const res = await fetch('/api/restaurants');
                const allRestaurants: RestaurantCard[] = await res.json();

                const filtered = allRestaurants.filter(r => favorites.includes(r.id));
                setSavedRestaurants(filtered);
            } catch (error) {
                console.error("Failed to fetch saved restaurants", error);
            } finally {
                setLoading(false);
            }
        }

        if (favorites.length > 0) {
            fetchRestaurants();
        } else {
            setLoading(false);
            setSavedRestaurants([]);
        }
    }, [favorites]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50">
                <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-4" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100 p-4 pt-safe top-safe">
                <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Saved Spots</h1>
                    <span className="ml-auto text-xs font-semibold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">{favorites.length}</span>
                </div>
            </div>

            <div className="p-4 pt-6 max-w-md mx-auto space-y-6">
                {savedRestaurants.length > 0 ? (
                    savedRestaurants.map(restaurant => (
                        <div key={restaurant.id} className="relative group">
                            <CardComponent data={restaurant} />
                            {/* Remove Button Overlay? For now relying on simple display */}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-8 h-8 text-zinc-300" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">No favorites yet</h3>
                        <p className="text-zinc-500 mb-8 max-w-[250px]">Start swiping right on restaurants to add them to your collection.</p>
                        <Link href="/swipe" className="px-6 py-3 bg-zinc-900 text-white rounded-full font-bold text-sm shadow-lg">
                            Go to Swipe Deck
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
