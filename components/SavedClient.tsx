'use client';

import { useMemo } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import type { RestaurantCard } from '@/lib/data';
import { RestaurantCard as CardComponent } from '@/components/RestaurantCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function SavedClient({ restaurants }: { restaurants: RestaurantCard[] }) {
  const { favorites } = useFavorites();

  const savedRestaurants = useMemo(
    () => restaurants.filter((restaurant) => favorites.includes(restaurant.id)),
    [restaurants, favorites]
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] pb-32 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--glass-bg)] backdrop-blur-md border-b border-[var(--glass-border)] p-4 pt-safe top-safe transition-colors">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <h1 className="text-xl font-bold tracking-tight">Saved Spots</h1>
          <span className="ml-auto text-xs font-semibold text-[var(--text-secondary)] bg-[var(--glass-bg)] px-2 py-1 rounded-full">
            {favorites.length}
          </span>
        </div>
      </div>

      <div className="p-4 pt-6 max-w-md mx-auto space-y-6">
        {savedRestaurants.length > 0 ? (
          savedRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="relative group">
              <CardComponent data={restaurant} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-[var(--glass-bg)] rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <h3 className="text-lg font-bold mb-2">No favorites yet</h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-[250px]">
              Start swiping right on restaurants to add them to your collection.
            </p>
            <Link
              href="/swipe"
              className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-base)] rounded-full font-bold text-sm shadow-lg"
            >
              Go to Swipe Deck
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
