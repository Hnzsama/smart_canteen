import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    CookingPot,
    CreditCard,
    Info,
    MapPin,
    QrCode,
    Receipt,
    ShoppingBag,
    Sparkles,
    Store,
    Utensils,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type OrderShowProps = {
    order: {
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
        payment_status_label: string;
        payment_method: string;
        payment_method_label: string;
        payment_channel_code?: string;
        dining_option: string;
        subtotal_amount: number;
        app_fee: number;
        channel_fee: number;
        total_amount: number;
        estimated_time: string;
        notes?: string;
        qr_md5?: string;
        items: Array<{
            id: number;
            name: string;
            qty: number;
            price: number;
            subtotal: number;
            image?: string;
            choices?: string[];
            note?: string;
        }>;
    };
};

export default function OrderShow({ order }: OrderShowProps) {
    const foodFallback = '/images/food-placeholder.jpg';

    const isUnpaidCashless = order.payment_status === 'unpaid' && order.payment_method !== 'cash';
    const isCompleted = order.status === 'completed';
    const isReady = order.status === 'ready';
    const isProcessing = order.status === 'processing' || order.status === 'paid';
    const isCancelled = order.status === 'cancelled' || order.status === 'failed' || order.status === 'expired';

    const md5Hash = order.qr_md5 || `md5_pickup_${order.pickup_code}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(md5Hash)}`;

    // Auto status polling for real-time status updates on Order Detail page
    useEffect(() => {
        if (order.status === 'completed' || order.status === 'cancelled' || order.status === 'failed') {
            return;
        }

        const pollInterval = setInterval(() => {
            router.reload({ only: ['order'] });
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [order.id, order.status]);

    return (
        <>
            <Head title={`Detail Pesanan #${order.order_number} - Smart Canteen`} />

            <div className="w-full space-y-4 pb-28 pt-1 font-sans">
                {/* Header Navbar */}
                <div className="flex items-center justify-between px-1 py-1 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit('/orders')}
                            className="size-9 rounded-full hover:bg-muted active:scale-90 p-0 text-foreground"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <div className="flex flex-col">
                            <h1 className="text-base font-black tracking-tight text-foreground leading-tight">
                                Detail Pesanan
                            </h1>
                            <span className="text-[10px] text-muted-foreground font-mono">
                                No: #{order.order_number}
                            </span>
                        </div>
                    </div>

                    {isUnpaidCashless ? (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                            Menunggu Pembayaran
                        </Badge>
                    ) : isCompleted ? (
                        <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                            Selesai
                        </Badge>
                    ) : isReady ? (
                        <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                            Siap Diambil!
                        </Badge>
                    ) : isCancelled ? (
                        <Badge variant="destructive" className="text-[10px] font-black px-2.5 py-0.5 rounded-full">
                            Dibatalkan
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                            Sedang Dimasak
                        </Badge>
                    )}
                </div>

                {/* UNPAID CASHLESS WARNING BANNER */}
                {isUnpaidCashless && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                        <div className="flex items-start gap-2.5">
                            <Clock className="size-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5 flex-1">
                                <h4 className="text-xs font-black text-amber-700 dark:text-amber-400">
                                    Pesanan Belum Dibayar
                                </h4>
                                <p className="text-[11px] text-amber-600/90 leading-tight">
                                    Silakan lakukan pembayaran agar dapur stand dapat mulai memasak makananmu.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={() => router.visit(`/orders/${order.id}/payment`)}
                            className="w-full h-10 text-xs font-black rounded-xl gap-2 bg-amber-500 text-white hover:bg-amber-600 shadow-md active:scale-95"
                        >
                            <CreditCard className="size-4" />
                            <span>Bayar Sekarang (Rp{order.total_amount.toLocaleString('id-ID')})</span>
                        </Button>
                    </div>
                )}

                {/* STATUS TRACKER CARD */}
                <div className="p-4 bg-card rounded-2xl border border-border/80 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h3 className="text-sm font-black text-foreground">
                                {isUnpaidCashless
                                    ? 'Menunggu Pembayaran'
                                    : isCompleted
                                    ? 'Pesanan Selesai'
                                    : isReady
                                    ? 'Makanan Siap Diambil!'
                                    : isCancelled
                                    ? 'Pesanan Dibatalkan'
                                    : 'Dapur Sedang Memasak'}
                            </h3>
                            <p className="text-[11px] text-muted-foreground">
                                {isUnpaidCashless
                                    ? 'Menunggu konfirmasi pembayaran'
                                    : isCompleted
                                    ? 'Terima kasih, pesanan telah diambil'
                                    : isReady
                                    ? 'Tunjukkan QR Code ke kasir stand'
                                    : isCancelled
                                    ? 'Pesanan ini telah dibatalkan'
                                    : `Estimasi siap: ${order.estimated_time}`}
                            </p>
                        </div>
                        <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            {isCompleted || isReady ? <CheckCircle2 className="size-6 text-emerald-500" /> : <CookingPot className="size-6 text-amber-500" />}
                        </div>
                    </div>

                    {/* 4-Stage Minimalist Line */}
                    <div className="py-1 space-y-1.5">
                        <div className="flex items-center w-full px-2">
                            {/* Step 1: Diterima */}
                            <div className={`size-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                                isUnpaidCashless
                                    ? 'bg-amber-500 text-white ring-4 ring-amber-500/20'
                                    : 'bg-primary text-primary-foreground'
                            }`}>
                                <Check className="size-3" />
                            </div>

                            {/* Line 1 -> 2 */}
                            <div className={`flex-1 h-0.5 ${!isUnpaidCashless ? 'bg-primary' : 'bg-border'}`} />

                            {/* Step 2: Dimasak */}
                            <div className={`size-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                                isUnpaidCashless || isCancelled
                                    ? 'bg-muted text-muted-foreground border border-border opacity-50'
                                    : isReady || isCompleted
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                            }`}>
                                <CookingPot className="size-3" />
                            </div>

                            {/* Line 2 -> 3 */}
                            <div className={`flex-1 h-0.5 ${isReady || isCompleted ? 'bg-primary' : 'bg-border'}`} />

                            {/* Step 3: Siap / Selesai */}
                            <div className={`size-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                                isReady || isCompleted
                                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                                    : 'bg-muted text-muted-foreground border border-border opacity-50'
                            }`}>
                                <QrCode className="size-3" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[9.5px]">
                            <span className={isUnpaidCashless ? 'font-black text-amber-600' : 'font-bold text-foreground'}>
                                {isUnpaidCashless ? 'Menunggu Bayar' : 'Diterima'}
                            </span>
                            <span className={isProcessing ? 'font-black text-primary' : 'font-medium text-muted-foreground opacity-50'}>
                                Dimasak
                            </span>
                            <span className={isReady || isCompleted ? 'font-black text-emerald-600' : 'font-medium text-muted-foreground opacity-50'}>
                                {isCompleted ? 'Selesai' : 'Siap Pickup'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* PICKUP TICKET QR CODE CARD WITH MD5 HASH */}
                <div className="p-4 bg-card rounded-3xl border border-border/80 text-center space-y-3.5 shadow-2xs relative">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 border-b border-border/40 pb-2.5 text-left">
                        <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Store className="size-4" />
                            </div>
                            <h3 className="text-xs font-black text-foreground truncate max-w-[200px]">
                                {order.tenant_name}
                            </h3>
                        </div>
                        <span className="text-[10.5px] text-muted-foreground font-mono shrink-0">
                            {order.tenant_location}
                        </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block font-bold">
                        Tiket QR Pickup (Tunjukkan Ke Kasir)
                    </span>

                    <div className="p-3 bg-white rounded-2xl border border-slate-200 inline-block mx-auto shadow-md">
                        <img
                            src={qrUrl}
                            alt="QR Code Pickup Hash"
                            className="size-48 mx-auto object-contain rounded-lg select-none"
                        />
                    </div>

                    <div className="space-y-2 pt-0.5 max-w-xs mx-auto">
                        <div className="inline-flex items-center gap-1.5 bg-muted/60 px-3 py-1 rounded-full border border-border/60 text-[10px] font-mono text-muted-foreground shadow-2xs">
                            <span className="font-extrabold text-foreground">MD5:</span>
                            <span className="font-bold text-primary tracking-tight select-all">{md5Hash}</span>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-2xl space-y-0.5">
                            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
                                Kode Pickup Manual
                            </span>
                            <span className="text-xl font-black font-mono text-primary tracking-widest block">
                                {order.pickup_code}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ITEMS DETAIL CARD */}
                <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <h3 className="text-xs font-black text-foreground flex items-center gap-1.5">
                            <Utensils className="size-3.5 text-primary" />
                            <span>Rincian Menu ({order.items.length})</span>
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-mono">
                            {order.dining_option === 'dine_in' ? 'Makan di Tempat' : 'Bawa Pulang'}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-start justify-between gap-3 pb-2.5 border-b border-border/30 last:border-none last:pb-0">
                                <div className="flex items-start gap-2.5 min-w-0">
                                    <img
                                        src={item.image || foodFallback}
                                        alt={item.name}
                                        className="size-11 rounded-xl object-cover border border-border shrink-0 bg-muted"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = foodFallback;
                                        }}
                                    />
                                    <div className="flex flex-col min-w-0 space-y-0.5">
                                        <span className="text-xs font-bold text-foreground">
                                            {item.qty}x {item.name}
                                        </span>
                                        {item.choices && item.choices.length > 0 && (
                                            <span className="text-[10px] text-muted-foreground">
                                                {item.choices.join(', ')}
                                            </span>
                                        )}
                                        {item.note && (
                                            <p className="text-[10px] text-amber-600 italic">
                                                Catatan: "{item.note}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <span className="font-mono text-xs font-bold text-foreground shrink-0">
                                    Rp{item.subtotal.toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COST BREAKDOWN CARD */}
                <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-2 shadow-2xs">
                    <h3 className="text-xs font-black text-foreground flex items-center gap-1.5 border-b border-border/40 pb-2">
                        <Receipt className="size-3.5 text-primary" />
                        <span>Rincian Pembayaran</span>
                    </h3>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                        <div className="flex justify-between">
                            <span>Subtotal Menu</span>
                            <span className="font-mono font-medium text-foreground">
                                Rp{order.subtotal_amount.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Admin Service</span>
                            <span className="font-mono font-medium text-foreground">
                                {order.app_fee > 0 ? `Rp${order.app_fee.toLocaleString('id-ID')}` : 'Rp 0 (Free)'}
                            </span>
                        </div>

                        {order.channel_fee > 0 && (
                            <div className="flex justify-between">
                                <span>Payment Service</span>
                                <span className="font-mono font-medium text-foreground">
                                    Rp{order.channel_fee.toLocaleString('id-ID')}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span>Metode Pembayaran</span>
                            <span className="font-bold text-foreground">
                                {order.payment_method_label}
                            </span>
                        </div>

                        <div className="flex justify-between pt-2 border-t border-border/40 font-black text-foreground text-xs">
                            <span>Total Pembayaran</span>
                            <span className="font-mono text-sm text-primary">
                                Rp{order.total_amount.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* BOTTOM FLOATING ACTION BAR */}
                <div className="fixed bottom-3 z-50 w-full max-w-[430px] left-1/2 -translate-x-1/2 px-3 pointer-events-none">
                    <div className="pointer-events-auto bg-card/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 h-16 rounded-3xl p-3 flex items-center justify-between gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/orders')}
                            className="h-11 px-4 text-xs font-bold rounded-2xl border-border hover:bg-muted active:scale-95 transition-all"
                        >
                            <span>Kembali Ke Daftar</span>
                        </Button>

                        {isUnpaidCashless ? (
                            <Button
                                type="button"
                                onClick={() => router.visit(`/orders/${order.id}/payment`)}
                                className="h-11 flex-1 text-xs font-black rounded-2xl gap-1.5 shadow-md active:scale-95 transition-all bg-amber-500 text-white hover:bg-amber-600"
                            >
                                <CreditCard className="size-4" />
                                <span>Bayar Sekarang</span>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => router.visit('/')}
                                className="h-11 flex-1 text-xs font-black rounded-2xl gap-1.5 shadow-md active:scale-95 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Utensils className="size-4" />
                                <span>Pesan Lagi di Kantin</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

OrderShow.layout = (page: React.ReactNode) => <StudentLayout>{page}</StudentLayout>;
