import {
    Archive,
    CheckCircle2,
    Clock,
    Store,
    TrendingUp,
} from 'lucide-react';
import type { TenantCounts } from '../../types';

type Props = {
    counts: TenantCounts;
};

export function TenantSummaryCards({ counts }: Props) {
    const activePercentage =
        counts.all > 0 ? Math.round((counts.active / counts.all) * 100) : 0;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Stand */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Stand Mitra
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                        <Store className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.all}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}mitra
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {counts.active} buka
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {counts.inactive} tutup
                    </span>
                </div>
            </div>

            {/* Stand Aktif Buka */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Aktif Buka
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.active}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}stand
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {activePercentage}%
                    </span>
                    <span>tingkat operasional aktif</span>
                </div>
            </div>

            {/* Stand Tutup / Nonaktif */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tutup / Nonaktif
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-600 border border-amber-500/20 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.inactive}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}stand
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Sedang istirahat atau libur berjualan</span>
                </div>
            </div>

            {/* Arsip / Tempat Sampah */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tempat Sampah
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-500/5 text-slate-600 border border-slate-500/20 dark:text-slate-400 group-hover:scale-105 transition-transform">
                        <Archive className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.trashed}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}arsip
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Mitra dinonaktifkan (dapat dipulihkan)</span>
                </div>
            </div>
        </div>
    );
}
