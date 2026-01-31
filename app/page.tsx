import { getDiscoveryRestaurants } from '@/lib/data';
import HomeClient from '@/components/HomeClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Top Rated Halal Restaurants in Vancouver | 2024 Guide',
  description: 'Find the best Halal restaurants in Vancouver. Search by rating, distance, and cuisine. Updated daily with open hours and verification status.',
  keywords: ['Halal food Vancouver', 'Halal restaurants near me', 'Best Halal Vancouver', 'Vancouver Halal Guide'],
  openGraph: {
    title: 'Top Rated Halal Restaurants in Vancouver',
    description: 'Find the best accessible Halal food in Vancouver, BC.',
    type: 'website',
  }
};

export default async function Home() {
  const restaurants = await getDiscoveryRestaurants();

  return (
    <main>
      <HomeClient initialRestaurants={restaurants} />
    </main>
  );
}
