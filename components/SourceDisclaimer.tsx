import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourceDisclaimerProps {
    variant?: 'detail' | 'footer';
    className?: string;
}

export function SourceDisclaimer({ variant = 'detail', className }: SourceDisclaimerProps) {
    if (variant === 'footer') {
        return (
            <p className={cn('text-xs text-zinc-400 text-center', className)}>
                Data sourced from public halal lists
            </p>
        );
    }

    return (
        <div
            className={cn(
                'flex items-start gap-2.5 p-3 bg-amber-50/80 border border-amber-200/50 rounded-xl',
                className
            )}
        >
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
                <span className="font-medium">Data sourced from public lists.</span>{' '}
                <span className="text-amber-700">Please verify halal status before dining.</span>
            </div>
        </div>
    );
}
