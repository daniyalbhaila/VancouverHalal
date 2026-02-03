'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { RestaurantImage } from './RestaurantImage';
import { Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ImageGalleryProps = {
    images: string[];
    alt: string;
    className?: string;
};

export function ImageGallery({ images, alt, className }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fsScrollRef = useRef<HTMLDivElement>(null);

    // Initial Scroll Position Callback
    const setFsScrollRef = (node: HTMLDivElement | null) => {
        fsScrollRef.current = node;
        if (node && isFullScreen) {
            // Direct scroll immediately
            node.scrollLeft = currentIndex * node.clientWidth;
        }
    };

    // Track scroll position for MAIN gallery
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            if (!isFullScreen) {
                const index = Math.round(el.scrollLeft / el.clientWidth);
                if (index !== currentIndex) {
                    setCurrentIndex(index);
                }
            }
        };

        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, [isFullScreen, currentIndex]);

    // Track scroll position for FULL SCREEN gallery
    useEffect(() => {
        const el = fsScrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            setIsScrolling(true);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false);
            }, 300);

            const index = Math.round(el.scrollLeft / el.clientWidth);
            if (index !== currentIndex) {
                setCurrentIndex(index);
            }
        };

        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            el.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [isFullScreen, currentIndex]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []);

    // Sync Background Scroll (Main Gallery) when Current Index changes in Full Screen
    useEffect(() => {
        if (isFullScreen && scrollRef.current) {
            scrollRef.current.scrollTo({
                left: currentIndex * scrollRef.current.clientWidth,
                behavior: 'instant'
            });
        }
    }, [isFullScreen, currentIndex]);

    // Prevent scrolling on body when FS is open
    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullScreen]);

    // Filter out potential bad URLs or empty strings
    const validImages = images.filter(Boolean);
    const hasImages = validImages.length > 0;

    if (!hasImages) {
        return (
            <div className={cn("relative w-full h-full bg-zinc-100 dark:bg-zinc-800", className)}>
                <RestaurantImage src={null} alt={alt} seed={alt} className="w-full h-full" />
            </div>
        );
    }

    const handleTapNavigation = (
        e: React.MouseEvent<HTMLDivElement>,
        ref: React.RefObject<HTMLDivElement | null>,
        isMain: boolean
    ) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        // Left 30% -> Previous
        if (x < width * 0.3) {
            if (currentIndex > 0) {
                el.scrollTo({
                    left: (currentIndex - 1) * width,
                    behavior: 'smooth'
                });
            }
        }
        // Right 30% -> Next
        else if (x > width * 0.7) {
            if (currentIndex < validImages.length - 1) {
                el.scrollTo({
                    left: (currentIndex + 1) * width,
                    behavior: 'smooth'
                });
            }
        }
        // Center -> Action
        else {
            if (isMain) {
                setIsFullScreen(true);
            } else {
                handleClose();
            }
        }
    };

    const handleClose = () => {
        setIsFullScreen(false);
    };

    return (
        <>
            {/* Main Inline Gallery */}
            <div className={cn("relative group", className)}>
                <div
                    ref={scrollRef}
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-x cursor-pointer"
                    style={{ scrollBehavior: 'smooth' }}
                    onClick={(e) => handleTapNavigation(e, scrollRef, true)}
                >
                    {validImages.map((src, i) => (
                        <div
                            key={`${src}-${i}`}
                            className="flex-none w-full h-full relative snap-center"
                        >
                            <RestaurantImage
                                src={src}
                                alt={`${alt} photo ${i + 1}`}
                                seed={alt}
                                priority={i === 0}
                                sizes="(max-width: 768px) 100vw, 1200px"
                                className="bg-zinc-100 dark:bg-zinc-900 object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Counter Badge */}
                <div className="absolute bottom-8 right-4 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-sm border border-white/10 pointer-events-none">
                    <Camera className="w-3.5 h-3.5" />
                    <span>
                        {currentIndex + 1} / {validImages.length}
                    </span>
                </div>

                {/* Dots */}
                {validImages.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                        {validImages.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300",
                                    i === currentIndex
                                        ? "bg-white scale-125"
                                        : "bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Full Screen Overlay - Portaled */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isFullScreen && (
                        <motion.div
                            key="lightbox-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
                            onClick={handleClose}
                        >
                            {/* Close Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClose();
                                }}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white/80 hover:text-white backdrop-blur-md transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* FS Scroll Container */}
                            <div
                                ref={setFsScrollRef}
                                className="flex-1 w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-x flex items-center"
                                style={{ scrollBehavior: 'smooth' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTapNavigation(e, fsScrollRef, false);
                                }}
                            >
                                {validImages.map((src, i) => (
                                    <div key={`${src}-fs-${i}`} className="flex-none w-full h-full flex items-center justify-center snap-center relative p-2 md:p-8">
                                        <div className="relative w-full h-full max-h-[85vh] max-w-[100vw] flex items-center justify-center">
                                            <div className="relative w-full h-full flex items-center justify-center p-0 md:p-8">
                                                <RestaurantImage
                                                    src={src}
                                                    alt={`${alt} full screen ${i + 1}`}
                                                    seed={alt}
                                                    className="object-contain"
                                                    priority={i === currentIndex} // Only prioritize current
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* FS Bottom Bar */}
                            <div
                                className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
                            >
                                <div className="px-4 py-2 bg-zinc-900/80 rounded-full text-white font-bold backdrop-blur border border-white/10 text-sm">
                                    {currentIndex + 1} / {validImages.length}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
