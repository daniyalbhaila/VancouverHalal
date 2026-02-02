import { getDiscoveryRestaurants } from '@/lib/data';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://vancouverhalal.com';
    const restaurants = await getDiscoveryRestaurants();

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/swipe`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/saved`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ];

    // Restaurant pages with SEO-friendly slugs
    const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map((restaurant) => ({
        url: `${baseUrl}/restaurant/${restaurant.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...restaurantRoutes];
}
