'use client';

import { useLayoutEffect } from 'react';

/**
 * Forces the window to scroll to top on mount.
 * Workaround for Next.js View Transitions sometimes preserving scroll position
 * when navigating between pages with shared element transitions.
 */
export function ScrollReset() {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return null;
}
