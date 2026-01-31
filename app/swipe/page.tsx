import SwipeClient from '@/components/SwipeClient';
import { getCachedDiscoveryRestaurants } from '@/lib/cached-restaurants';

export const revalidate = 3600;

function shuffleRestaurants<T>(items: T[]) {
    return items
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

export default async function SwipePage() {
    const restaurants = await getCachedDiscoveryRestaurants();
    const shuffled = shuffleRestaurants(restaurants);

    return <SwipeClient restaurants={shuffled} />;
}
