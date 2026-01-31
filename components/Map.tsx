import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RestaurantCard } from '@/lib/data';
import { RestaurantCard as CardComponent } from '@/components/RestaurantCard';
import { X, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance } from '@/lib/location';

interface MapProps {
    restaurants: RestaurantCard[];
    isVisible?: boolean;
}

export default function Map({ restaurants, isVisible = true }: MapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantCard | null>(null);
    const { location } = useLocation();
    const hasCentered = useRef(false);
    const [isDark, setIsDark] = useState(false);

    // Detect dark mode preference - DISABLED FOR NOW
    // useEffect(() => {
    //     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    //     setIsDark(mediaQuery.matches);
    //     const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    //     mediaQuery.addEventListener('change', handler);
    //     return () => mediaQuery.removeEventListener('change', handler);
    // }, []);

    // Resize map when visibility changes
    useEffect(() => {
        if (isVisible && map.current) {
            // Give it a tick to paint the display:block
            setTimeout(() => {
                map.current?.resize();

                // If we haven't centered properly (or if we need to re-center because it was hidden)
                if (location && restaurants.length > 0) {
                    fitMapToBounds(location, restaurants);
                }
            }, 100);
        }
    }, [isVisible, location, restaurants]);

    const fitMapToBounds = (loc: { lat: number, lng: number }, rests: RestaurantCard[]) => {
        if (!map.current) return;

        // Find 10 closest restaurants
        const sortedByDist = [...rests]
            .map(r => ({ ...r, dist: calculateDistance(loc.lat, loc.lng, r.location.lat, r.location.lng) }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 10);

        // Create bounds including user and these restaurants
        const bounds = new maplibregl.LngLatBounds();
        bounds.extend([loc.lng, loc.lat]);
        sortedByDist.forEach(r => bounds.extend([r.location.lng, r.location.lat]));

        try {
            map.current.fitBounds(bounds, {
                padding: { top: 100, bottom: 300, left: 50, right: 50 },
                maxZoom: 13,
                duration: 2000,
                essential: true
            });
            hasCentered.current = true;
        } catch (e) {
            // map might not be ready
        }

        // Update user marker
        const el = document.createElement('div');
        el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg pulse-ring user-marker';
        const existing = document.querySelector('.user-marker');
        if (existing) existing.remove();

        new maplibregl.Marker({ element: el })
            .setLngLat([loc.lng, loc.lat])
            .addTo(map.current);
    };

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        // Default to Vancouver center
        const defaultCenter = { lng: -123.1207, lat: 49.2827 };

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: isDark
                ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
                : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
            center: location ? [location.lng, location.lat] : [defaultCenter.lng, defaultCenter.lat],
            zoom: location ? 14 : 12,
            attributionControl: false,
        });

        map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        // Initialize Geolocation Control (but don't trigger automatically to avoid double-zoom)
        const geolocate = new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserLocation: true
        });
        map.current.addControl(geolocate, 'top-right');

        return () => {
            map.current?.remove();
            map.current = null;
        }
    }, []);


    // Add markers
    useEffect(() => {
        if (!map.current) return;

        restaurants.forEach((restaurant) => {
            const el = document.createElement('div');
            el.className = 'w-10 h-10 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform z-10 ' + (isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white');
            el.innerText = restaurant.rating.toFixed(1);

            // Add click listener to marker
            el.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent map click
                // Fly to location
                map.current?.flyTo({
                    center: [restaurant.location.lng, restaurant.location.lat],
                    zoom: 14,
                    padding: { bottom: 300 } // Offset for the drawer
                });
                setSelectedRestaurant(restaurant);
            });

            new maplibregl.Marker({ element: el })
                .setLngLat([restaurant.location.lng, restaurant.location.lat])
                .addTo(map.current!);
        });

        // Close drawer on map click
        map.current.on('click', () => {
            setSelectedRestaurant(null);
        });

    }, [restaurants]);

    return (
        <div className="w-full h-full relative">
            <div ref={mapContainer} className="w-full h-full" />

            {/* Restaurant Drawer */}
            <AnimatePresence>
                {selectedRestaurant && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-24 rounded-t-[2.5rem] bg-[var(--glass-bg)] backdrop-blur-xl shadow-[0_-10px_40px_var(--glass-shadow)] border-t border-[var(--glass-border)] transition-colors"
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-[var(--text-secondary)] rounded-full mx-auto mb-4 opacity-50" />

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedRestaurant(null)}
                            className="absolute top-5 right-5 p-2 bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] rounded-full text-[var(--text-secondary)] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <CardComponent data={selectedRestaurant} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
