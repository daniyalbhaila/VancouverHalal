'use client';

import { useState } from 'react';
import { Map as MapComponent, MapMarker, MarkerContent } from '@/components/ui/map';
import { ExternalLink, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type LocationMapProps = {
    lat: number;
    lng: number;
    name: string;
    address: string;
    googleMapsUrl: string;
    rating: number;
};

export function LocationMap({ lat, lng, name, address, googleMapsUrl, rating }: LocationMapProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-bg-card transition-all duration-300">
            {/* Header / Collapsed View */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 flex items-start justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-text-primary">Location</h3>
                        <p className="text-sm text-text-secondary leading-snug max-w-[220px]">{address}</p>
                    </div>
                </div>
                <button
                    className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-text-secondary"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {/* Expanded Content */}
            <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}>
                <div className="overflow-hidden min-h-0">
                    {/* Map Container */}
                    <div className="h-[250px] relative w-full border-t border-border/50">
                        <MapComponent
                            center={[lng, lat]}
                            zoom={15}
                            theme="light"
                            attributionControl={false}
                            interactive={false} // Keep static for performance, click to open Google Maps
                            scrollZoom={false}
                            dragPan={true} // Allow panning if expanded
                            dragRotate={false}
                            touchZoomRotate={false}
                            doubleClickZoom={false}
                            keyboard={false}
                        >
                            <MapMarker longitude={lng} latitude={lat}>
                                <MarkerContent>
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 text-white border-2 border-white shadow-lg">
                                        <span className="text-xs font-bold">
                                            {rating.toFixed(1)}
                                        </span>
                                    </div>
                                </MarkerContent>
                            </MapMarker>
                        </MapComponent>

                        {/* Overlay to Open Google Maps */}
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-4 right-4 bg-white shadow-lg text-black text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 z-10"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Open in Google Maps
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
