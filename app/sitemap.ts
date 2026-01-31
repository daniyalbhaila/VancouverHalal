import { getDiscoveryRestaurants } from '@/lib/data';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://vancouverhalal.com'; // Replace with actual domain
    const restaurants = await getDiscoveryRestaurants();

    // Static routes
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/map`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];

    // Dynamic routes (if we had individual pages, which we don't yet, but good to have ready)
    // For now, these are anchors or modal-ready URLs if we implemented them. 
    // Since we don't have /restaurant/[id] pages yet, we'll stick to the main ones.
    // But if we DID have them:
    /*
    const restaurantRoutes = restaurants.map((restaurant) => ({
      url: `${baseUrl}/restaurant/${restaurant.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));
    return [...routes, ...restaurantRoutes];
    */

    return routes;
}
