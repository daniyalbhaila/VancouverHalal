import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("relative overflow-hidden rounded-md bg-zinc-200/50 dark:bg-zinc-800/50", className)}
            {...props}
        >
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
        </div>
    )
}

export { Skeleton }
