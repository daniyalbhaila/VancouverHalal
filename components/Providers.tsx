'use client';

import { useEffect } from 'react';
import { LocationProvider } from '@/context/LocationContext';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // no-op
            });
        }
    }, []);

    return (
        <LocationProvider>
            {children}
        </LocationProvider>
    );
}
