import { ChefHat, Clock, Receipt, ShoppingBag } from 'lucide-react';

type Props = {
    counts: {
        total: number;
        pending: number;
        processing: number;
        ready: number;
        completed: number;
    };
    activeTab?: string;
    onTabChange?: (tab: string) => void;
};

export function TenantOrderSummaryCards({ counts, activeTab = 'all', onTabChange }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Pesanan */}
            <div
                onClick={() => onTabChange?.('all')}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    activeTab === 'all'
                        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/50'
                        : 'border-border/70 bg-card hover:border-blue-500/40'
                }`}
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Antrean Dapur
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-600 border border-blue-500/20 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <Receipt className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.total}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span>Semua status pesanan masuk hari ini</span>
                </div>
            </div>

            {/* Menunggu Konfirmasi */}
            <div
                onClick={() => onTabChange?.('pending')}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    activeTab === 'pending'
                        ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500'
                        : 'border-border/70 bg-card hover:border-amber-500/40'
                }`}
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Menunggu Konfirmasi
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-600 border border-amber-500/20 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <Clock className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.pending}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-amber-600 dark:text-amber-400">Butuh respons masak kasir</span>
                </div>
            </div>

            {/* Sedang Dimasak */}
            <div
                onClick={() => onTabChange?.('processing')}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    activeTab === 'processing'
                        ? 'border-orange-500 bg-orange-500/5 ring-1 ring-orange-500'
                        : 'border-border/70 bg-card hover:border-orange-500/40'
                }`}
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Sedang Dimasak
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-orange-600 border border-orange-500/20 dark:text-orange-400 group-hover:scale-105 transition-transform">
                        <ChefHat className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.processing}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-orange-600 dark:text-orange-400">Proses penyiapan di dapur</span>
                </div>
            </div>

            {/* Siap Diambil */}
            <div
                onClick={() => onTabChange?.('ready')}
                className={`group relative cursor-pointer overflow-hidden rounded-xl border p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    activeTab === 'ready'
                        ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                        : 'border-border/70 bg-card hover:border-emerald-500/40'
                }`}
            >
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Siap Diambil
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.ready}
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Menunggu pickup di meja stand</span>
                </div>
            </div>
        </div>
    );
}
