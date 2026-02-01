import SavedClient from '@/components/SavedClient';
import { getCachedDiscoveryRestaurants } from '@/lib/cached-restaurants';

export const revalidate = 3600;

export default async function SavedPage() {
    const restaurants = await getCachedDiscoveryRestaurants();

    return <SavedClient restaurants={restaurants} />;
}
