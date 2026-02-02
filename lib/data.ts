import { fetchAll, fetchOne } from './supabase';

export type RestaurantCard = {
    id: string;
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

type OpeningHoursPeriod = {
    open?: {
        day: number;
        time: string;
    };
    close?: {
        day: number;
        time: string;
    };
};

type OpeningHours = {
    periods?: OpeningHoursPeriod[];
    open_now?: boolean;
};

const VANCOUVER_TIME_ZONE = 'America/Vancouver';
const MINUTES_PER_DAY = 24 * 60;
const MINUTES_PER_WEEK = 7 * MINUTES_PER_DAY;

const parseMinutes = (time: string) => {
    const hours = Number(time.slice(0, 2));
    const minutes = Number(time.slice(2));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
    }
    return hours * 60 + minutes;
};

const getCurrentVancouverMinutes = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: VANCOUVER_TIME_ZONE,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const weekday = parts.find((part) => part.type === 'weekday')?.value ?? 'Sun';
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
    const dayIndexMap: Record<string, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
    };
    const dayIndex = dayIndexMap[weekday] ?? 0;
    return dayIndex * MINUTES_PER_DAY + hour * 60 + minute;
};

const isOpenFromPeriods = (openingHours: OpeningHours | null) => {
    if (!openingHours?.periods || openingHours.periods.length === 0) {
        return false;
    }

    const nowMinutes = getCurrentVancouverMinutes();
    return openingHours.periods.some((period) => {
        if (!period.open) {
            return false;
        }
        if (!period.close) {
            return true;
        }
        const openMinutes = parseMinutes(period.open.time);
        const closeMinutes = parseMinutes(period.close.time);
        if (openMinutes === null || closeMinutes === null) {
            return false;
        }
        const openTotal = period.open.day * MINUTES_PER_DAY + openMinutes;
        let closeTotal = period.close.day * MINUTES_PER_DAY + closeMinutes;
        if (closeTotal <= openTotal) {
            closeTotal += MINUTES_PER_WEEK;
        }
        const normalizedNow = nowMinutes < openTotal ? nowMinutes + MINUTES_PER_WEEK : nowMinutes;
        return normalizedNow >= openTotal && normalizedNow < closeTotal;
    });
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
            let isOpenNow = false;
            try {
                if (r.opening_hours) {
                    const parsedHours: OpeningHours =
                        typeof r.opening_hours === 'string'
                            ? JSON.parse(r.opening_hours)
                            : r.opening_hours;
                    isOpenNow = isOpenFromPeriods(parsedHours);
                    if (!parsedHours?.periods && typeof parsedHours?.open_now === 'boolean') {
                        isOpenNow = parsedHours.open_now;
                    }
                }
            } catch (e) {
                isOpenNow = false;
            }

            return {
                id: r.id,
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

    let isOpenNow = false;
    try {
        if (r.opening_hours) {
            const parsedHours: OpeningHours =
                typeof r.opening_hours === 'string'
                    ? JSON.parse(r.opening_hours)
                    : r.opening_hours;
            isOpenNow = isOpenFromPeriods(parsedHours);
            if (!parsedHours?.periods && typeof parsedHours?.open_now === 'boolean') {
                isOpenNow = parsedHours.open_now;
            }
        }
    } catch (e) {
        isOpenNow = false;
    }

    return {
        id: r.id,
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
