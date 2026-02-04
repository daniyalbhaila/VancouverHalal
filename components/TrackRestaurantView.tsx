'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

interface TrackRestaurantViewProps {
    restaurant: {
        id: string;
        name: string;
        slug: string;
        categories: string[];
        rating?: number;
        city?: string;
    };
}

export function TrackRestaurantView({ restaurant }: TrackRestaurantViewProps) {
    useEffect(() => {
        posthog.capture('view_restaurant', {
            restaurant_id: restaurant.id,
            restaurant_name: restaurant.name,
            restaurant_slug: restaurant.slug,
            category: restaurant.categories[0] || 'Uncategorized',
            all_categories: restaurant.categories,
            rating: restaurant.rating,
        });
    }, [restaurant]);

    return null;
}
