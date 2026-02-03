'use client';

import { ShieldCheck, Users, MessageCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type HalalStatus = 'community_listed' | 'certified' | 'verbally_confirmed' | 'muslim_owned' | 'unverified';

interface TrustBadgeProps {
    status: HalalStatus;
    variant?: 'default' | 'compact' | 'icon-only'; // Added icon-only for the card view
    className?: string;
}

const statusConfig = {
    certified: {
        icon: ShieldCheck,
        label: 'Certified Halal',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        border: 'border-emerald-200 dark:border-emerald-800'
    },
    muslim_owned: { // Keeping for backward compat, treating as high trust/community
        icon: Users,
        label: 'Muslim Owned',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800'
    },
    community_listed: {
        icon: Users,
        label: 'Community Listed',
        color: 'text-zinc-600 dark:text-zinc-400',
        bg: 'bg-zinc-100 dark:bg-zinc-800',
        border: 'border-zinc-200 dark:border-zinc-700'
    },
    verbally_confirmed: {
        icon: MessageCircle,
        label: 'Verbally Confirmed',
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-800'
    },
    unverified: {
        icon: HelpCircle,
        label: 'Unverified',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-800'
    }
};

const statusDescriptions = {
    certified: "Verified by HIC Canada. Click to confirm.",
    muslim_owned: "Owned by Muslims. Generally considered reliable.",
    community_listed: "Sourced from public lists and user submissions. Verify accordingly.",
    verbally_confirmed: "Staff confirmed Halal status. We recommend verifying yourself.",
    unverified: "Halal status is unverified. Use caution."
};

export function TrustBadge({ status, variant = 'default', className }: TrustBadgeProps) {
    const config = statusConfig[status] || statusConfig.community_listed;
    const Icon = config.icon;
    const isCertified = status === 'certified';
    const description = statusDescriptions[status] || statusDescriptions.community_listed;

    // Common Inner Content
    const Content = (
        <>
            <Icon className={cn(variant === 'icon-only' ? "w-3 h-3" : "w-3 h-3 sm:w-4 sm:h-4", config.color)} strokeWidth={variant === 'compact' ? 2.5 : 2} />
            {variant !== 'icon-only' && (
                <span className={cn(
                    config.color,
                    variant === 'compact' ? "text-[10px] font-bold uppercase tracking-wider" : "text-xs font-semibold"
                )}>
                    {variant === 'compact' ?
                        (status === 'community_listed' ? 'Listed' : config.label.replace('Halal', '').trim())
                        : config.label}
                </span>
            )}
        </>
    );

    const containerClasses = cn(
        "flex items-center rounded-full shadow-sm backdrop-blur-md transition-transform active:scale-95",
        config.bg,
        config.border,
        variant === 'icon-only' ? "justify-center w-5 h-5 border" : (variant === 'compact' ? "gap-1 px-2 py-0.5 border" : "gap-1.5 px-3 py-1 border"),
        isCertified && variant !== 'icon-only' ? "cursor-pointer hover:brightness-95" : "",
        className
    );

    if (isCertified) {
        return (
            <a
                href="https://hiccanada.ca/certified/"
                target="_blank"
                rel="noopener noreferrer"
                className={containerClasses}
                title={description}
                onClick={(e) => e.stopPropagation()} // Prevent card click
            >
                {Content}
            </a>
        );
    }

    return (
        <div className={containerClasses} title={description}>
            {Content}
        </div>
    );
}
