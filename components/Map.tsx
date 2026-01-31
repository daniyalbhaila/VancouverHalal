import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RestaurantCard } from '@/lib/data';
import { Star, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance } from '@/lib/location';
import { Map as MapComponent, MapControls, MapMarker, MarkerContent, MarkerLabel, MarkerPopup } from '@/components/ui/map';
import { RestaurantImage } from '@/components/RestaurantImage';



interface MapProps {
    restaurants: RestaurantCard[];
    isVisible?: boolean;
}

export default function Map({ restaurants, isVisible = true }: MapProps) {
    const mapRef = useRef<maplibregl.Map>(null); // Ref to the map instance
    const { location } = useLocation();
    const hasCentered = useRef(false);

    // Default to Vancouver center
    const defaultCenter = { lng: -123.1207, lat: 49.2827 };

    // Resize map when visibility changes
    useEffect(() => {
        if (isVisible && mapRef.current) {
            // Give it a tick to paint the display:block
            setTimeout(() => {
                mapRef.current?.resize();

                // If we haven't centered properly (or if we need to re-center because it was hidden)
                if (location && restaurants.length > 0) {
                    fitMapToBounds(location, restaurants);
                }
            }, 100);
        }
    }, [isVisible, location, restaurants]);

    const fitMapToBounds = (loc: { lat: number, lng: number }, rests: RestaurantCard[]) => {
        if (!mapRef.current) return;

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
            mapRef.current.fitBounds(bounds, {
                padding: { top: 100, bottom: 300, left: 50, right: 50 },
                maxZoom: 13,
                duration: 2000,
                essential: true
            });
            hasCentered.current = true;
        } catch (e) {
            console.warn('Map fitBounds failed', e);
        }
    };

    return (
        <div className="w-full h-full relative">
            <MapComponent
                ref={mapRef}
                center={location ? [location.lng, location.lat] : [defaultCenter.lng, defaultCenter.lat]}
                zoom={location ? 14 : 12}
                theme="light"
                attributionControl={false}
            >
                {/* Remove MapEvents since we rely on native popup behavior now */}
                {/* <MapEvents onClick={handleMapClick} /> */}

                <MapControls position="bottom-right" showCompass showZoom showLocate />

                {/* Restaurant Markers */}
                {restaurants.map((restaurant) => (
                    <MapMarker
                        key={restaurant.id}
                        longitude={restaurant.location.lng}
                        latitude={restaurant.location.lat}
                        className="cursor-pointer hover:z-50"
                    >
                        {/* 1. Dot with Rating */}
                        <MarkerContent>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 text-white border-2 border-white shadow-md transition-transform hover:scale-110">
                                <span className="text-[10px] font-bold">
                                    {restaurant.rating.toFixed(1)}
                                </span>
                            </div>
                        </MarkerContent>

                        {/* 2. Label below marker */}
                        <MarkerLabel position="bottom">
                            <span className="text-xs font-bold text-zinc-800 drop-shadow-sm bg-white/50 backdrop-blur-sm px-1 rounded-sm">
                                {restaurant.name}
                            </span>
                        </MarkerLabel>

                        {/* 3. Popup Card */}
                        <MarkerPopup className="p-0 min-w-[250px] max-w-[300px] border-none shadow-xl rounded-2xl">
                            <div className="flex flex-col overflow-hidden rounded-2xl">
                                {/* Image Header */}
                                <div className="h-32 w-full bg-zinc-100 relative">
                                    <RestaurantImage
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        seed={restaurant.categories[0] || restaurant.name}
                                        sizes="300px"
                                        fallbackTextClassName="text-4xl"
                                    />
                                    {/* Category Badge */}
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-[10px] font-bold text-white uppercase">
                                        {restaurant.categories[0]}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 bg-white">
                                    <h3 className="font-bold text-lg text-zinc-900 leading-tight mb-1">{restaurant.name}</h3>

                                    <div className="flex items-center gap-1.5 mb-3">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn("w-3 h-3 fill-current", i < Math.floor(restaurant.rating) ? "text-yellow-500" : "text-zinc-300")}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-zinc-500">({restaurant.reviews})</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-xs font-medium">
                                            {restaurant.isOpenNow ? (
                                                <span className="text-emerald-600">Open Now</span>
                                            ) : (
                                                <span className="text-rose-600">Closed</span>
                                            )}
                                        </div>

                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + " " + restaurant.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-bold rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                                        >
                                            <Navigation className="w-3 h-3" />
                                            Directions
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </MarkerPopup>
                    </MapMarker>
                ))}

                {/* User Location Marker */}
                {location && (
                    <MapMarker
                        longitude={location.lng}
                        latitude={location.lat}
                    >
                        <MarkerContent className="z-50">
                            <div className="relative flex h-6 w-6 items-center justify-center">
                                <div className="absolute h-12 w-12 rounded-full bg-blue-500/20 ring-2 ring-white/80 shadow-[0_0_0_6px_rgba(59,130,246,0.18)]" />
                                <div className="absolute h-6 w-6 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
                            </div>
                        </MarkerContent>
                    </MapMarker>
                )}

            </MapComponent>
        </div>
    );
}
