import { cache } from 'react';
import { getDiscoveryRestaurants } from '@/lib/data';

export const getCachedDiscoveryRestaurants = cache(getDiscoveryRestaurants);
