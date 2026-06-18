import type { Metadata } from 'next';
import SwipeClient from '@/components/SwipeClient';
import { getDiscoveryRestaurants } from '@/lib/data';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export const revalidate = 3600;

function shuffleRestaurants<T>(items: T[]) {
    return items
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

export default async function SwipePage() {
    const restaurants = await getDiscoveryRestaurants();
    const shuffled = shuffleRestaurants(restaurants);

    return <SwipeClient restaurants={shuffled} />;
}
