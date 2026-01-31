'use client';

import SwipeDeck from '@/components/SwipeDeck';
import type { RestaurantCard } from '@/lib/data';

export default function SwipeClient({ restaurants }: { restaurants: RestaurantCard[] }) {
  return (
    <div className="min-h-screen bg-zinc-50 relative">
      <SwipeDeck restaurants={restaurants} />
    </div>
  );
}
