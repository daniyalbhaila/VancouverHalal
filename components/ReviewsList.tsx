'use client';

import { Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { GoogleReview } from '@/lib/data';


type ReviewsListProps = {
    reviews: GoogleReview[] | undefined;
    googleUrl: string | null;
    layout?: 'horizontal' | 'vertical';
};

export function ReviewsList({ reviews, googleUrl, layout = 'horizontal' }: ReviewsListProps) {
    if (!reviews || reviews.length === 0) return null;

    // Filter out empty text reviews
    const validReviews = reviews.filter(r => r && r.text && r.text.length > 5);
    // Suggest slightly more for vertical list
    const limit = layout === 'vertical' ? 20 : 8;
    const topReviews = validReviews.slice(0, limit);

    if (topReviews.length === 0) return null;

    const Header = () => (
        <div className="flex items-center justify-between px-1 mb-3">
            <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-manrope text-text-primary">
                    Guest Reviews
                </h3>
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-border/50">
                    {/* Google Logo SVG */}
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        alt="Google"
                        className="w-3 h-3"
                    />
                    <span className="text-[10px] font-medium text-text-secondary">Posted on Google</span>
                </div>
            </div>
            {googleUrl && (
                <a
                    href={googleUrl}
                    target="_blank"
                    className="text-xs font-bold text-primary hover:underline"
                >
                    View all
                </a>
            )}
        </div>
    );

    if (layout === 'vertical') {
        return (
            <div className="space-y-4">
                <Header />
                {topReviews.map((review, i) => (
                    <div key={`${review.name}-${i}`} className="w-full">
                        <ReviewCard review={review} fullWidth />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3 py-2">
            <Header />

            {/* Horizontal Carousel */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 -mx-4 px-4 no-scrollbar touch-pan-x">
                {topReviews.map((review, i) => (
                    <div key={`${review.name}-${i}`} className="flex-none w-[85vw] max-w-[320px] snap-center">
                        <ReviewCard review={review} />
                    </div>
                ))}

                {/* View All Card */}
                {googleUrl && (
                    <a
                        href={googleUrl}
                        target="_blank"
                        className="flex-none w-[150px] snap-center flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 border border-border/50 rounded-2xl p-4 text-center cursor-pointer hover:bg-zinc-100 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 border border-border/20">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-text-primary">Read all reviews</span>
                        <span className="text-xs text-text-secondary mt-0.5">on Google Maps</span>
                    </a>
                )}
            </div>
        </div>
    );
}

function ReviewCard({ review, fullWidth = false }: { review: GoogleReview, fullWidth?: boolean }) {
    const text = review.text || "";

    return (
        <div className={cn(
            "p-4 rounded-2xl bg-bg-card border border-border/50 shadow-sm flex flex-col",
            !fullWidth && "h-full"
        )}>
            <div className="flex items-start justify-between mb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-border">
                        {review.reviewerPhotoUrl ? (
                            <Image
                                src={review.reviewerPhotoUrl}
                                alt={review.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                            />
                        ) : (
                            <User className="w-4 h-4 text-text-secondary m-auto" />
                        )}
                    </div>

                    {/* Name & Date */}
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-text-primary leading-none truncate pr-2">
                            {review.name}
                        </p>
                        <p className="text-[10px] text-text-secondary mt-1 flex items-center gap-1">
                            {review.publishAt}
                        </p>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-0.5 bg-zinc-50 dark:bg-zinc-900 border border-border/50 px-1.5 py-0.5 rounded-md shrink-0">
                    <span className="text-xs font-bold text-text-primary">{review.stars}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
            </div>

            {/* Content */}
            <div className={cn(
                "text-sm text-text-secondary leading-relaxed",
                !fullWidth && "line-clamp-4"
            )}>
                {text}
            </div>
        </div>
    );
}
