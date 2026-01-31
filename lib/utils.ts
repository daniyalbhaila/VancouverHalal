import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Generate a deterministic gradient based on a string (e.g. Category)
export function getVibeGradient(seed: string): string {
    const gradients = [
        "from-orange-400 to-rose-400",       // Warm / Spicy
        "from-emerald-400 to-teal-500",      // Fresh / Healthy
        "from-amber-300 to-orange-500",      // Comfort / Burger
        "from-indigo-400 to-cyan-400",       // Cool / Evening
        "from-fuchsia-500 to-pink-500",      // Vibrant / Sweet
        "from-slate-900 to-slate-700",       // Dark / Premium
    ];

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % gradients.length;
    return `bg-gradient-to-br ${gradients[index]}`;
}

// End of utilities
