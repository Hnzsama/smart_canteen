import { Clock, DollarSign, PackageCheck, UtensilsCrossed } from 'lucide-react';
import type { TenantDashboardMetricData } from '../../types';

type Props = {
    metrics: TenantDashboardMetricData;
};

export function TenantMetricCards({ metrics }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Omset Hari Ini */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Omset Terbayar Hari Ini
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {formatCurrency(metrics.today_revenue)}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {metrics.completed_today} pesanan
                    </span>
                    <span>selesai transaksi</span>
                </div>
            </div>

            {/* Pesanan Perlu Diproses */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Perlu Diproses
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-600 border border-amber-500/20 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {metrics.pending_orders + metrics.processing_orders}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground truncate">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {metrics.pending_orders} pending
                    </span>{' '}
                    •{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {metrics.processing_orders} dimasak
                    </span>
                </div>
            </div>

            {/* Siap Diambil */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Siap Diambil
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-600 border border-blue-500/20 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <PackageCheck className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {metrics.ready_orders}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span>Menunggu pickup di meja stand</span>
                </div>
            </div>

            {/* Menu Aktif & Stand Status */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Katalog & Status Stand
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-600 border border-purple-500/20 dark:text-purple-400 group-hover:scale-105 transition-transform">
                        <UtensilsCrossed className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {metrics.active_menu_count}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}/ {metrics.total_menu_count} menu
                    </span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                        {metrics.is_stand_active ? 'Stand Buka Melayani' : 'Stand Tutup Sementara'}
                    </span>
                </div>
            </div>
        </div>
    );
}
