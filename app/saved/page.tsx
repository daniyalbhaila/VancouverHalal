import SavedClient from '@/components/SavedClient';
import { getDiscoveryRestaurants } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function SavedPage() {
    const restaurants = await getDiscoveryRestaurants();

    return <SavedClient restaurants={restaurants} />;
}
