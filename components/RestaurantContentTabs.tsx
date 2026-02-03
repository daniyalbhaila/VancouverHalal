'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { HoursDisplay } from './HoursDisplay';
import { LocationMap } from './LocationMap';
import { SourceDisclaimer } from './SourceDisclaimer';
import { ReviewsList } from './ReviewsList';
import { GoogleReview } from '@/lib/data';
import { Info, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { DietaryFlags, DietaryInfo } from './DietaryFlags';
import { TrustBadge, HalalStatus } from './TrustBadge';

type RestaurantContentTabsProps = {
    openingHours: any;
    isOpenNow: boolean;
    location: { lat: number, lng: number };
    name: string;
    slug: string;
    address: string;
    googleUrl: string;
    rating?: number;
    reviews?: GoogleReview[];
    mockDietaryInfo?: DietaryInfo;
    halalStatus: HalalStatus;
};

export function RestaurantContentTabs(props: RestaurantContentTabsProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

    return (
        <div className="mt-6 min-h-[500px]">
            {/* --- TAB HEADER --- */}
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6 shadow-inner relative z-10 w-full max-w-sm mx-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300",
                        activeTab === 'overview'
                            ? "bg-white dark:bg-zinc-700 text-text-primary shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                    )}
                >
                    <Info className="w-4 h-4" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-300",
                        activeTab === 'reviews'
                            ? "bg-white dark:bg-zinc-700 text-text-primary shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                    )}
                >
                    <MessageSquare className="w-4 h-4" />
                    Reviews
                </button>
            </div>

            <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                <span>Not halal or something off?</span>
                <Link
                    href={`/report?name=${encodeURIComponent(props.name)}&slug=${encodeURIComponent(props.slug)}`}
                    className="font-semibold text-text-primary hover:underline"
                >
                    Report
                </Link>
            </div>

            {/* --- TAB CONTENT --- */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'overview' ? (
                    <div className="space-y-6">
                        {/* Trust Verification Section */}
                        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-border/50">
                            <div className="flex items-center justify-between">
                                <TrustBadge status={props.halalStatus} />
                            </div>
                            <SourceDisclaimer className="pl-1" status={props.halalStatus} />
                        </div>

                        {/* Hours */}
                        <HoursDisplay openingHours={props.openingHours} isOpenNow={props.isOpenNow} />

                        {/* Location */}
                        <LocationMap
                            lat={props.location.lat}
                            lng={props.location.lng}
                            name={props.name}
                            address={props.address}
                            googleMapsUrl={props.googleUrl}
                            rating={props.rating || 0}
                        />


                        {/* Dietary Details */}
                        {props.mockDietaryInfo && (
                            <div className="mt-6">
                                <h3 className="text-lg font-bold font-manrope text-text-primary mb-3">Halal Details</h3>
                                <DietaryFlags info={props.mockDietaryInfo} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">


                        <ReviewsList
                            reviews={props.reviews}
                            googleUrl={props.googleUrl}
                            layout="vertical"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
