'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Compass, Flame, Map, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isMapView = searchParams.get('view') === 'map';

    const tabs = [
        {
            name: 'Explore',
            href: '/',
            icon: Compass,
            isActive: pathname === '/' && !isMapView
        },
        {
            name: 'Swipe',
            href: '/swipe',
            icon: Flame,
            isActive: pathname === '/swipe'
        },
        {
            name: 'Map',
            href: '/?view=map',
            icon: Map,
            isActive: isMapView
        },
        {
            name: 'Saved',
            href: '/saved',
            icon: Heart,
            isActive: pathname === '/saved'
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-zinc-100 pb-safe pt-2">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        href={tab.href}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                            tab.isActive ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-500"
                        )}
                    >
                        {tab.isActive && (
                            <motion.div
                                layoutId="nav-pill"
                                className="absolute -top-2 w-8 h-1 bg-zinc-900 rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <tab.icon className={cn("w-6 h-6", tab.isActive && "stroke-[2.5px]")} />
                        <span className={cn("text-[10px] font-bold tracking-tight", tab.isActive ? "opacity-100" : "opacity-0 translate-y-2")}>
                            {tab.name}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
