import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    CookingPot,
    Receipt,
    ReceiptText,
    Sparkles,
    Utensils,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderSuccessProps } from './types';
import { PickupQrCard } from './components/pickup-qr-dialog';
import { OrderItemsList } from './components/order-items-list';
import { OrderSummaryCard } from './components/order-summary-card';
import { OrderReceiptDialog } from './components/order-receipt-dialog';

export default function OrderSuccess({ order }: OrderSuccessProps) {
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    return (
        <>
            <Head title={`Pembayaran Berhasil #${order.order_number} - Smart Canteen`} />

            <div className="w-full space-y-4 pb-28 pt-1 font-sans">
                {/* Header Navbar */}
                <div className="flex items-center justify-between px-1 py-1 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
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
                                Transaksi Berhasil
                            </h1>
                            <span className="text-[10px] text-muted-foreground font-mono">
                                #{order.order_number}
                            </span>
                        </div>
                    </div>

                    <Badge
                        variant="outline"
                        className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1"
                    >
                        <CheckCircle2 className="size-3" />
                        <span>Lunas</span>
                    </Badge>
                </div>

                {/* HERO CELEBRATORY BANNER */}
                <div className="p-5 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-primary/10 rounded-3xl border border-emerald-500/30 text-center space-y-3.5 shadow-sm relative overflow-hidden">
                    <div className="size-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-inner">
                        <CheckCircle2 className="size-8" />
                    </div>

                    <div className="space-y-1 max-w-sm mx-auto">
                        <h2 className="text-lg font-black text-foreground tracking-tight flex items-center justify-center gap-1.5">
                            <span>Pembayaran Berhasil!</span>
                            <Sparkles className="size-4 text-emerald-500" />
                        </h2>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Pesananmu telah dikonfirmasi dan langsung diteruskan ke dapur <strong>{order.tenant_name}</strong>.
                        </p>
                    </div>

                    {/* PICKUP TICKET CHIP */}
                    <div className="p-3 bg-card/90 backdrop-blur-md rounded-2xl border border-border/80 inline-block mx-auto space-y-0.5 shadow-2xs">
                        <span className="text-[9.5px] uppercase font-extrabold text-muted-foreground tracking-wider block">
                            Kode Pickup Pengambilan
                        </span>
                        <span className="text-2xl font-black font-mono text-primary tracking-widest block">
                            {order.pickup_code}
                        </span>
                    </div>
                </div>

                {/* QR TICKET CARD WITH MD5 HASH */}
                <PickupQrCard
                    tenantName={order.tenant_name}
                    tenantLocation={order.tenant_location}
                    pickupCode={order.pickup_code}
                    qrMd5={order.qr_md5}
                    orderNumber={order.order_number}
                />

                {/* ORDER & PAYMENT DETAILS */}
                <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-2xs">
                    <h3 className="text-xs font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <Receipt className="size-4 text-primary" />
                        <span>Nota Rincian Pembayaran</span>
                    </h3>

                    <OrderItemsList items={order.items} showSubtotal />
                </div>

                <OrderSummaryCard
                    subtotalAmount={order.subtotal_amount}
                    appFee={order.app_fee}
                    channelFee={order.channel_fee}
                    totalAmount={order.total_amount}
                />

                {/* STICKY BOTTOM ACTION FOOTER */}
                <div className="fixed bottom-3 z-50 w-full max-w-[430px] left-1/2 -translate-x-1/2 px-3 pointer-events-none">
                    <div className="pointer-events-auto bg-card/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 h-16 rounded-3xl p-3 flex items-center justify-between gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowReceiptModal(true)}
                            className="h-11 px-4 text-xs font-bold rounded-2xl border-border hover:bg-muted active:scale-95 transition-all"
                        >
                            <ReceiptText className="size-4 text-primary" />
                            <span>Unduh Struk</span>
                        </Button>

                        <Button
                            type="button"
                            onClick={() => router.visit(`/orders/${order.id}`)}
                            className="h-11 flex-1 text-xs font-black rounded-2xl gap-1.5 shadow-md active:scale-95 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            <CookingPot className="size-4" />
                            <span>Lihat Status Pesanan</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* RECEIPT / NOTA MODAL DIALOG */}
            <OrderReceiptDialog
                order={order}
                isOpen={showReceiptModal}
                onClose={() => setShowReceiptModal(false)}
            />
        </>
    );
}

OrderSuccess.layout = (page: React.ReactNode) => <StudentLayout showBottomNav={false}>{page}</StudentLayout>;
