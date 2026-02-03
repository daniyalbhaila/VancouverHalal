import { Ban, Wine, AlertTriangle, CheckCircle2, Beef, Factory } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DietaryInfo {
    alcohol: 'none' | 'served' | 'bar_separated';
    pork: 'none' | 'served' | 'kitchen_shared';
    meatSource: 'hand_slaughtered' | 'machine_cut' | 'mixed' | 'unverified';
}

export function DietaryFlags({ info, className }: { info: DietaryInfo; className?: string }) {
    return (
        <div className={cn("grid grid-cols-1 gap-3", className)}>
            {/* Alcohol Status */}
            <div className={cn("flex items-start gap-3 p-3 rounded-xl border",
                info.alcohol === 'none' ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800" :
                    "bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800"
            )}>
                {info.alcohol === 'none' ? (
                    <Ban className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                    <Wine className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                    <h4 className={cn("text-sm font-bold mb-0.5",
                        info.alcohol === 'none' ? "text-emerald-900 dark:text-emerald-200" : "text-amber-900 dark:text-amber-200"
                    )}>
                        {info.alcohol === 'none' ? "Alcohol Free Environment" : "Alcohol Served on Premises"}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {info.alcohol === 'none'
                            ? "This establishment does not serve alcohol."
                            : "Alcohol is available here. Dining area may be shared."}
                    </p>
                </div>
            </div>

            {/* Pork Status */}
            <div className={cn("flex items-start gap-3 p-3 rounded-xl border",
                info.pork === 'none' ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800" :
                    "bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-800"
            )}>
                {info.pork === 'none' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                    <h4 className={cn("text-sm font-bold mb-0.5",
                        info.pork === 'none' ? "text-emerald-900 dark:text-emerald-200" : "text-red-900 dark:text-red-200"
                    )}>
                        {info.pork === 'none' ? "No Pork on Menu" : "Pork Served in Kitchen"}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {info.pork === 'none'
                            ? "Menu is completely pork-free."
                            : "Cross-contamination risk exists. Please inform staff."}
                    </p>
                </div>
            </div>

            {/* Meat Source Status (Optional / Neutral) */}
            <div className="flex items-start gap-3 p-3 rounded-xl border bg-zinc-50/50 border-zinc-100 dark:bg-zinc-800/30 dark:border-zinc-700">
                <Beef className="w-5 h-5 text-zinc-500 dark:text-zinc-300 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mb-0.5">
                        {info.meatSource === 'hand_slaughtered' ? 'Hand-Slaughtered (Zabihah)' :
                            info.meatSource === 'machine_cut' ? 'Machine Cut' : 'Meat Source Unverified'}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {info.meatSource === 'hand_slaughtered' ? 'Verified hand-slaughtered meat supply.' :
                            info.meatSource === 'machine_cut' ? 'Standard machine-slaughtered halal meat.' :
                                'Specific slaughter method not confirmed.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
