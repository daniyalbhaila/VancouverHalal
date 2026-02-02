import { Suspense } from 'react';
import { getDiscoveryRestaurants } from '@/lib/data';
import HomeClient from '@/components/HomeClient';
import { DiscoverySkeleton } from '@/components/DiscoverySkeleton';
import type { Metadata } from 'next';

export const revalidate = 3600;

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

function LoadingFallback() {
  return <DiscoverySkeleton />;
}

export default async function Home() {
  const restaurants = await getDiscoveryRestaurants();

  return (
    <main>
      <Suspense fallback={<LoadingFallback />}>
        <HomeClient initialRestaurants={restaurants} />
      </Suspense>
    </main>
  );
}
