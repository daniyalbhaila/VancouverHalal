import { fetchAll, fetchOne } from './supabase';
import { generateSlug } from './slug';
import { computeIsOpenNow } from './hours';

export type RestaurantCard = {
    id: string;
    slug: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    image: string | null;
    categories: string[];
    rating: number;
    reviews: number;
    address: string;
    price: string;
    isOpenNow: boolean;
    googleUrl: string | null;
    phone: string | null;
    website: string | null;
    openingHours: any | null;
};

// Raw row from Supabase View
type RawRow = {
    id: string;
    name: string;
    lat: number | null;
    lng: number | null;
    image_url: string | null;
    categories: string[] | null;
    rating: number | null;
    reviews_count: number | null;
    address: string | null;
    price: string | null;
    opening_hours: any | null;
    google_url: string | null;
    phone: string | null;
    website: string | null;
    permanently_closed: boolean | null;
    temporarily_closed: boolean | null;
};


export async function getDiscoveryRestaurants(): Promise<RestaurantCard[]> {
    const rawData = await fetchAll<RawRow>("halal_restaurants", {
        select: "id,name,lat,lng,image_url,categories,rating,reviews_count,address,price,opening_hours,google_url,phone,website,permanently_closed,temporarily_closed",
        filters: [
            "or=(permanently_closed.is.false,permanently_closed.is.null)",
            "or=(temporarily_closed.is.false,temporarily_closed.is.null)",
        ],
    });

    // Transform to clean schema
    return rawData
        .filter(r => r && r.name && r.name.trim().length > 0) // Ensure valid data
        .map((r) => {
            // Categories are already an array in Supabase response (if JSONB or Array type)
            // But let's be safe and ensure it is an array
            let categories: string[] = Array.isArray(r.categories) ? r.categories : [];

            // Filter out utility categories
            const junkCategories = ['establishment', 'point_of_interest', 'food', 'store', 'restaurant'];
            const filteredCategories = categories
                .filter(c => !junkCategories.includes(c.toLowerCase()))
                .map(c => c.replace(/ restaurant$/i, '').trim()); // Clean "Mediterranean restaurant" -> "Mediterranean"

            // Parse Opening Hours to check "Open Now" (Simplified)
            const isOpenNow = computeIsOpenNow(r.opening_hours, false);

            return {
                id: r.id,
                slug: generateSlug(r.name, r.id),
                name: r.name,
                location: {
                    lat: r.lat ? Number(r.lat) : 0,
                    lng: r.lng ? Number(r.lng) : 0,
                },
                image: r.image_url,
                categories: filteredCategories,
                rating: r.rating ? Number(r.rating) : 0,
                reviews: r.reviews_count || 0,
                address: r.address || '',
                price: r.price || '',
                isOpenNow,
                googleUrl: r.google_url,
                phone: r.phone,
                website: r.website,
                openingHours: r.opening_hours,
            };
        })
        .sort((a, b) => b.rating - a.rating); // Default sort by rating
}

export async function getRestaurantById(id: string): Promise<RestaurantCard | null> {
    const rawData = await fetchOne<RawRow>("halal_restaurants", {
        select: "id,name,lat,lng,image_url,categories,rating,reviews_count,address,price,opening_hours,google_url,phone,website,permanently_closed,temporarily_closed",
        filters: [`id=eq.${id}`],
    });

    if (!rawData) return null;

    // Reuse transformation logic (this should ideally be refactored into a helper, but for now copying for safety/speed)
    const r = rawData;
    let categories: string[] = Array.isArray(r.categories) ? r.categories : [];
    const junkCategories = ['establishment', 'point_of_interest', 'food', 'store', 'restaurant'];
    const filteredCategories = categories
        .filter(c => !junkCategories.includes(c.toLowerCase()))
        .map(c => c.replace(/ restaurant$/i, '').trim());

    const isOpenNow = computeIsOpenNow(r.opening_hours, false);

    return {
        id: r.id,
        slug: generateSlug(r.name, r.id),
        name: r.name,
        location: {
            lat: r.lat ? Number(r.lat) : 0,
            lng: r.lng ? Number(r.lng) : 0,
        },
        image: r.image_url,
        categories: filteredCategories,
        rating: r.rating ? Number(r.rating) : 0,
        reviews: r.reviews_count || 0,
        address: r.address || '',
        price: r.price || '',
        isOpenNow,
        googleUrl: r.google_url,
        phone: r.phone,
        website: r.website,
        openingHours: r.opening_hours,
    };
}

/**
 * Get a restaurant by its SEO-friendly slug
 * Extracts short ID from slug and finds matching restaurant
 */
export async function getRestaurantBySlug(slug: string): Promise<RestaurantCard | null> {
    // Extract short ID from end of slug (e.g., "caveman-cafe-86a7" -> "86a7")
    const match = slug.match(/-([a-f0-9]{4})$/);
    if (!match) return null;

    const shortId = match[1];

    // Get all restaurants and find the one matching this short ID
    // (PostgREST doesn't support LIKE on UUID columns)
    const restaurants = await getDiscoveryRestaurants();
    const restaurant = restaurants.find(r => r.id.endsWith(shortId));

    if (!restaurant) return null;

    return restaurant;
}
