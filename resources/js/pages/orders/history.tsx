import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronRight,
    ShoppingBag,
    Star,
    Store,
    Utensils,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type HistoryOrder = {
    id: number;
    order_number: string;
    pickup_code: string;
    tenant_name: string;
    tenant_slug: string;
    tenant_location: string;
    date: string;
    status: string;
    status_label: string;
    total_amount: number;
    payment_method: string;
    items: Array<{
        id: number;
        name: string;
        qty: number;
        price: number;
        image?: string;
        choices?: string[];
        note?: string;
    }>;
    rating_given?: number | null;
};

type OrdersHistoryProps = {
    orderHistory?: HistoryOrder[];
};

export default function OrdersHistory({ orderHistory = [] }: OrdersHistoryProps) {
    const foodFallback = '/images/food-placeholder.jpg';

    const [selectedOrder, setSelectedOrder] = useState<HistoryOrder | null>(null);
    const [ratingValue, setRatingValue] = useState<number>(5);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const ratingLabels = ['Sangat Buruk', 'Buruk', 'Cukup Baik', 'Enak & Bagus', 'Sangat Memuaskan!'];

    const openRatingModal = (order: HistoryOrder, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedOrder(order);
        setRatingValue(5);
        setHoveredRating(0);
        setComment('');
    };

    const submitRating = () => {
        if (!selectedOrder) return;
        setIsSubmitting(true);

        router.post(
            `/orders/${selectedOrder.id}/rate`,
            {
                rating: ratingValue,
                comment,
            },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    setSelectedOrder(null);
                },
            }
        );
    };

    return (
        <>
            <Head title="Riwayat Transaksi - Smart Canteen FEB" />

            <div className="flex flex-col gap-6 w-full pb-10">
                {/* Page Title Header */}
                <div className="flex items-center justify-between pt-1 border-b border-border/60 pb-3">
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-black tracking-tight text-foreground">
                            Riwayat Pesanan
                        </h1>
                        <p className="text-[11px] text-muted-foreground">
                            Daftar transaksi pesanan makanan yang telah selesai
                        </p>
                    </div>
                    <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/50">
                        {orderHistory.length} Transaksi
                    </span>
                </div>

                {/* History Content */}
                {orderHistory.length === 0 ? (
                    <div className="min-h-[340px] rounded-3xl border border-dashed border-border bg-card/40 p-8 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                            <Utensils className="size-8" />
                        </div>
                        <div className="space-y-1 max-w-xs">
                            <h3 className="font-black text-base text-foreground">Belum Ada Riwayat</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Kamu belum memiliki histori pesanan yang selesai.
                            </p>
                        </div>
                        <Button asChild className="font-black text-xs rounded-2xl h-11 px-6 gap-2 shadow-md active:scale-95 transition-transform">
                            <Link href="/">
                                <ShoppingBag className="size-4" />
                                <span>Pesan Makanan Sekarang</span>
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orderHistory.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="block rounded-2xl border border-border/80 bg-card p-4 space-y-3.5 shadow-2xs hover:border-primary/40 active:scale-[0.99] transition-all group"
                            >
                                {/* Merchant Header & Status */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <Store className="size-4 text-primary shrink-0" />
                                            <h3 className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-0.5">
                                                <span>{order.tenant_name}</span>
                                                <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                                            </h3>
                                        </div>

                                        <Badge
                                            variant="secondary"
                                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-0.5 h-5 rounded-full shrink-0 gap-1"
                                        >
                                            <CheckCircle2 className="size-3" />
                                            <span>Selesai</span>
                                        </Badge>
                                    </div>

                                    <p className="text-[10px] font-mono text-muted-foreground">
                                        {order.date} • No: #{order.order_number}
                                    </p>
                                </div>

                                <hr className="border-border/50" />

                                {/* Food Items List */}
                                <div className="space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-start justify-between gap-3 pb-3 border-b border-border/40 last:border-none last:pb-0"
                                        >
                                            <div className="flex items-start gap-3 min-w-0">
                                                <img
                                                    src={item.image || foodFallback}
                                                    alt={item.name}
                                                    className="size-12 rounded-2xl object-cover border border-border shrink-0 bg-muted"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = foodFallback;
                                                    }}
                                                />
                                                <div className="flex flex-col min-w-0 space-y-1">
                                                    <span className="text-xs font-bold text-foreground leading-snug">
                                                        {item.qty}x {item.name}
                                                    </span>

                                                    {item.choices && item.choices.length > 0 && (
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.choices.map((choice, cIdx) => (
                                                                <Badge
                                                                    key={cIdx}
                                                                    variant="secondary"
                                                                    className="text-[9px] px-1.5 py-0 h-4 font-medium"
                                                                >
                                                                    {choice}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {item.note && (
                                                        <p className="text-[10px] text-muted-foreground italic leading-tight">
                                                            Catatan: "{item.note}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <span className="font-mono text-xs font-black text-foreground shrink-0 pt-0.5">
                                                Rp {item.price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Rating & Total Footer */}
                                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                                    <div>
                                        {order.rating_given ? (
                                            <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                                                <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                                <span className="text-[11px]">Bintang {order.rating_given}/5</span>
                                            </div>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => openRatingModal(order, e)}
                                                className="h-8 px-3 text-[11px] font-bold rounded-xl gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all shrink-0"
                                            >
                                                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                                                <span>Beri Rating</span>
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="text-right pr-1">
                                            <span className="text-[9.5px] text-muted-foreground block leading-none">Total Belanja</span>
                                            <span className="font-mono text-sm font-black text-primary">
                                                Rp {order.total_amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        <span className="h-8 px-3 text-[11px] font-bold rounded-xl gap-1 bg-primary/10 text-primary border border-primary/20 flex items-center shrink-0">
                                            <span>Lihat Detail</span>
                                            <ChevronRight className="size-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Rating Modal Dialog */}
            <Dialog open={selectedOrder !== null} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-md rounded-3xl p-6">
                    <DialogHeader className="space-y-1.5">
                        <DialogTitle className="text-center text-lg font-black tracking-tight">
                            Beri Rating & Ulasan
                        </DialogTitle>
                        <DialogDescription className="text-center text-xs text-muted-foreground">
                            Bagikan pengalaman kamu memesan di <span className="font-bold text-foreground">{selectedOrder?.tenant_name}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-5">
                        {/* Interactive Stars Selection */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const isFilled = (hoveredRating || ratingValue) >= star;
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRatingValue(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="p-1 text-amber-400 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                        >
                                            <Star
                                                className={`size-8 ${
                                                    isFilled ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            <span className="text-xs font-extrabold text-amber-500">
                                {ratingLabels[(hoveredRating || ratingValue) - 1]} ({hoveredRating || ratingValue}/5)
                            </span>
                        </div>

                        {/* Comment Textarea */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground block">
                                Ulasan Kamu <span className="text-muted-foreground text-[10px] font-normal">(Opsional)</span>
                            </label>
                            <textarea
                                placeholder="Makanannya enak, porsi kenyang, penjual ramah..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full text-xs rounded-2xl min-h-[90px] p-3 border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                maxLength={500}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-row gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelectedOrder(null)}
                            className="flex-1 sm:flex-none font-bold text-xs rounded-xl h-10"
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={submitRating}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-none font-black text-xs rounded-xl h-10 gap-1.5 bg-amber-500 hover:bg-amber-600 text-black shadow-xs"
                        >
                            <Star className="size-4 fill-black text-black" />
                            <span>{isSubmitting ? 'Mengirim...' : 'Kirim Rating'}</span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

OrdersHistory.layout = (page: React.ReactNode) => (
    <StudentLayout>{page}</StudentLayout>
);

