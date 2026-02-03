'use client';

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { useRef } from 'react';

interface CategoryFilterProps {
    selected: string;
    onSelect: (category: string) => void;
    showOpenOnly: boolean;
    onToggleOpen: (open: boolean) => void;
    availableCategories: string[];
}

export function CategoryFilter({ selected, onSelect, showOpenOnly, onToggleOpen, availableCategories }: CategoryFilterProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="py-3">
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto overflow-y-hidden no-scrollbar px-4 mask-gradient-right items-center touch-pan-x"
            >
                {/* Open Now Toggle */}
                <button
                    onClick={() => onToggleOpen(!showOpenOnly)}
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

                {availableCategories.map((cat) => {
                    const isSelected = selected === cat || (cat === "All" && selected === "");
                    return (
                        <button
                            key={cat}
                            onClick={() => onSelect(cat === "All" ? "" : cat)}
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
            </div>
        </div >
    );
}
