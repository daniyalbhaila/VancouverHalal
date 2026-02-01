'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Compass, Flame, Map, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const isMapView = searchParams.get('view') === 'map';
    const [pressedTab, setPressedTab] = useState<string | null>(null);

    useEffect(() => {
        router.prefetch('/');
        router.prefetch('/?view=map');
        router.prefetch('/swipe');
        router.prefetch('/saved');
        import('@/components/Map');
    }, [router]);

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
                        prefetch
                        scroll={false}
                        className="relative flex flex-col items-center justify-center w-12 h-12"
                        onPointerDown={() => setPressedTab(tab.name)}
                        onPointerUp={() => setPressedTab(null)}
                        onPointerLeave={() => setPressedTab(null)}
                    >
                        {tab.isActive && (
                            <motion.div
                                layoutId="nav-pill"
                                className="absolute inset-0 bg-[var(--glass-bg)] rounded-full shadow-inner"
                                style={{ backdropFilter: "blur(4px)" }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <motion.span
                            className="relative z-10"
                            whileTap={{ scale: 0.88 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                        >
                            <tab.icon
                                className={cn(
                                    "w-6 h-6 transition-all duration-200",
                                    tab.isActive
                                        ? "text-[var(--text-primary)] stroke-[2.5px] scale-110 drop-shadow-sm"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                                    pressedTab === tab.name && "text-[var(--text-primary)] scale-105"
                                )}
                            />
                        </motion.span>
                    </Link>
                ))}
            </motion.div>
        </nav>
    );
}
