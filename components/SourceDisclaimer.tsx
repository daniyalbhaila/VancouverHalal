import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourceDisclaimerProps {
    variant?: 'detail' | 'footer';
    className?: string;
    status?: string | null;
}

export function SourceDisclaimer({ variant = 'detail', className, status }: SourceDisclaimerProps) {
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
                {status === 'certified' ? (
                    <>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">Verified by HIC Canada.</span>{' '}
                        <span>Cross check{' '}
                            <a
                                href="https://hiccanada.ca/certified/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-zinc-400 hover:text-emerald-600 transition-colors"
                            >
                                official list
                            </a>.
                        </span>
                    </>
                ) : (
                    <>
                        <span className="font-medium">Data from public lists & user submissions.</span>{' '}
                        <span>Verify status in person.</span>
                    </>
                )}
            </div>
        </div>
    );
}
