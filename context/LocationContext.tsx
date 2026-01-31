'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface LocationState {
    location: { lat: number; lng: number } | null;
    error: string | null;
    loading: boolean;
}

const LocationContext = createContext<LocationState | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<LocationState>({
        location: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

        // Timeout: Stop loading after 3s so UI can show (for crawlers/slow permission prompts)
        // If user grants location later, we'll still update!
        const timeout = setTimeout(() => {
            setState(s => {
                if (s.loading) {
                    return { ...s, loading: false };
                }
                return s;
            });
        }, 3000);

        // 1. Check Local Storage first (with expiry check)
        const cachedStr = localStorage.getItem('user_location');

        if (cachedStr) {
            try {
                const cached = JSON.parse(cachedStr);
                if (cached.timestamp && Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
                    clearTimeout(timeout);
                    setState({
                        location: { lat: cached.lat, lng: cached.lng },
                        error: null,
                        loading: false,
                    });
                    return () => clearTimeout(timeout);
                }
            } catch {
                // Invalid cache, will fetch fresh
            }
        }

        // 2. Request Fresh Location (cache expired or missing)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeout);
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now(),
                    };
                    localStorage.setItem('user_location', JSON.stringify(loc));
                    // Update state - even if timeout already fired, this will add location data!
                    setState({
                        location: { lat: loc.lat, lng: loc.lng },
                        error: null,
                        loading: false,
                    });
                },
                (err) => {
                    clearTimeout(timeout);
                    setState(s => ({ ...s, error: err.message, loading: false }));
                }
            );
        } else {
            clearTimeout(timeout);
            setState(s => ({ ...s, error: 'Geolocation not supported', loading: false }));
        }

        return () => clearTimeout(timeout);
    }, []);

    return (
        <LocationContext.Provider value={state}>
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
