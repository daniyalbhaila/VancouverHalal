import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RestaurantCard } from '@/lib/data';
import { Star, Navigation, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance } from '@/lib/location';
import { Map as MapComponent, MapControls, MapMarker, MarkerContent, MarkerLabel, MarkerPopup } from '@/components/ui/map';
import { RestaurantImage } from '@/components/RestaurantImage';
import { TrustBadge } from '@/components/TrustBadge';
import Link from 'next/link';



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

                        {/* 3. Popup Card - Styled like Home Page Cards */}
                        <MarkerPopup className="p-0 min-w-[280px] max-w-[320px] border-none shadow-2xl rounded-2xl overflow-hidden">
                            <div className="relative h-48 w-full">
                                <Link
                                    href={`/restaurant/${restaurant.slug}`}
                                    className="absolute inset-0 z-0"
                                    aria-label={`View details for ${restaurant.name}`}
                                />

                                {/* Background Image */}
                                <RestaurantImage
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    seed={restaurant.categories[0] || restaurant.name}
                                    sizes="320px"
                                    fallbackTextClassName="text-4xl"
                                    quality={60}
                                />

                                {/* Gradient Overlays - matches home cards */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-20" />

                                {/* Top Left: Open/Closed */}
                                <div className="absolute top-3 left-3 z-10">
                                    {restaurant.isOpenNow ? (
                                        <div className="px-2 py-1 bg-emerald-500 rounded-full shadow-lg flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Open</span>
                                        </div>
                                    ) : (
                                        <div className="px-2 py-1 bg-red-500 rounded-full shadow-lg">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Closed</span>
                                        </div>
                                    )}
                                </div>

                                {/* Top Right: Trust Badge + Distance */}
                                <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
                                    <TrustBadge status={restaurant.halalStatus} variant="compact" />
                                    {location && (
                                        <div className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1 shadow-sm text-white/90">
                                            <MapPin className="w-3 h-3 text-white" />
                                            <span className="text-[10px] font-bold">{((calculateDistance(location.lat, location.lng, restaurant.location.lat, restaurant.location.lng)).toFixed(1))} km</span>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Content Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                                    <div className="flex justify-between items-end gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-md">
                                            {restaurant.name}
                                        </h3>
                                        {/* Rating Badge */}
                                        <div className="flex items-center gap-0.5 bg-yellow-400 text-black px-1.5 py-0.5 rounded-md shrink-0 font-bold text-xs shadow-lg">
                                            {restaurant.rating.toFixed(1)}
                                            <Star className="w-3 h-3 fill-black" />
                                            <span className="text-[9px] opacity-70">({restaurant.reviews})</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-white/70 mb-3">{restaurant.price} · {restaurant.categories[0]} · {restaurant.address.split(',')[0]}</p>

                                    {/* Action Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.open(
                                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + " " + restaurant.address)}`,
                                                '_blank'
                                            );
                                        }}
                                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-white text-zinc-900 text-xs font-bold rounded-full hover:bg-zinc-100 transition-colors shadow-lg"
                                    >
                                        <Navigation className="w-3.5 h-3.5" />
                                        Directions
                                    </button>
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
                            <div className="relative h-6 w-6">
                                <div className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping" />
                                <div className="absolute inset-1 rounded-full bg-blue-500/70" />
                            </div>
                        </MarkerContent>
                    </MapMarker>
                )}

            </MapComponent>
        </div>
    );
}
