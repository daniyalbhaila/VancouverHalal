import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RestaurantCard } from '@/lib/data';
import { Star, Navigation, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance } from '@/lib/location';
import { Map as MapComponent, MapControls, MapMarker, MarkerContent, MarkerLabel, MarkerPopup } from '@/components/ui/map';
import { RestaurantImage } from '@/components/RestaurantImage';
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

                        {/* 3. Popup Card */}
                        <MarkerPopup className="p-0 min-w-[260px] max-w-[300px] border-none shadow-xl rounded-2xl">
                            {/* Make entire card clickable */}
                            <Link href={`/restaurant/${restaurant.slug}`} className="block">
                                <div className="flex flex-col overflow-hidden rounded-2xl">
                                    {/* Image Header */}
                                    <div className="h-28 w-full bg-zinc-100 relative">
                                        <RestaurantImage
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            seed={restaurant.categories[0] || restaurant.name}
                                            sizes="300px"
                                            fallbackTextClassName="text-4xl"
                                        />
                                        {/* Distance Badge */}
                                        {location && (
                                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-zinc-700 shadow-sm">
                                                📍 {((calculateDistance(location.lat, location.lng, restaurant.location.lat, restaurant.location.lng)).toFixed(1))} km
                                            </div>
                                        )}
                                        {/* Open/Closed Badge */}
                                        <div className={cn(
                                            "absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shadow-sm",
                                            restaurant.isOpenNow
                                                ? "bg-emerald-500 text-white"
                                                : "bg-rose-500 text-white"
                                        )}>
                                            {restaurant.isOpenNow ? 'Open' : 'Closed'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 bg-white">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="font-bold text-base text-zinc-900 leading-tight">{restaurant.name}</h3>
                                            {/* Rating Badge - matches discovery cards */}
                                            <div className="flex items-center gap-0.5 bg-yellow-400 text-black px-1.5 py-0.5 rounded-md shrink-0 font-bold text-xs">
                                                {restaurant.rating.toFixed(1)}
                                                <Star className="w-3 h-3 fill-black" />
                                                <span className="text-[9px] opacity-70">({restaurant.reviews})</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-zinc-500 mb-2">{restaurant.price} · {restaurant.categories[0]}</p>

                                        {/* Action Row - Dark buttons like discovery */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                onClick={(e) => e.stopPropagation()}
                                                className="contents"
                                            >
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + " " + restaurant.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-zinc-900 text-white text-xs font-bold rounded-full hover:bg-zinc-700 transition-colors"
                                                >
                                                    <Navigation className="w-3 h-3" />
                                                    Directions
                                                </a>
                                            </span>
                                            {/* Subtle "See more" text - just tapping card also works */}
                                            <span className="text-xs text-zinc-400 font-medium">
                                                Tap for details →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
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
