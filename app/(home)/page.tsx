import { Suspense } from 'react';
import { getDiscoveryRestaurants } from '@/lib/data';
import HomeClient from '@/components/HomeClient';
import { DiscoverySkeleton } from '@/components/DiscoverySkeleton';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Halal Maps | Top Rated Halal Restaurants in Vancouver',
  description: 'Find the best accessible Halal food in Vancouver. Search by rating, distance, and cuisine on Halal Maps. Updated daily.',
  keywords: ['Halal Maps', 'Halal food Vancouver', 'Halal restaurants near me', 'Best Halal Vancouver', 'Vancouver Halal Guide'],
  openGraph: {
    title: 'Halal Maps | Top Rated Halal Restaurants in Vancouver',
    description: 'Find the best accessible Halal food in Vancouver, BC using Halal Maps.',
    url: 'https://halalmaps.app',
    siteName: 'Halal Maps',
    locale: 'en_US',
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
