import { fetchAll, fetchOne } from './supabase';
import { generateSlug } from './slug';
import { computeIsOpenNow } from './hours';
import type { HalalStatus } from '@/components/TrustBadge';
import type { DietaryInfo } from '@/components/DietaryFlags';

// --- Google Data Types ---
export type GoogleImage = {
    url: string;
    width?: number;
    height?: number;
    html_attributions?: string[];
};

// Based on actual DB data
export type GoogleReview = {
    name: string; // was author_name
    reviewerPhotoUrl?: string; // was profile_photo_url
    stars: number; // was rating
    text: string | null;
    publishAt: string; // e.g. "3 hours ago"
    publishedAtDate?: string; // ISO string
};

export type GoogleData = {
    imageUrls?: string[]; // Sometimes flat array
    images?: GoogleImage[]; // Sometimes rich objects
    reviews?: GoogleReview[];
    rating?: number;
    user_ratings_total?: number;
    openingHours?: any; // Complex object
    formatted_phone_number?: string;
    formatted_address?: string;
    website?: string;
    url?: string; // Google Maps URL
};

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
    halalStatus: HalalStatus;
    dietaryInfo?: DietaryInfo;
    googleData?: GoogleData | null; // Rich data from Google Maps
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
    halal_status: string | null;
    google_data: any | null; // JSONB
    slug?: string; // View has slug
};


export async function getDiscoveryRestaurants(): Promise<RestaurantCard[]> {
    // Light fetch for homepage (excludes heavy google_data)
    const rawData = await fetchAll<RawRow>("halal_restaurants", {
        select: "id,name,lat,lng,image_url,categories,rating,reviews_count,address,price,opening_hours,google_url,phone,website,permanently_closed,temporarily_closed,halal_status",
        filters: [
            "or=(permanently_closed.is.false,permanently_closed.is.null)",
            "or=(temporarily_closed.is.false,temporarily_closed.is.null)",
        ],
    });

    return rawData
        .filter(r => r && r.name && r.name.trim().length > 0)
        .map(transformRow)
        .sort((a, b) => b.rating - a.rating);
}

export async function getRestaurantById(id: string): Promise<RestaurantCard | null> {
    const rawData = await fetchOne<RawRow>("halal_restaurants", {
        select: "id,name,lat,lng,image_url,categories,rating,reviews_count,address,price,opening_hours,google_url,phone,website,permanently_closed,temporarily_closed,halal_status,google_data",
        filters: [`id=eq.${id}`],
    });

    if (!rawData) return null;
    return transformRow(rawData);
}

import { cache } from 'react';

/**
 * Get a restaurant by its SEO-friendly slug
 * Optimized to fetch single row directly using slug column
 */
export const getRestaurantBySlug = cache(async (slug: string): Promise<RestaurantCard | null> => {
    // Try precise lookup first (if view has slug column populated correctly)
    const rawData = await fetchOne<RawRow>("halal_restaurants", {
        select: "id,name,lat,lng,image_url,categories,rating,reviews_count,address,price,opening_hours,google_url,phone,website,permanently_closed,temporarily_closed,halal_status,google_data,slug",
        filters: [`slug=eq.${slug}`],
    });

    if (rawData) {
        return transformRow(rawData);
    }

    // Fallback: If generic slug generation in DB differs from code, try ID extraction method
    // (This handles legacy slugs or if DB slug is missing)
    const match = slug.match(/-([a-f0-9]{4})$/);
    if (!match) return null;
    const shortId = match[1];

    // Find the matching restaurant ID first (lightweight query)
    const all = await getDiscoveryRestaurants();
    const found = all.find(r => r.id.endsWith(shortId));

    if (!found) return null;

    // Then fetch the FULL data with google_data using the ID
    return getRestaurantById(found.id);
});

export async function getAllRestaurantSlugs(): Promise<{ slug: string }[]> {
    // Fetching minimal data for static params
    const rawData = await fetchAll<{ name: string; id: string; slug?: string }>("halal_restaurants", {
        select: "name,id,slug",
        filters: [
            "or=(permanently_closed.is.false,permanently_closed.is.null)",
            "or=(temporarily_closed.is.false,temporarily_closed.is.null)",
        ],
    });

    if (!rawData) return [];

    return rawData.map((row) => ({
        slug: row.slug || generateSlug(row.name, row.id),
    }));
}

// --- Helper ---

function transformRow(r: RawRow): RestaurantCard {
    let categories: string[] = Array.isArray(r.categories) ? r.categories : [];

    // Clean categories
    const junkCategories = ['establishment', 'point_of_interest', 'food', 'store', 'restaurant'];
    const filteredCategories = categories
        .filter(c => !junkCategories.includes(c.toLowerCase()))
        .map(c => c.replace(/ restaurant$/i, '').trim());

    const isOpenNow = computeIsOpenNow(r.opening_hours, false);

    return {
        id: r.id,
        // Use DB slug if valid, otherwise generate
        slug: r.slug || generateSlug(r.name, r.id),
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
        halalStatus: (r.halal_status as HalalStatus) || 'community_listed',
        googleData: r.google_data || null,
    };
}
