'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { computeIsOpenNow } from '@/lib/hours';

type HoursDisplayProps = {
    openingHours: any | null;
    isOpenNow: boolean;
};

// Parses Google Places API `weekday_text` format
export function HoursDisplay({ openingHours, isOpenNow }: HoursDisplayProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [timeTick, setTimeTick] = useState(0);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setTimeTick((tick) => tick + 1);
        }, 60 * 1000);
        return () => window.clearInterval(interval);
    }, []);

    // Try to extract weekday_text array (Google Places format)
    let weekdayText: string[] = [];

    try {
        if (typeof openingHours === 'string') {
            const parsed = JSON.parse(openingHours);
            weekdayText = parsed?.weekday_text || [];
        } else if (Array.isArray(openingHours?.weekday_text)) {
            weekdayText = openingHours.weekday_text;
        }
    } catch {
        // Fallback if parsing fails
    }

    const hasDetailedHours = weekdayText.length > 0;

    const liveIsOpenNow = useMemo(
        () => computeIsOpenNow(openingHours, isOpenNow),
        [openingHours, isOpenNow, timeTick]
    );

    // Get today's day name (0 = Sunday in JS, but Google starts with Monday)
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1;

    return (
        <div className="bg-bg-card rounded-2xl border border-border/50 overflow-hidden">
            {/* Trigger - Always Visible */}
            <button
                onClick={() => hasDetailedHours && setIsExpanded(!isExpanded)}
                className={cn(
                    "w-full flex items-center justify-between p-4 text-left transition-colors",
                    hasDetailedHours && "hover:bg-bg-subtle cursor-pointer"
                )}
                disabled={!hasDetailedHours}
            >
                <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-text-secondary" />
                    <div>
                        <span className={cn(
                            "text-sm font-bold",
                            liveIsOpenNow ? "text-emerald-600" : "text-red-500"
                        )}>
                            {liveIsOpenNow ? "Open Now" : "Closed"}
                        </span>
                        {hasDetailedHours && weekdayText[todayIndex] && (
                            <span className="text-xs text-text-secondary ml-2">
                                • {weekdayText[todayIndex].split(': ')[1]}
                            </span>
                        )}
                    </div>
                </div>

                {hasDetailedHours && (
                    <ChevronDown className={cn(
                        "w-5 h-5 text-text-secondary transition-transform duration-200",
                        isExpanded && "rotate-180"
                    )} />
                )}
            </button>

            {/* Expandable Content */}
            {hasDetailedHours && isExpanded && (
                <ul className="divide-y divide-border/30 border-t border-border/30 animate-in slide-in-from-top-2 duration-200">
                    {weekdayText.map((line, index) => {
                        const isToday = index === todayIndex;
                        const [day, hours] = line.split(': ');

                        return (
                            <li
                                key={day}
                                className={cn(
                                    "flex justify-between items-center px-4 py-2.5 text-sm",
                                    isToday && "bg-primary/5 font-bold"
                                )}
                            >
                                <span className={isToday ? 'text-primary' : 'text-text-primary'}>
                                    {day}
                                    {isToday && <span className="ml-1.5 text-[10px] uppercase font-bold text-primary/70">(Today)</span>}
                                </span>
                                <span className={hours?.toLowerCase().includes('closed') ? 'text-red-500' : 'text-text-secondary'}>
                                    {hours || 'N/A'}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Fallback if no detailed hours */}
            {!hasDetailedHours && !isExpanded && (
                <p className="px-4 pb-4 text-text-secondary text-xs italic">
                    Detailed hours not available.
                </p>
            )}
        </div>
    );
}
