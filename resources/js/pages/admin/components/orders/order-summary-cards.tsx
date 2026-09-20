import { CreditCard, DollarSign, ReceiptText, TrendingUp, Wallet } from 'lucide-react';
import type { OrderSummary } from '../../types';

type Props = {
    summary: OrderSummary;
};

export function OrderSummaryCards({ summary }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    const cashlessPercentage =
        summary.total_revenue > 0
            ? Math.round((summary.cashless_revenue / summary.total_revenue) * 100)
            : 0;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Pesanan Terfilter */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Volume Transaksi
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                        <ReceiptText className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {summary.total_orders}
                    <span className="text-sm font-normal text-muted-foreground font-sans">
                        {' '}pesanan
                    </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Seluruh transaksi tercatat sesuai filter</span>
                </div>
            </div>

            {/* Total Omset Terbayar */}
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
                    {formatCurrency(summary.total_revenue)}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Lunas
                    </span>
                    <span>pendapatan terverifikasi</span>
                </div>
            </div>

            {/* Omset Cashless Midtrans */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Omset Cashless Midtrans
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-600 border border-indigo-500/20 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                        <CreditCard className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {formatCurrency(summary.cashless_revenue)}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {cashlessPercentage}%
                    </span>
                    <span>dari total pendapatan kantin</span>
                </div>
            </div>

            {/* Omset Tunai Kasir */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Omset Tunai / Kasir Stand
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-600 border border-amber-500/20 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <Wallet className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {formatCurrency(summary.cash_revenue)}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Pembayaran tunai di meja kasir</span>
                </div>
            </div>
        </div>
    );
}
