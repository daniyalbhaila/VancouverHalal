import { getRestaurantById } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Globe, Phone, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from 'next';
import { RestaurantImage } from "@/components/RestaurantImage";
import { HoursDisplay } from "@/components/HoursDisplay";

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const restaurant = await getRestaurantById(id);

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

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getRestaurantById(id);

    if (!data) {
        notFound();
    }

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
        <div className="min-h-screen bg-bg-base pb-32 animate-in fade-in duration-300">

            {/* Absolute Back Button */}
            <Link
                href="/"
                className="fixed top-4 left-4 z-50 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors shadow-lg"
            >
                <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* --- HERO SECTION --- */}
            <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1] lg:h-[400px] overflow-hidden">
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
                        <div className="text-sm text-text-secondary font-medium">
                            {metaLine}
                        </div>
                    )}
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

                    {/* Location - Glass Effect to match */}
                    <div className="bg-bg-card rounded-2xl border border-border/50 overflow-hidden">
                        <div className="flex items-center gap-3 p-4">
                            <MapPin className="w-5 h-5 text-text-secondary shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-text-primary font-medium truncate">{data.address}</p>
                                <a
                                    href={directionsUrl}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline mt-1"
                                >
                                    View on Google Maps <ArrowLeft className="w-3 h-3 rotate-180" />
                                </a>
                            </div>
                        </div>
                    </div>

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
