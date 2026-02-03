import { getRestaurantBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Globe, Phone, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from 'next';
import { RestaurantImage } from "@/components/RestaurantImage";
import { HoursDisplay } from "@/components/HoursDisplay";
import { LocationMap } from "@/components/LocationMap";
import { TrustBadge } from "@/components/TrustBadge";
import { SourceDisclaimer } from "@/components/SourceDisclaimer";
import { DietaryFlags, type DietaryInfo } from "@/components/DietaryFlags";

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const restaurant = await getRestaurantBySlug(slug);

    if (!restaurant) {
        return { title: 'Restaurant Not Found' };
    }

    return {
        title: `${restaurant.name} - Halal Vancouver`,
        description: `Visit ${restaurant.name} in Vancouver. Rated ${restaurant.rating}/5. ${restaurant.categories.join(', ')}.`,
        openGraph: {
            images: restaurant.image ? [restaurant.image] : [],
        },
    };
}

export default async function RestaurantPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;
    const { mock } = await searchParams;
    const showMocks = mock === 'true';

    let data = await getRestaurantBySlug(slug);

    // --- MOCK SLUG HANDLING ---
    // If this is a mock slug and no real data, create mock data (dev only)
    if (!data && slug.endsWith('-mock') && process.env.NODE_ENV === 'development') {
        const mockDataMap: Record<string, any> = {
            'paramount-fine-foods-mock': {
                id: 'mock-certified',
                slug: 'paramount-fine-foods-mock',
                name: "✅ Paramount Fine Foods",
                location: { lat: 49.2827, lng: -123.1207 },
                image: '/hero-placeholder.jpg',
                categories: ['Middle Eastern', 'BBQ'],
                rating: 4.9,
                reviews: 2500,
                address: '123 Mock St, Vancouver, BC',
                price: '$$',
                isOpenNow: true,
                googleUrl: 'https://maps.google.com',
                phone: '+1-604-555-1234',
                website: 'https://paramountfinefoods.com',
                openingHours: null,
                halalStatus: 'certified'
            },
            'manouseh-mock': {
                id: 'mock-community',
                slug: 'manouseh-mock',
                name: "👥 Manoush'eh",
                location: { lat: 49.2800, lng: -123.1100 },
                image: '/hero-placeholder.jpg',
                categories: ['Lebanese', 'Bakery'],
                rating: 4.7,
                reviews: 1200,
                address: '456 Mock Ave, Vancouver, BC',
                price: '$$',
                isOpenNow: true,
                googleUrl: 'https://maps.google.com',
                phone: '+1-604-555-5678',
                website: null,
                openingHours: null,
                halalStatus: 'community_listed'
            },
            'earls-kitchen-mock': {
                id: 'mock-verbal',
                slug: 'earls-kitchen-mock',
                name: "💬 Earls Kitchen (Verbal)",
                location: { lat: 49.2750, lng: -123.1300 },
                image: '/hero-placeholder.jpg',
                categories: ['Burgers', 'Steak'],
                rating: 4.3,
                reviews: 800,
                address: '789 Mock Blvd, Vancouver, BC',
                price: '$$$',
                isOpenNow: true,
                googleUrl: 'https://maps.google.com',
                phone: '+1-604-555-9999',
                website: 'https://earls.ca',
                openingHours: null,
                halalStatus: 'verbally_confirmed'
            }
        };
        data = mockDataMap[slug] || null;
    }
    // ---------------------------

    if (!data) {
        notFound();
    }

    // --- MOCK DIETARY INFO INJECTION (Verify Design) ---
    // Trigger based on slug pattern, not showMocks flag (so navigation works)
    let mockDietaryInfo: DietaryInfo | undefined;

    if (slug === 'paramount-fine-foods-mock') {
        // Certified / Strict
        mockDietaryInfo = {
            alcohol: 'none',
            pork: 'none',
            meatSource: 'hand_slaughtered'
        };
    } else if (slug === 'manouseh-mock') {
        // Community / Standard
        mockDietaryInfo = {
            alcohol: 'none',
            pork: 'none',
            meatSource: 'mixed'
        };
    } else if (slug === 'earls-kitchen-mock') {
        // Verbal / Mixed - Shows warnings
        mockDietaryInfo = {
            alcohol: 'served',
            pork: 'kitchen_shared',
            meatSource: 'machine_cut'
        };
    }
    // ----------------------------------------------------

    // Categories helper - guard against empty
    const categories = data.categories.slice(0, 3).join(" • ");

    // Build meta line safely (no orphan dots)
    const metaParts = [data.price, categories].filter(Boolean);
    const metaLine = metaParts.join(" • ");

    // Action availability
    const hasPhone = Boolean(data.phone);
    const hasWebsite = Boolean(data.website);
    const directionsUrl = data.googleUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.name + " " + data.address)}`;

    return (
        <div
            className="min-h-screen bg-bg-base pb-32"
        >

            {/* Absolute Back Button */}
            <Link
                href="/"
                className="fixed top-4 left-4 z-50 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors shadow-lg"
            >
                <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* --- HERO SECTION --- */}
            <div
                className="relative w-full aspect-[2/1] md:aspect-[2.5/1] lg:h-[400px] overflow-hidden"
                style={{ viewTransitionName: `restaurant-hero-${slug}` }}
            >
                <RestaurantImage
                    src={data.image}
                    alt={data.name}
                    seed={data.categories[0] || data.name}
                    priority
                    className="transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            <div className="px-5 -mt-8 relative z-10">
                {/* --- FLOATING HEADER CARD --- */}
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-bold font-manrope text-text-primary leading-tight pr-3">
                            {data.name}
                        </h1>
                        {/* Rating + Review Count */}
                        <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 rounded-lg shrink-0 font-bold text-sm shadow-sm">
                            <span>{data.rating}</span>
                            <Star className="w-3.5 h-3.5 fill-black" />
                            {data.reviews > 0 && (
                                <span className="text-[10px] opacity-70 ml-0.5">({data.reviews})</span>
                            )}
                        </div>
                    </div>

                    {/* Meta Row */}
                    {metaLine && (
                        <div className="text-sm text-text-secondary font-medium mb-2">
                            {metaLine}
                        </div>
                    )}

                    {/* Trust Badge */}
                    <TrustBadge status={data.halalStatus} />
                </div>

                {/* --- ACTIONS GRID (Desktop/Tablet) --- */}
                <div className="hidden md:flex gap-3 mt-6 flex-wrap">
                    {hasPhone && (
                        <a href={`tel:${data.phone}`} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-bold transition-colors">
                            <Phone className="w-4 h-4" /> Call
                        </a>
                    )}
                    {hasWebsite && (
                        <a href={data.website!} target="_blank" className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-bold transition-colors">
                            <Globe className="w-4 h-4" /> Website
                        </a>
                    )}
                    <a href={directionsUrl} target="_blank" className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                        <Navigation className="w-4 h-4" /> Directions
                    </a>
                </div>


                {/* --- INFO SECTIONS (Consistent padding) --- */}
                <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100">

                    {/* Hours - Collapsible */}
                    <HoursDisplay openingHours={data.openingHours} isOpenNow={data.isOpenNow} />

                    {/* Location - Map Preview */}
                    <LocationMap
                        lat={data.location.lat}
                        lng={data.location.lng}
                        name={data.name}
                        address={data.address}
                        googleMapsUrl={directionsUrl}
                        rating={data.rating}
                    />

                    {/* Source Disclaimer */}
                    <SourceDisclaimer variant="detail" />

                    {/* Dietary Details */}
                    {mockDietaryInfo && (
                        <div className="mt-6 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-200">
                            <h3 className="text-lg font-bold font-manrope text-text-primary mb-3">Halal Details</h3>
                            <DietaryFlags info={mockDietaryInfo} />
                        </div>
                    )}

                </div>
            </div>

            {/* --- STICKY ACTION BAR (Mobile) - Removed mystery N icon --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-bg-card/90 backdrop-blur-xl border-t border-border/50 z-40 pb-safe">
                <div className="flex gap-3 justify-center">
                    {hasWebsite && (
                        <a
                            href={data.website!}
                            target="_blank"
                            className="flex-1 max-w-[100px] flex flex-col items-center justify-center gap-1 py-2.5 bg-secondary/50 hover:bg-secondary rounded-xl active:scale-95 transition-all"
                        >
                            <Globe className="w-5 h-5" />
                            <span className="text-[10px] font-bold">Website</span>
                        </a>
                    )}

                    {hasPhone && (
                        <a
                            href={`tel:${data.phone}`}
                            className="flex-1 max-w-[100px] flex flex-col items-center justify-center gap-1 py-2.5 bg-secondary/50 hover:bg-secondary rounded-xl active:scale-95 transition-all"
                        >
                            <Phone className="w-5 h-5" />
                            <span className="text-[10px] font-bold">Call</span>
                        </a>
                    )}

                    <a
                        href={directionsUrl}
                        target="_blank"
                        className="flex-[1.5] max-w-[150px] flex flex-col items-center justify-center gap-1 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-all"
                    >
                        <Navigation className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Directions</span>
                    </a>
                </div>
            </div>

        </div>
    );
}
