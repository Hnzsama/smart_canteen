import { Store, Tags, Utensils } from 'lucide-react';
import type { CategoryCounts } from '../../types';

type Props = {
    counts: CategoryCounts;
};

export function CategorySummaryCards({ counts }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total Categories */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Kategori Menu
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <Tags className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.total}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span>Pengelompokan menu di seluruh stand kantin</span>
                </div>
            </div>

            {/* Stand with Categories */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Stand Memiliki Kategori
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-600 border border-blue-500/20 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <Store className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.total_tenants}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span>Mitra stand yang sudah mengatur kategori</span>
                </div>
            </div>

            {/* Total Categorized Menus */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Menu Terkategori
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-600 border border-purple-500/20 dark:text-purple-400 group-hover:scale-105 transition-transform">
                        <Utensils className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.total_menus}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span>Menu makanan & minuman terhubung</span>
                </div>
            </div>
        </div>
    );
}
