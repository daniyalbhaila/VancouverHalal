import { Suspense } from 'react';
import { getDiscoveryRestaurants } from '@/lib/data';
import HomeClient from '@/components/HomeClient';
import { DiscoverySkeleton } from '@/components/DiscoverySkeleton';
import { CITIES } from '@/lib/cities';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Halal Maps - Top Rated Halal Restaurants in Vancouver',
  description: "Find the best Halal food near you instantly. Filter by cuisine, check live open status, and browse top-rated Halal restaurants across the Lower Mainland.",
  keywords: ['Halal Maps', 'Halal food Vancouver', 'Halal restaurants near me', 'Best Halal Vancouver', 'Vancouver Halal Guide', 'Halal Dining BC', 'Zabiha Halal Vancouver'],
  openGraph: {
    title: 'Halal Maps - Top Rated Halal Restaurants in Vancouver',
    description: "Find the best Halal food near you instantly. Filter by cuisine, check live open status, and browse top-rated Halal restaurants across the Lower Mainland.",
    url: 'https://halalmaps.app',
    siteName: 'Halal Maps',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // Static file for reliability
        width: 1200,
        height: 630,
        alt: 'Halal Maps - Vancouver',
      },
    ],
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

      {/* Server-rendered so crawlers see real links to every city page, not just the interactive map/list */}
      <section className="px-4 pb-32 pt-4 max-w-3xl mx-auto">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
          Browse Halal Restaurants by City
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CITIES).map(([key, city]) => (
            <Link
              key={key}
              href={`/best-halal-restaurants-in-${key}`}
              className="text-sm px-3 py-1.5 rounded-full border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
