'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Compass, Flame, Map, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const isMapView = searchParams.get('view') === 'map';
    const isRestaurantPage = pathname?.startsWith('/restaurant/');

    useEffect(() => {
        router.prefetch('/');
        router.prefetch('/?view=map');
        router.prefetch('/swipe');
        router.prefetch('/saved');
    }, [router]);

    if (isRestaurantPage) return null;

    const tabs = [
        { name: 'Explore', href: '/', icon: Compass, isActive: pathname === '/' && !isMapView },
        { name: 'Swipe', href: '/swipe', icon: Flame, isActive: pathname === '/swipe' },
        { name: 'Map', href: '/?view=map', icon: Map, isActive: isMapView },
        { name: 'Saved', href: '/saved', icon: Heart, isActive: pathname === '/saved' },
    ];

    return (
        <nav className="fixed bottom-8 left-4 right-4 z-50 flex justify-center pb-safe">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ viewTransitionName: 'bottom-nav' }}
                className={cn(
                    "flex items-center justify-between px-6 py-3 w-full max-w-[320px]",
                    "bg-[var(--glass-bg)] backdrop-blur-2xl shadow-2xl",
                    "rounded-full border border-[var(--glass-border)]",
                    "transform-gpu transition-colors"
                )}
            >
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className="relative flex flex-col items-center justify-center w-12 h-12"
                    >
                        {tab.isActive && (
                            <motion.div
                                layoutId="nav-pill"
                                className="absolute inset-0 bg-[var(--glass-bg)] rounded-full shadow-inner"
                                style={{ backdropFilter: "blur(4px)" }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">
                            <tab.icon
                                className={cn(
                                    "w-6 h-6 transition-all duration-300",
                                    tab.isActive
                                        ? "text-[var(--text-primary)] stroke-[2.5px] scale-110 drop-shadow-sm"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                )}
                            />
                        </span>
                    </Link>
                ))}
            </motion.div>
        </nav>
    );
}
