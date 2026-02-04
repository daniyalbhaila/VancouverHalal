import { getRestaurantBySlug, getAllRestaurantSlugs } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Globe, Phone, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from 'next';
import { RestaurantImage } from "@/components/RestaurantImage";
// import { HoursDisplay } from "@/components/HoursDisplay"; // Moved to Tabs
// import { LocationMap } from "@/components/LocationMap"; // Moved to Tabs
import { TrustBadge } from "@/components/TrustBadge";
import { SourceDisclaimer } from "@/components/SourceDisclaimer";
import { DietaryFlags, type DietaryInfo } from "@/components/DietaryFlags"; // Mock usage passed
import { ScrollReset } from "@/components/ScrollReset";
import { ImageGallery } from "@/components/ImageGallery";
// import { ReviewsList } from "@/components/ReviewsList"; // Moved to Tabs
import { RestaurantContentTabs } from "@/components/RestaurantContentTabs";
import { RestaurantActions } from "@/components/RestaurantActions";

// --- ISR Configuration ---
// Revalidate this page every hour (3600 seconds)
export const revalidate = 3600;

// --- Static Params Generation ---
// This tells Next.js which slugs to pre-build at build time
export async function generateStaticParams() {
    const slugs = await getAllRestaurantSlugs();
    return slugs.map((s) => ({
        slug: s.slug,
    }));
}

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const restaurant = await getRestaurantBySlug(slug);

    if (!restaurant) {
        return {
            title: 'Restaurant Not Found | Halal Maps',
        };
    }

    const title = `${restaurant.name} - Halal Restaurants in Vancouver | Halal Maps`;
    const description = `Halal dining guide for ${restaurant.name} in Vancouver. View hours, menu recommendations, and verified halal status on Halal Maps.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: restaurant.image ? [restaurant.image] : [],
        }
    };
}

export default async function RestaurantPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ mock?: string }>;
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

    if (slug === 'paramount-fine-foods-mock' || data.dietaryInfo) {
        // ... (Logic preserved directly or via data flow)
    }

    // For now, let's keep the mock logic simple or rely on data if I added it to data.ts
    // I didn't add dietaryInfo to data fetching yet, so keeping the hardcoded mock check for safety if needed
    // But for real data, I'll ignore mocks unless 'mock' param

    // ... (Old code Logic) ...
    // To match original behavior for mocks:
    if (slug === 'paramount-fine-foods-mock') {
        mockDietaryInfo = { alcohol: 'none', pork: 'none', meatSource: 'hand_slaughtered' };
    } else if (slug === 'manouseh-mock') {
        mockDietaryInfo = { alcohol: 'none', pork: 'none', meatSource: 'mixed' };
    } else if (slug === 'earls-kitchen-mock') {
        mockDietaryInfo = { alcohol: 'served', pork: 'kitchen_shared', meatSource: 'machine_cut' };
    }
    // ----------------------------------------------------

    // Categories helper - guard against empty
    const categories = data.categories.slice(0, 3).join(" • ");

    // Build meta line safely (no orphan dots)
    const metaParts = [data.price, categories].filter(Boolean);
    const metaLine = metaParts.join(" • ");

    // Action availability
    // Prefer Google Data formatted phone/website if available?
    const phone = data.googleData?.formatted_phone_number || data.phone;
    const website = data.googleData?.website || data.website;
    const hasPhone = Boolean(phone);
    const hasWebsite = Boolean(website);
    const directionsUrl = data.googleUrl || data.googleData?.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.name + " " + data.address)}`;

    // Prepare Gallery Images
    // 1. googleData.images (objects) -> url
    // 2. googleData.imageUrls (strings) -> url
    // 3. Fallback to data.image
    let galleryImages: string[] = [];
    if (data.googleData?.images && Array.isArray(data.googleData.images)) {
        galleryImages = data.googleData.images.map(img => img.url);
    } else if (data.googleData?.imageUrls && Array.isArray(data.googleData.imageUrls)) {
        galleryImages = data.googleData.imageUrls;
    }
    // Add main image to front if not already present? 
    // Or just use main image if gallery empty.
    if (galleryImages.length === 0 && data.image) {
        galleryImages = [data.image];
    } else if (data.image && !galleryImages.includes(data.image) && galleryImages.length < 5) {
        // Maybe unshift main image? Often main image is best.
        galleryImages.unshift(data.image);
    }

    // Prepare Opening Hours (Prefer Standard Column, fallback to Google Data)
    const openingHours = data.openingHours || data.googleData?.openingHours;

    return (
        <div
            className="min-h-screen bg-bg-base poub-32"
        >
            <ScrollReset />

            {/* Absolute Back Button */}
            <Link
                href="/"
                className="fixed top-4 left-4 z-50 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors shadow-lg"
            >
                <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* --- HERO SECTION (Gallery) --- */}
            <div
                className="relative w-full aspect-[4/3] md:aspect-[2.5/1] lg:h-[450px] overflow-hidden bg-zinc-900"
                style={{ viewTransitionName: `restaurant-hero-${slug}` }}
            >
                <ImageGallery
                    images={galleryImages}
                    alt={data.name}
                    className="w-full h-full"
                />

                {/* Gradient for text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none md:hidden" />
            </div>

            <div className="px-5 -mt-8 relative z-10 pb-32">
                {/* --- FLOATING HEADER CARD --- */}
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-bold font-manrope text-text-primary leading-tight pr-3">
                            {data.name}
                        </h1>
                        {/* Rating + Review Count */}
                        <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-1 rounded-lg shrink-0 font-bold text-sm shadow-sm">
                            <span>{data.rating || data.googleData?.rating || 'N/A'}</span>
                            <Star className="w-3.5 h-3.5 fill-black" />
                            {(data.reviews > 0 || (data.googleData?.user_ratings_total || 0) > 0) && (
                                <span className="text-[10px] opacity-70 ml-0.5">
                                    ({data.googleData?.user_ratings_total || data.reviews})
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Meta Row */}
                    {metaLine && (
                        <div className="text-sm text-text-secondary font-medium mb-3">
                            {metaLine}
                        </div>
                    )}

                </div>

                {/* --- ACTIONS GRID (Desktop/Tablet) --- */}
                <RestaurantActions
                    phone={phone}
                    website={website}
                    directionsUrl={directionsUrl}
                    variant="desktop"
                    restaurantName={data.name}
                    restaurantId={data.id}
                />

                {/* --- TABBED CONTENT --- */}
                <RestaurantContentTabs
                    openingHours={openingHours}
                    isOpenNow={data.isOpenNow}
                    location={data.location}
                    name={data.name}
                    slug={data.slug}
                    address={data.googleData?.formatted_address || data.address}
                    googleUrl={directionsUrl}
                    rating={data.rating}
                    reviews={data.googleData?.reviews}
                    mockDietaryInfo={mockDietaryInfo}
                    halalStatus={data.halalStatus}
                />

            </div>

            {/* --- STICKY ACTION BAR (Mobile) --- */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-bg-card/90 backdrop-blur-xl border-t border-border/50 z-40 pb-safe">
                <RestaurantActions
                    phone={phone}
                    website={website}
                    directionsUrl={directionsUrl}
                    variant="mobile"
                    restaurantName={data.name}
                    restaurantId={data.id}
                />
            </div>

        </div>
    );
}
