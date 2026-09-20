import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Banknote,
    CheckCircle2,
    ChevronRight,
    Clock,
    CookingPot,
    CreditCard,
    Radio,
    QrCode,
    Sparkles,
    Store,
    Utensils,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type ActiveOrder = {
    id: number;
    order_number: string;
    pickup_code: string;
    tenant_name: string;
    tenant_slug: string;
    tenant_location: string;
    created_at: string;
    status: string;
    status_label: string;
    payment_status: string;
    payment_method: string;
    payment_method_label?: string;
    subtotal_amount: number;
    app_fee: number;
    channel_fee: number;
    total_amount: number;
    estimated_time: string;
    items: Array<{
        id: number;
        name: string;
        qty: number;
        price: number;
        image?: string;
        choices?: string[];
        note?: string;
    }>;
};

type OrdersIndexProps = {
    activeOrders?: ActiveOrder[];
};

const playPickupNotificationSound = () => {
    try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.frequency.setValueAtTime(523.25, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.3);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.frequency.setValueAtTime(659.25, now + 0.15);
        gain2.gain.setValueAtTime(0.35, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.45);

        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.frequency.setValueAtTime(783.99, now + 0.3);
        gain3.gain.setValueAtTime(0.4, now + 0.3);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.3);
        osc3.stop(now + 0.8);
    } catch (e) {
        console.error(e);
    }
};

export default function OrdersIndex({ activeOrders = [] }: OrdersIndexProps) {
    const foodFallback = '/images/food-placeholder.jpg';
    const prevReadyOrderIdsRef = React.useRef<Set<number> | null>(null);

    // Auto-polling for status updates every 3 seconds
    React.useEffect(() => {
        const pollInterval = setInterval(() => {
            router.reload({ only: ['activeOrders'] });
        }, 3000);

        return () => clearInterval(pollInterval);
    }, []);

    // Detect when an order becomes ready for pickup and play chime
    React.useEffect(() => {
        const readyOrders = activeOrders.filter((o) => o.status === 'ready');
        if (prevReadyOrderIdsRef.current !== null) {
            const hasNewReadyOrder = readyOrders.some((o) => !prevReadyOrderIdsRef.current?.has(o.id));
            if (hasNewReadyOrder) {
                playPickupNotificationSound();
            }
        }
        prevReadyOrderIdsRef.current = new Set(readyOrders.map((o) => o.id));
    }, [activeOrders]);

    const getStatusBadge = (order: ActiveOrder) => {
        if (order.payment_method !== 'cash' && order.payment_status === 'unpaid') {
            return (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>Menunggu Pembayaran</span>
                </Badge>
            );
        }
        if (order.payment_method === 'cash' && order.payment_status === 'unpaid') {
            return (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Banknote className="size-3" />
                    <span>Bayar Tunai di Kasir</span>
                </Badge>
            );
        }
        if (order.status === 'ready') {
            return (
                <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="size-3" />
                    <span>Siap Diambil!</span>
                </Badge>
            );
        }
        if (order.status === 'processing' || order.status === 'paid') {
            return (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CookingPot className="size-3" />
                    <span>Sedang Dimasak</span>
                </Badge>
            );
        }
        return (
            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-md">
                {order.status_label || order.status}
            </Badge>
        );
    };

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
                        {activeOrders.map((order) => {
                            const firstItem = order.items[0];
                            const extraItemsCount = order.items.length - 1;
                            const isUnpaidCashless = order.payment_method !== 'cash' && order.payment_status === 'unpaid';

                            return (
                                <div
                                    key={order.id}
                                    className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-2xs hover:border-primary/40 transition-colors"
                                >
                                    {/* Card Header: Tenant Name + Status Badge */}
                                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Store className="size-4 text-primary shrink-0" />
                                            <h3 className="text-xs font-black text-foreground truncate">
                                                {order.tenant_name}
                                            </h3>
                                        </div>
                                        {getStatusBadge(order)}
                                    </div>

                                    {/* Meta Row: Pickup Code & Order Number */}
                                    <div className="flex items-center justify-between text-[10.5px] text-muted-foreground font-mono">
                                        <span>No: #{order.order_number}</span>
                                        <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                            Kode Pickup: {order.pickup_code}
                                        </span>
                                    </div>

                                    {/* Item Summary Preview Row */}
                                    <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/50">
                                        <img
                                            src={firstItem?.image || foodFallback}
                                            alt={firstItem?.name || 'Menu Item'}
                                            className="size-11 rounded-lg object-cover border border-border shrink-0 bg-card"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = foodFallback;
                                            }}
                                        />
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="text-xs font-bold text-foreground truncate">
                                                {firstItem ? `${firstItem.qty}x ${firstItem.name}` : 'Item Pesanan'}
                                            </span>
                                            {extraItemsCount > 0 && (
                                                <span className="text-[10px] text-muted-foreground font-medium">
                                                    +{extraItemsCount} menu lainnya
                                                </span>
                                            )}
                                            <span className="text-[10px] text-muted-foreground">
                                                {order.created_at}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Footer: Total Amount & Actions */}
                                    <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                                                Total Pembayaran
                                            </span>
                                            <span className="font-mono font-black text-sm text-primary leading-tight mt-0.5">
                                                Rp{order.total_amount.toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isUnpaidCashless && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => router.visit(`/orders/${order.id}/payment`)}
                                                    className="h-8 px-3 text-[11px] font-extrabold rounded-xl gap-1 bg-amber-500 text-white hover:bg-amber-600 shadow-2xs active:scale-95"
                                                >
                                                    <CreditCard className="size-3.5" />
                                                    <span>Bayar Sekarang</span>
                                                </Button>
                                            )}

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.visit(`/orders/${order.id}`)}
                                                className="h-8 px-3 text-[11px] font-black rounded-xl gap-1 border-border shadow-2xs active:scale-95 hover:bg-muted"
                                            >
                                                <span>Lihat Detail</span>
                                                <ChevronRight className="size-3.5 text-primary" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

OrdersIndex.layout = (page: React.ReactNode) => <StudentLayout>{page}</StudentLayout>;
