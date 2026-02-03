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

    // "Detail" variant - now much more subtle
    return (
        <div className={cn(
            'flex items-center gap-2 py-2 px-1 text-zinc-500',
            className
        )}>
            <Info className="w-3.5 h-3.5 shrink-0" />
            <div className="text-[11px] leading-tight">
                <span className="font-medium">Data from public lists & user submissions.</span>{' '}
                <span>Verify status in person.</span>
            </div>
        </div>
    );
}
