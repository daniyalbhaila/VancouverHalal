import { getRestaurantsByCity } from '@/lib/data';
import { CITIES, CityKey } from '@/lib/cities';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';

type Props = {
    params: Promise<{ city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city } = await params;
    const cityKey = city as CityKey;
    const cityData = CITIES[cityKey];

    if (!cityData) {
        return {
            title: 'City Not Found',
        };
    }

    return {
        title: `Best Halal Restaurants in ${cityData.name} | Top Rated Halal Food`,
        description: `Explore the top 18 rated halal restaurants in ${cityData.name}, BC. Filtered by highest rating and most reviews. Discover your next favorite halal spot today.`,
    };
}

export async function generateStaticParams() {
    return Object.keys(CITIES).map((city) => ({
        city,
    }));
}

export default async function CityPage({ params }: Props) {
    const { city } = await params;
    const cityKey = city as CityKey;
    const cityData = CITIES[cityKey];

    if (!cityData) {
        notFound();
    }

    // Limit to top 18 (visually appealing grid 3x6) and ensure at least 200 reviews for credibility
    const restaurants = await getRestaurantsByCity(cityData.filter, 18, 200);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        Best Halal Restaurants in {cityData.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        Discover the top 18 rated halal dining spots in {cityData.name}.
                        Explore the full map to see all options near you.
                    </p>
                    <div className="mt-6">
                        <Link href="/" className="inline-flex items-center justify-center rounded-full text-base font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-12 px-8 shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5">
                            Explore All Halal Restaurants
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {restaurants.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No restaurants found in {cityData.name} yet.</p>
                        <Link href="/" className="inline-flex mt-4 items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
                            View Map
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurants.map((restaurant) => (
                            <Link
                                key={restaurant.id}
                                href={`/restaurant/${restaurant.slug}`}
                                className="group block bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-800"
                            >
                                <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-800">
                                    {restaurant.image ? (
                                        <Image
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span>{restaurant.rating.toFixed(1)}</span>
                                        <span className="text-gray-400">({restaurant.reviews})</span>
                                    </div>

                                    {restaurant.price && (
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                                            {restaurant.price}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors truncate">
                                        {restaurant.name}
                                    </h2>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {restaurant.categories.slice(0, 3).map((cat, i) => (
                                            <span key={i} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        {restaurant.address}
                                    </div>

                                    {restaurant.halalStatus === 'certified' && (
                                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-md border border-emerald-100 dark:border-emerald-900/50">
                                            Halal Certified
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-16 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-8 md:p-12 text-center border border-emerald-100 dark:border-emerald-900/50">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Explore More Options in {cityData.name}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        This is just a selection of the top rated spots. Use our interactive map to filter by cuisine, rating, and distance to find exactly what you're craving.
                    </p>
                    <Link href="/" className="inline-flex items-center justify-center rounded-full text-base font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-14 px-8 shadow-lg hover:animate-pulse">
                        Explore All Halal Restaurants
                    </Link>
                </div>
            </div>
        </main>
    );
}
