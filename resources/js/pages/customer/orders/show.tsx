import React from 'react';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    CookingPot,
    CreditCard,
    QrCode,
    Utensils,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Button } from '@/components/ui/button';
import { OrderShowProps } from './types';
import { useOrderPolling } from './hooks/use-order-polling';
import { OrderStatusBadge } from './components/order-status-badge';
import { OrderItemsList } from './components/order-items-list';
import { OrderSummaryCard } from './components/order-summary-card';
import { PickupQrCard } from './components/pickup-qr-dialog';

export default function OrderShow({ order }: OrderShowProps) {
    const isUnpaidCashless = order.payment_status === 'unpaid' && order.payment_method !== 'cash';
    const isCompleted = order.status === 'completed';
    const isReady = order.status === 'ready';
    const isProcessing = order.status === 'processing' || order.status === 'paid';
    const isCancelled = order.status === 'cancelled' || order.status === 'failed' || order.status === 'expired';

    // Auto status polling for real-time status updates on Order Detail page unless terminal state
    const isTerminal = isCompleted || isCancelled;
    useOrderPolling(['order'], isTerminal ? 99999999 : 3000);

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

                    <OrderStatusBadge
                        status={order.status}
                        paymentStatus={order.payment_status}
                        paymentMethod={order.payment_method}
                        statusLabel={order.status_label}
                    />
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
                <PickupQrCard
                    tenantName={order.tenant_name}
                    tenantLocation={order.tenant_location}
                    pickupCode={order.pickup_code}
                    qrMd5={order.qr_md5}
                    orderNumber={order.order_number}
                />

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

                    <OrderItemsList items={order.items} showSubtotal />
                </div>

                {/* COST BREAKDOWN CARD */}
                <OrderSummaryCard
                    subtotalAmount={order.subtotal_amount}
                    appFee={order.app_fee}
                    channelFee={order.channel_fee}
                    totalAmount={order.total_amount}
                />

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

OrderShow.layout = (page: React.ReactNode) => <StudentLayout showBottomNav={false}>{page}</StudentLayout>;
