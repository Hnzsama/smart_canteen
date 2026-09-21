import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Utensils } from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Button } from '@/components/ui/button';
import { HistoryOrder, OrdersHistoryProps } from './types';
import { HistoryOrderCard } from './components/history-order-card';
import { OrderRatingDialog } from './components/order-rating-dialog';

export default function OrdersHistory({ orderHistory = [] }: OrdersHistoryProps) {
    const [selectedOrder, setSelectedOrder] = useState<HistoryOrder | null>(null);

    const openRatingModal = (order: HistoryOrder, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedOrder(order);
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
                            <HistoryOrderCard
                                key={order.id}
                                order={order}
                                onOpenRating={openRatingModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Rating Modal Dialog */}
            <OrderRatingDialog
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </>
    );
}

OrdersHistory.layout = (page: React.ReactNode) => (
    <StudentLayout>{page}</StudentLayout>
);
