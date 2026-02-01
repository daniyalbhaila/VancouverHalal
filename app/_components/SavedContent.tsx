import SavedClient from '@/components/SavedClient';
import { getDiscoveryRestaurants } from '@/lib/data';

export default async function SavedContent() {
  const restaurants = await getDiscoveryRestaurants();
  return <SavedClient restaurants={restaurants} />;
}
