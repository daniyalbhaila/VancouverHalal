import { cn } from '@/lib/utils';
import { Clock, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useRef, useState } from 'react';
import posthog from 'posthog-js';

interface CategoryFilterProps {
    selected: string;
    onSelect: (category: string) => void;
    showOpenOnly: boolean;
    onToggleOpen: (open: boolean) => void;
    showCertifiedOnly: boolean;
    onToggleCertified: (active: boolean) => void;
    availableCategories: string[];
}

export function CategoryFilter({
    selected,
    onSelect,
    showOpenOnly,
    onToggleOpen,
    showCertifiedOnly,
    onToggleCertified,
    availableCategories
}: CategoryFilterProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Limit visible categories unless expanded
    const VISIBLE_LIMIT = 12;
    // Always include "All" + top 11, OR all.
    // "All" is index 0.
    const visibleCategories = isExpanded
        ? availableCategories
        : availableCategories.slice(0, VISIBLE_LIMIT + 1); // +1 because "All" is included

    const hasHidden = availableCategories.length > VISIBLE_LIMIT + 1;

    const handleCategorySelect = (category: string) => {
        const newValue = category === "All" ? "" : category;
        onSelect(newValue);
        posthog.capture('filter_category_changed', { category: newValue || 'All' });
    };

    const handleOpenToggle = () => {
        const newState = !showOpenOnly;
        onToggleOpen(newState);
        posthog.capture('filter_open_now_toggled', { active: newState });
    };

    const handleCertifiedToggle = () => {
        const newState = !showCertifiedOnly;
        onToggleCertified(newState);
        posthog.capture('filter_certified_toggled', { active: newState });
    };

    return (
        <div className="py-3">
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto overflow-y-hidden no-scrollbar px-4 mask-gradient-right items-center touch-pan-x"
            >
                {/* Certified Toggle - Primary Filter */}
                <button
                    onClick={handleCertifiedToggle}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                        showCertifiedOnly
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105"
                            : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--glass-border)] hover:bg-[var(--glass-bg)]"
                    )}
                >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Certified Only
                </button>

                {/* Open Now Toggle */}
                <button
                    onClick={handleOpenToggle}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                        showOpenOnly
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-md transform scale-105"
                            : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--glass-border)] hover:bg-[var(--glass-bg)]"
                    )}
                >
                    <Clock className="w-3.5 h-3.5" />
                    Open Now
                </button>

                <div className="w-px h-6 bg-[var(--glass-border)] shrink-0 mx-1" />

                {visibleCategories.map((cat) => {
                    const isSelected = selected === cat || (cat === "All" && selected === "");
                    return (
                        <button
                            key={cat}
                            onClick={() => handleCategorySelect(cat)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                                isSelected
                                    ? "bg-[var(--text-primary)] text-[var(--bg-base)] shadow-md transform scale-105"
                                    : "bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--glass-border)]"
                            )}
                        >
                            {cat}
                        </button>
                    );
                })}

                {/* Show More / Less Toggle */}
                {hasHidden && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--glass-border)] flex items-center gap-1"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-3 h-3" />
                                Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3 h-3" />
                                More
                            </>
                        )}
                    </button>
                )}
            </div>
        </div >
    );
}
