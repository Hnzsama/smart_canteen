import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    CookingPot,
    Download,
    FileText,
    HelpCircle,
    Info,
    MapPin,
    Printer,
    QrCode,
    Receipt,
    ReceiptText,
    Share2,
    ShoppingBag,
    Sparkles,
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
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type OrderSuccessProps = {
    order: {
        id: number;
        order_number: string;
        pickup_code: string;
        customer_name: string;
        customer_email: string;
        tenant_name: string;
        tenant_slug: string;
        tenant_location: string;
        created_at: string;
        paid_at: string;
        status: string;
        status_label: string;
        payment_status: string;
        payment_status_label: string;
        payment_method: string;
        payment_method_label: string;
        dining_option: string;
        subtotal_amount: number;
        app_fee: number;
        channel_fee: number;
        total_amount: number;
        notes?: string;
        qr_md5?: string;
        items: Array<{
            id: number;
            name: string;
            qty: number;
            price: number;
            subtotal: number;
            options?: string[];
            note?: string;
        }>;
    };
};

export default function OrderSuccess({ order }: OrderSuccessProps) {
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const handlePrintReceipt = () => {
        window.print();
    };

    const md5Hash = order.qr_md5 || `md5_pickup_${order.pickup_code}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(md5Hash)}`;

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

                    <div className="p-3 bg-white rounded-2xl border border-slate-200 inline-block mx-auto shadow-md">
                        <img
                            src={qrUrl}
                            alt="QR Code Pickup Hash"
                            className="size-48 mx-auto object-contain rounded-lg select-none"
                        />
                    </div>

                    <div className="space-y-1.5 pt-0.5 max-w-xs mx-auto">
                        <div className="inline-flex items-center gap-1.5 bg-muted/60 px-3 py-1 rounded-full border border-border/60 text-[10px] font-mono text-muted-foreground shadow-2xs">
                            <span className="font-extrabold text-foreground">MD5:</span>
                            <span className="font-bold text-primary tracking-tight select-all">{md5Hash}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                            Tunjukkan QR atau sebutkan Kode Pickup <strong className="text-foreground font-black">{order.pickup_code}</strong> saat mengambil di kasir stand.
                        </p>
                    </div>
                </div>

                {/* ORDER & PAYMENT DETAILS */}
                <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-2xs">
                    <h3 className="text-xs font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <Receipt className="size-4 text-primary" />
                        <span>Nota Rincian Pembayaran</span>
                    </h3>

                    <div className="space-y-2">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-start justify-between text-xs border-b border-border/30 pb-2 last:border-none last:pb-0">
                                <div className="space-y-0.5 min-w-0 pr-2">
                                    <span className="font-bold text-foreground block">
                                        {item.qty}x {item.name}
                                    </span>
                                    {item.options && item.options.length > 0 && (
                                        <span className="text-[10px] text-muted-foreground">
                                            {item.options.join(', ')}
                                        </span>
                                    )}
                                    {item.note && (
                                        <p className="text-[10px] text-amber-600 italic">
                                            Catatan: "{item.note}"
                                        </p>
                                    )}
                                </div>
                                <span className="font-mono font-bold text-foreground shrink-0">
                                    Rp{item.subtotal.toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 border-t border-border/50 space-y-1.5 text-[11px] text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Subtotal Menu</span>
                            <span className="font-mono font-semibold text-foreground">
                                Rp{order.subtotal_amount.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Admin Service</span>
                            <span className="font-mono font-semibold text-foreground">
                                {order.app_fee > 0 ? `Rp${order.app_fee.toLocaleString('id-ID')}` : 'Rp 0 (Free)'}
                            </span>
                        </div>

                        {order.channel_fee > 0 && (
                            <div className="flex justify-between">
                                <span>Payment Service</span>
                                <span className="font-mono font-semibold text-foreground">
                                    Rp{order.channel_fee.toLocaleString('id-ID')}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span>Metode Pembayaran</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
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

            {/* RECEIPT / NOTA MODAL DIALOG FOR PRINT / DOWNLOAD */}
            <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
                <DialogContent className="w-[calc(100%-1.5rem)] max-w-[400px] rounded-3xl p-5 text-left space-y-4 border-border/80 shadow-2xl bg-card">
                    <DialogHeader className="space-y-1 border-b border-border/50 pb-3">
                        <DialogTitle className="text-base font-black text-foreground flex items-center gap-2">
                            <ReceiptText className="size-5 text-primary" />
                            <span>Nota Struk Pembayaran</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground font-mono">
                            Smart Canteen FEB • No. #{order.order_number}
                        </DialogDescription>
                    </DialogHeader>

                    {/* RECEIPT PAPER CONTAINER FOR PRINT */}
                    <div id="printable-receipt" className="bg-white text-slate-900 p-4 rounded-2xl border border-slate-200 space-y-3 font-sans text-xs shadow-inner">
                        {/* Header */}
                        <div className="text-center border-b border-slate-200 pb-3 space-y-0.5">
                            <h4 className="font-black text-sm tracking-tight text-slate-900">SMART CANTEEN FEB</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Universitas Negeri Surabaya • Surabaya</p>
                            <span className="text-[10px] text-slate-400 font-mono block pt-1">{order.paid_at}</span>
                        </div>

                        {/* Customer & Stand */}
                        <div className="space-y-1 text-[11px] border-b border-slate-200 pb-2 font-mono">
                            <div className="flex justify-between text-slate-600">
                                <span>Pelanggan:</span>
                                <span className="font-bold text-slate-900">{order.customer_name}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Stand Toko:</span>
                                <span className="font-bold text-slate-900">{order.tenant_name}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Kode Pickup:</span>
                                <span className="font-black text-emerald-600">{order.pickup_code}</span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2 border-b border-slate-200 pb-3">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-mono">
                                Menu Items:
                            </span>
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-xs">
                                    <div className="space-y-0.5 min-w-0 pr-2">
                                        <span className="font-bold text-slate-800 block">
                                            {item.qty}x {item.name}
                                        </span>
                                        {item.options && item.options.length > 0 && (
                                            <span className="text-[9.5px] text-slate-500 block">
                                                {item.options.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 shrink-0">
                                        Rp{item.subtotal.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Pricing Summary */}
                        <div className="space-y-1 text-xs font-mono pt-1">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>Rp{order.subtotal_amount.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Admin Fee</span>
                                <span>{order.app_fee > 0 ? `Rp${order.app_fee.toLocaleString('id-ID')}` : 'Rp 0'}</span>
                            </div>
                            {order.channel_fee > 0 && (
                                <div className="flex justify-between text-slate-600">
                                    <span>Payment Fee</span>
                                    <span>Rp{order.channel_fee.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-300">
                                <span>TOTAL LUNAS</span>
                                <span>Rp{order.total_amount.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="text-center pt-2 border-t border-dashed border-slate-200 text-[9.5px] text-slate-400">
                            Terima kasih telah berbelanja di Smart Canteen FEB!
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <Button
                            type="button"
                            onClick={handlePrintReceipt}
                            className="flex-1 h-11 text-xs font-black rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                        >
                            <Printer className="size-4" />
                            <span>Cetak / Simpan PDF Struk</span>
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowReceiptModal(false)}
                            className="h-11 px-4 text-xs font-bold rounded-xl"
                        >
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

OrderSuccess.layout = (page: React.ReactNode) => <StudentLayout showBottomNav={false}>{page}</StudentLayout>;
