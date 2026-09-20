import { DollarSign, ReceiptText, Store, TrendingUp, Users } from 'lucide-react';
import type { DashboardMetricData } from '../../types';

type Props = {
    metrics: DashboardMetricData;
};

export function DashboardMetricCards({ metrics }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Omset Terbayar
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {formatCurrency(metrics.total_revenue)}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                        {metrics.paid_orders} pesanan
                    </span>
                    <span>lunas terverifikasi</span>
                </div>
            </div>

            {/* Total Volume Orders */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Volume Pesanan
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-600 border border-blue-500/20 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <ReceiptText className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {metrics.total_orders}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground truncate">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{metrics.status_counts.completed}</span> selesai •{' '}
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{metrics.status_counts.processing}</span> proses •{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{metrics.status_counts.ready}</span> siap
                </div>
            </div>

            {/* Active Tenants */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Stand Kantin Aktif
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-600 border border-amber-500/20 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <Store className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {metrics.active_tenants}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}/ {metrics.total_tenants} stand
                    </span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span>Mitra penjual aktif melayani pesanan</span>
                </div>
            </div>

            {/* Users Registered */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Pengguna Terdaftar
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-600 border border-purple-500/20 dark:text-purple-400 group-hover:scale-105 transition-transform">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {metrics.total_students + metrics.total_tenant_users}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground truncate">
                    <span className="font-semibold text-foreground">{metrics.total_students}</span> mahasiswa •{' '}
                    <span className="font-semibold text-foreground">{metrics.total_tenant_users}</span> pengelola
                </div>
            </div>
        </div>
    );
}
