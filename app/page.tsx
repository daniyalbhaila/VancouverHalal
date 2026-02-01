import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import HomeContent from '@/app/_components/HomeContent';

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
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
      <p className="text-zinc-400 text-sm font-medium">Loading restaurants...</p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingFallback />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
