import SavedClient from '@/components/SavedClient';
import { getDiscoveryRestaurants } from '@/lib/data';

export const revalidate = 3600;

export default async function SavedPage() {
    const restaurants = await getDiscoveryRestaurants();

    return <SavedClient restaurants={restaurants} />;
}
