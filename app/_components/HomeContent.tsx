import HomeClient from '@/components/HomeClient';
import { getDiscoveryRestaurants } from '@/lib/data';

export default async function HomeContent() {
  const restaurants = await getDiscoveryRestaurants();
  return <HomeClient initialRestaurants={restaurants} />;
}
