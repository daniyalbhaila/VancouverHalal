'use client';

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { useRef } from 'react';

// Curated list - top styles only
const CATEGORIES = [
    "All",
    "Burgers",
    "Fried Chicken",
    "Mediterranean",
    "Indian",
    "Pizza",
    "Grill",
    "Cafe",
];

interface CategoryFilterProps {
    selected: string;
    onSelect: (category: string) => void;
    showOpenOnly: boolean;
    onToggleOpen: (open: boolean) => void;
}

export function CategoryFilter({ selected, onSelect, showOpenOnly, onToggleOpen }: CategoryFilterProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="py-3">
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto no-scrollbar px-4 mask-gradient-right items-center"
            >
                {/* Open Now Toggle */}
                <button
                    onClick={() => onToggleOpen(!showOpenOnly)}
                    className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                        showOpenOnly
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-md transform scale-105"
                            : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
                    )}
                >
                    <Clock className="w-3.5 h-3.5" />
                    Open Now
                </button>

                <div className="w-px h-6 bg-zinc-200 shrink-0 mx-1" />

                {CATEGORIES.map((cat) => {
                    const isSelected = selected === cat || (cat === "All" && selected === "");
                    return (
                        <button
                            key={cat}
                            onClick={() => onSelect(cat === "All" ? "" : cat)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                                isSelected
                                    ? "bg-zinc-900 text-white shadow-md transform scale-105"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            )}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
