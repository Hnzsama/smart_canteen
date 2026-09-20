import { Trophy, Utensils } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { TopSellingMenuItem } from '../../types';

type Props = {
    topSellingMenus?: TopSellingMenuItem[];
};

const formatRupiah = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(val);

export function TenantTopMenusChart({ topSellingMenus = [] }: Props) {
    const maxSold = topSellingMenus.length > 0 ? Math.max(...topSellingMenus.map((m) => m.total_sold)) : 1;

    return (
        <Card className="shadow-xs border-border/70 bg-card">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            <span>Menu Terlaris Stand (Top Selling)</span>
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            Peringkat menu favorit mahasiswa yang paling banyak dipesan minggu ini.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {topSellingMenus.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <Utensils className="h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm font-medium">Belum ada data penjualan menu</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topSellingMenus.map((menu, index) => {
                            const percentage = Math.round((menu.total_sold / maxSold) * 100);
                            return (
                                <div key={menu.name} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                                                    index === 0
                                                        ? 'bg-amber-500 text-white'
                                                        : index === 1
                                                        ? 'bg-slate-300 text-slate-800'
                                                        : index === 2
                                                        ? 'bg-amber-700 text-white'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {index + 1}
                                            </span>
                                            <span className="font-semibold text-foreground">{menu.name}</span>
                                            {menu.category && (
                                                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-normal">
                                                    {menu.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground font-mono text-xs">
                                                {menu.total_sold} porsi
                                            </span>
                                            <span className="font-mono font-bold text-foreground">
                                                {formatRupiah(menu.revenue)}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Progress indicator */}
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                index === 0
                                                    ? 'bg-primary'
                                                    : index === 1
                                                    ? 'bg-emerald-500'
                                                    : 'bg-amber-500'
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
