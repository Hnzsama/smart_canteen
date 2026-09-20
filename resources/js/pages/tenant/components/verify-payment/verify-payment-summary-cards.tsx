import { CheckCircle2, QrCode, Wallet } from 'lucide-react';

type Props = {
    counts: {
        unpaid_count: number;
        unpaid_amount: number;
        verified_today_count: number;
        verified_today_amount: number;
    };
};

const formatCurrency = (val: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(val);

export function VerifyPaymentSummaryCards({ counts }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pesanan Tunai Belum Bayar */}
            <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Belum Dibayar (Kasir Tunai)
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/30 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <Wallet className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-tight text-foreground font-mono">
                        {counts.unpaid_count}
                    </span>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 font-mono">
                        ({formatCurrency(counts.unpaid_amount)})
                    </span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    Menunggu verifikasi fisik & penerimaan uang kasir
                </div>
            </div>

            {/* Terverifikasi Hari Ini */}
            <div className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Terverifikasi Tunai Hari Ini
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-tight text-foreground font-mono">
                        {counts.verified_today_count}
                    </span>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        ({formatCurrency(counts.verified_today_amount)})
                    </span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    Total fisik uang kasir diterima hari ini
                </div>
            </div>

            {/* Scanner & Input Cepat Info Card */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hidden sm:block">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Metode Verifikasi QR & Kode
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                        <QrCode className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-sm font-bold text-foreground">
                    Scan Kamera HP / Ketik Kode Pickup
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                    Mahasiswa menunjukkan QR Pass HP (cth: FEB-9912) untuk verifikasi kilat di kasir.
                </div>
            </div>
        </div>
    );
}
