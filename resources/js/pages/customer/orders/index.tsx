import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Radio, Sparkles, Utensils } from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrdersIndexProps } from './types';
import { useOrderPolling } from './hooks/use-order-polling';
import { useOrderSound } from './hooks/use-order-sound';
import { ActiveOrderCard } from './components/active-order-card';

export default function OrdersIndex({ activeOrders = [] }: OrdersIndexProps) {
    // Auto-polling for status updates every 3 seconds
    useOrderPolling(['activeOrders']);

    // Play chime sound when an order becomes ready
    useOrderSound(activeOrders);

    return (
        <>
            <Head title="Pesanan Aktif - Smart Canteen FEB" />

            <div className="flex flex-col gap-4 w-full pb-10 font-sans">
                {/* Page Title Header */}
                <div className="flex items-center justify-between pt-1 border-b border-border/60 pb-3">
                    <div className="space-y-0.5">
                        <h1 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                            <span>Pesanan Aktif</span>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[9.5px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Radio className="size-2.5 animate-pulse text-emerald-500" />
                                <span>Live Sync</span>
                            </Badge>
                        </h1>
                        <p className="text-[11px] text-muted-foreground">
                            Daftar makanan yang sedang diproses kantin
                        </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {activeOrders.length} Pesanan Aktif
                    </Badge>
                </div>

                {/* Empty State */}
                {activeOrders.length === 0 ? (
                    <div className="min-h-[340px] rounded-3xl border border-dashed border-border bg-card/40 p-8 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                            <Utensils className="size-8" />
                        </div>
                        <div className="space-y-1 max-w-xs">
                            <h3 className="font-black text-base text-foreground">Belum Ada Pesanan Aktif</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Kamu belum memiliki pesanan makanan yang sedang diproses. Yuk intip menu favoritmu!
                            </p>
                        </div>
                        <Button asChild className="font-black text-xs rounded-2xl h-11 px-6 gap-2 shadow-md active:scale-95 transition-transform">
                            <Link href="/">
                                <Sparkles className="size-4" />
                                <span>Jelajahi Menu Kantin</span>
                            </Link>
                        </Button>
                    </div>
                ) : (
                    /* LIST OF ACTIVE ORDER CARDS */
                    <div className="space-y-3">
                        {activeOrders.map((order) => (
                            <ActiveOrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

OrdersIndex.layout = (page: React.ReactNode) => <StudentLayout>{page}</StudentLayout>;
