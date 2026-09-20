import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface TenantPageHeaderProps {
    /** Icon displayed in the colored badge */
    icon: LucideIcon;
    /** Badge color variant */
    iconVariant?: 'primary' | 'emerald' | 'amber' | 'rose' | 'violet';
    /** Main page title */
    title: string;
    /** Short description shown below the title */
    description?: string;
    /** Optional badges / status pills shown inline next to the title */
    badges?: ReactNode;
    /** Action controls shown on the right (desktop) or below title (mobile) */
    actions?: ReactNode;
}

const variantMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    amber:   'bg-amber-500/10  text-amber-600  dark:text-amber-400  border-amber-500/20',
    rose:    'bg-rose-500/10   text-rose-600   dark:text-rose-400   border-rose-500/20',
    violet:  'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
};

export function TenantPageHeader({
    icon: Icon,
    iconVariant = 'primary',
    title,
    description,
    badges,
    actions,
}: TenantPageHeaderProps) {
    const iconClass = variantMap[iconVariant] ?? variantMap.primary;

    return (
        <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:pb-5">
            {/* Top row: icon + title + badges */}
            <div className="flex items-start gap-3">
                {/* Icon badge — fixed size, no shrink */}
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconClass}`}>
                    <Icon className="h-4.5 w-4.5" />
                </div>

                {/* Title block */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h1 className="text-lg font-black tracking-tight text-foreground sm:text-xl leading-tight">
                            {title}
                        </h1>
                        {badges && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                {badges}
                            </div>
                        )}
                    </div>

                    {description && (
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Actions row (always below on mobile, can sit beside on lg) */}
            {actions && (
                <div className="flex flex-wrap items-center gap-2 pl-12 sm:pl-12 lg:pl-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
