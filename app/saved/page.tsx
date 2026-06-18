import type { Metadata } from 'next';
import SavedClient from '@/components/SavedClient';
import { getDiscoveryRestaurants } from '@/lib/data';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function SavedPage() {
    const restaurants = await getDiscoveryRestaurants();

    return <SavedClient restaurants={restaurants} />;
}
