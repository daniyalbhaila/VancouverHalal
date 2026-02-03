'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface LocationState {
    location: { lat: number; lng: number } | null;
    error: string | null;
    loading: boolean;
    requestLocation: () => void;
}

const LocationContext = createContext<LocationState | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState<LocationState['location']>(null);
    const [error, setError] = useState<LocationState['error']>(null);
    const [loading, setLoading] = useState<LocationState['loading']>(false);

    useEffect(() => {
        const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
        const cachedStr = localStorage.getItem('user_location');

        if (cachedStr) {
            try {
                const cached = JSON.parse(cachedStr);
                if (cached.timestamp && Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
                    setLocation({ lat: cached.lat, lng: cached.lng });
                    return;
                }
            } catch {
                // Invalid cache, ignore
            }
        }
    }, []);

    const requestLocation = useCallback(() => {
        if (loading) return;

        const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
        const cachedStr = localStorage.getItem('user_location');
        if (cachedStr) {
            try {
                const cached = JSON.parse(cachedStr);
                if (cached.timestamp && Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
                    setLocation({ lat: cached.lat, lng: cached.lng });
                    setError(null);
                    return;
                }
            } catch {
                // Ignore cache errors and request fresh
            }
        }

        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: Date.now(),
                };
                localStorage.setItem('user_location', JSON.stringify(loc));
                setLocation({ lat: loc.lat, lng: loc.lng });
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    }, [loading]);

    return (
        <LocationContext.Provider value={{ location, error, loading, requestLocation }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocationContext() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
}
