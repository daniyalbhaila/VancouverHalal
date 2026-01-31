import type { RestaurantCard } from '@/lib/data';
import { calculateDistance } from '@/lib/location';

export type RestaurantWithDistance = RestaurantCard & { distance?: number | null };

export function addDistanceToRestaurants(
  restaurants: RestaurantCard[],
  location: { lat: number; lng: number } | null
): RestaurantWithDistance[] {
  if (!location) {
    return restaurants.map((restaurant) => ({ ...restaurant, distance: null }));
  }

  return restaurants.map((restaurant) => ({
    ...restaurant,
    distance: calculateDistance(
      location.lat,
      location.lng,
      restaurant.location.lat,
      restaurant.location.lng
    ),
  }));
}
