'use client';

import { Map as MapComponent, MapMarker, MarkerContent } from '@/components/ui/map';
import { ExternalLink } from 'lucide-react';

type LocationMapProps = {
    lat: number;
    lng: number;
    name: string;
    address: string;
    googleMapsUrl: string;
    rating: number;
};

export function LocationMap({ lat, lng, name, address, googleMapsUrl, rating }: LocationMapProps) {
    return (
        <div className="rounded-2xl overflow-hidden border border-border/50">
            {/* Map Preview - Using same MapComponent as main map */}
            <div className="h-[180px] relative">
                <MapComponent
                    center={[lng, lat]}
                    zoom={15}
                    theme="light"
                    attributionControl={false}
                    interactive={false}
                    scrollZoom={false}
                    dragPan={false}
                    dragRotate={false}
                    touchZoomRotate={false}
                    doubleClickZoom={false}
                    keyboard={false}
                >
                    {/* Restaurant Marker - Same style as main map */}
                    <MapMarker longitude={lng} latitude={lat}>
                        <MarkerContent>
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 text-white border-2 border-white shadow-lg transition-transform">
                                <span className="text-xs font-bold">
                                    {rating.toFixed(1)}
                                </span>
                            </div>
                        </MarkerContent>
                    </MapMarker>
                </MapComponent>
            </div>

            {/* Address + Google Maps Button */}
            <div className="p-4 bg-bg-card">
                <p className="text-sm text-text-primary font-medium mb-3">{address}</p>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-bold transition-colors"
                >
                    <ExternalLink className="w-4 h-4" />
                    Open in Google Maps
                </a>
            </div>
        </div>
    );
}
