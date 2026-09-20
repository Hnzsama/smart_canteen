import { Head } from '@inertiajs/react';
import { MessageSquare, Star, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TenantPageHeader } from './components/tenant-page-header';

type RatingItem = {
    id: number;
    user_name: string;
    order_number: string;
    rating: number;
    comment: string | null;
    created_at: string;
};

type Props = {
    ratings?: RatingItem[];
    stats?: {
        average: number;
        total_reviews: number;
        breakdown: Record<number, number>;
    };
};

export default function TenantRatings({
    ratings = [],
    stats = {
        average: 5.0,
        total_reviews: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
}: Props) {
    return (
        <>
            <Head title="Ulasan & Rating Stand - Smart Canteen FEB" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 w-full">
                <TenantPageHeader
                    icon={Star}
                    iconVariant="amber"
                    title="Rating & Ulasan Pembeli"
                    description="Pantau kepuasan mahasiswa dan ulasan bintang untuk kualitas stand Anda."
                />

                {/* Rating Breakdown & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Left: Overall Score Card (4 cols) */}
                    <div className="md:col-span-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Rata-Rata Kepuasan Pelanggan
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-foreground font-mono">
                                {stats.average.toFixed(1)}
                            </span>
                            <span className="text-lg font-bold text-muted-foreground">/ 5.0</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`h-5 w-5 ${
                                        s <= Math.round(stats.average)
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-muted-foreground/30'
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Berdasarkan <span className="font-bold text-foreground">{stats.total_reviews}</span> total ulasan pembeli
                        </p>

                        {/* Rating Breakdown Bars */}
                        <div className="w-full space-y-2 pt-4 border-t border-border/50 text-xs">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.breakdown[star] ?? 0;
                                const pct = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 w-10 text-muted-foreground">
                                            <span>{star}</span>
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        </div>
                                        <Progress value={pct} className="h-2 flex-1" />
                                        <span className="w-8 text-right font-mono text-[11px] text-muted-foreground">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Reviews List (8 cols) */}
                    <div className="md:col-span-8 space-y-4">
                        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs space-y-4">
                            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/50 pb-3">
                                <MessageSquare className="h-4 w-4 text-amber-500" />
                                <span>Daftar Ulasan Masuk</span>
                            </h2>

                            {ratings.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-xl">
                                    Belum ada ulasan atau rating dari pembeli.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {ratings.map((rev) => (
                                        <div
                                            key={rev.id}
                                            className="p-4 border border-border/70 rounded-xl bg-muted/20 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-xs text-foreground">
                                                            {rev.user_name}
                                                        </span>
                                                        <p className="text-[10px] text-muted-foreground font-mono">
                                                            Pesanan: {rev.order_number}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                className={`h-3.5 w-3.5 ${
                                                                    s <= rev.rating
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'text-muted-foreground/30'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <Badge variant="outline" className="text-[10px] font-mono">
                                                        {rev.created_at}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {rev.comment ? (
                                                <p className="text-xs text-foreground/90 pl-10 pt-1 italic">
                                                    "{rev.comment}"
                                                </p>
                                            ) : (
                                                <p className="text-[11px] text-muted-foreground/70 pl-10 pt-1 italic">
                                                    (Pembeli memberikan rating bintang tanpa komentar tambahan)
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

TenantRatings.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: '/tenant/dashboard',
        },
        {
            title: 'Ulasan & Rating Stand',
            href: '/tenant/ratings',
        },
    ],
};
