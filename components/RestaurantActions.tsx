'use client';

import { Phone, Globe, Navigation } from 'lucide-react';
import posthog from 'posthog-js';

interface RestaurantActionsProps {
    phone?: string | null;
    website?: string | null;
    directionsUrl: string;
    variant?: 'desktop' | 'mobile';
    restaurantName: string;
    restaurantId: string;
}

export function RestaurantActions({ phone, website, directionsUrl, variant = 'desktop', restaurantName, restaurantId }: RestaurantActionsProps) {
    const trackClick = (action: string) => {
        posthog.capture(action, {
            restaurant_id: restaurantId,
            restaurant_name: restaurantName,
            source: 'details_page',
            device: variant
        });
    };

    if (variant === 'mobile') {
        return (
            <div className="flex gap-3 justify-center">
                {website && (
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick('click_website')}
                        className="flex-1 max-w-[100px] flex flex-col items-center justify-center gap-1 py-2.5 bg-bg-subtle/50 hover:bg-bg-subtle rounded-xl active:scale-95 transition-all text-text-primary"
                    >
                        <Globe className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Website</span>
                    </a>
                )}

                {phone && (
                    <a
                        href={`tel:${phone}`}
                        onClick={() => trackClick('click_call')}
                        className="flex-1 max-w-[100px] flex flex-col items-center justify-center gap-1 py-2.5 bg-bg-subtle/50 hover:bg-bg-subtle rounded-xl active:scale-95 transition-all text-text-primary"
                    >
                        <Phone className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Call</span>
                    </a>
                )}

                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('click_directions')}
                    className="flex-[1.5] max-w-[150px] flex flex-col items-center justify-center gap-1 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-all"
                >
                    <Navigation className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Directions</span>
                </a>
            </div>
        );
    }

    // Desktop Variant
    return (
        <div className="hidden md:flex gap-3 mt-6 flex-wrap">
            {phone && (
                <a
                    href={`tel:${phone}`}
                    onClick={() => trackClick('click_call')}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 bg-bg-subtle hover:bg-bg-subtle/80 rounded-xl text-sm font-bold transition-colors text-text-primary"
                >
                    <Phone className="w-4 h-4" /> Call
                </a>
            )}
            {website && (
                <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('click_website')}
                    className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 bg-bg-subtle hover:bg-bg-subtle/80 rounded-xl text-sm font-bold transition-colors text-text-primary"
                >
                    <Globe className="w-4 h-4" /> Website
                </a>
            )}
            <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('click_directions')}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-primary/20"
            >
                <Navigation className="w-4 h-4" /> Directions
            </a>
        </div>
    );
}
