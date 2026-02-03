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

export function TrustBadge({ status, variant = 'default', className }: TrustBadgeProps) {
    const config = statusConfig[status] || statusConfig.community_listed;
    const Icon = config.icon;

    if (variant === 'icon-only') {
        return (
            <div className={cn("flex items-center justify-center w-5 h-5 rounded-full shadow-sm backdrop-blur-md", config.bg, config.border, className)} title={config.label}>
                <Icon className={cn("w-3 h-3", config.color)} strokeWidth={3} />
            </div>
        );
    }

    if (variant === 'compact') {
        // Short labels for cards
        const shortLabel = {
            certified: 'Certified',
            community_listed: 'Community Listed',
            verbally_confirmed: 'Verbal Confirmation',
            muslim_owned: 'Muslim Owned',
            unverified: 'Unverified'
        }[status] || 'Listed';

        return (
            <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-md", config.bg, config.border, className)}>
                <Icon className={cn("w-3 h-3", config.color)} strokeWidth={2.5} />
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.color)}>
                    {shortLabel}
                </span>
            </div>
        );
    }

    // Default variant (for detail page)
    return (
        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border", config.bg, config.border, className)}>
            <Icon className={cn("w-4 h-4", config.color)} />
            <span className={cn("text-xs font-semibold", config.color)}>
                {config.label}
            </span>
        </div>
    );
}
