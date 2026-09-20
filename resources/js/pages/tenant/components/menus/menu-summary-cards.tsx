import { AlertCircle, CheckCircle2, Star, Trash2, UtensilsCrossed } from 'lucide-react';

type Props = {
    counts: {
        all: number;
        available: number;
        unavailable: number;
        recommended?: number;
        trashed: number;
    };
};

export function MenuSummaryCards({ counts }: Props) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {/* Total Menu */}
            <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Katalog
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                        <UtensilsCrossed className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.all}
                    <span className="text-sm font-normal text-muted-foreground font-sans"> menu</span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    Semua menu terdaftar di stand
                </div>
            </div>

            {/* Menu Tersedia (In Stock) */}
            <div className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Ready Stock
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.available}
                    <span className="text-sm font-normal text-emerald-600 dark:text-emerald-400 font-sans"> aktif</span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    Dapat dipesan mahasiswa
                </div>
            </div>

            {/* Best Seller / Rekomendasi */}
            <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Best Seller ⭐
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/30 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <Star className="h-5 w-5 fill-amber-500" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.recommended ?? 0}
                    <span className="text-sm font-normal text-amber-600 dark:text-amber-400 font-sans"> favorit</span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    Tampil badge Best Seller GoFood
                </div>
            </div>

            {/* Menu Habis (Out of Stock) */}
            <div className="group relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Stok Habis
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 border border-amber-500/30 dark:text-amber-400 group-hover:scale-105 transition-transform">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.unavailable}
                    <span className="text-sm font-normal text-amber-600 dark:text-amber-400 font-sans"> habis</span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    Sembunyi sementara
                </div>
            </div>

            {/* Sampah (Soft Deleted) */}
            <div className="group relative overflow-hidden rounded-xl border border-rose-500/30 bg-rose-500/5 p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Trash (Sampah)
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 border border-rose-500/30 dark:text-rose-400 group-hover:scale-105 transition-transform">
                        <Trash2 className="h-5 w-5" />
                    </div>
                </div>
                <div className="mt-3 text-2xl font-black tracking-tight text-foreground font-mono">
                    {counts.trashed}
                    <span className="text-sm font-normal text-rose-600 dark:text-rose-400 font-sans"> terhapus</span>
                </div>
                <div className="mt-1.5 text-xs text-muted-foreground">
                    Dapat dipulihkan
                </div>
            </div>
        </div>
    );
}
