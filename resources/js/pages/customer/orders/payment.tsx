import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Banknote,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Download,
    Info,
    QrCode,
    Receipt,
    RefreshCw,
    Sparkles,
    Store,
    Timer,
} from 'lucide-react';
import StudentLayout from '@/layouts/student-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderPaymentProps } from './types';
import { usePaymentTimer } from './hooks/use-payment-timer';
import { OrderSummaryCard } from './components/order-summary-card';

export default function OrderPayment({ order }: OrderPaymentProps) {
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const isCash = order.payment_method === 'cash';
    const maxMinutes = isCash ? 15 : 10;

    const { remainingSeconds, isExpired, formattedTime } = usePaymentTimer({
        expiresAt: order.expires_at,
        isExpiredProp: order.is_expired,
        isCash,
        orderStatus: order.status,
        paymentStatus: order.payment_status,
    });

    const checkStatus = async (isManual = false) => {
        try {
            const res = await fetch(`/orders/${order.id}/status`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (data.is_paid) {
                setShowSuccessToast(true);
                setTimeout(() => {
                    router.visit(data.success_url || `/orders/${order.id}/success`);
                }, 1200);
            } else if (data.is_expired) {
                // Handled via state in hook
            }
        } catch (e) {
            console.error('Status check error:', e);
        }
    };

    // Auto status polling for payment completion
    useEffect(() => {
        if (isExpired) return;

        checkStatus(false);
        const pollTimer = setInterval(() => checkStatus(false), 2500);
        return () => clearInterval(pollTimer);
    }, [order.id, isExpired]);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(label);
        setTimeout(() => setCopiedText(null), 2500);
    };

    const isQris = !isCash && (order.payment_channel_code === 'qris' || order.payment_details?.type === 'qris');
    const isVa = !isCash && !isQris;

    const qrUrl =
        order.payment_details?.qr_url ||
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MIDTRANS-${order.order_number}`;

    const vaNumber = order.payment_details?.va_number || `82710${String(order.id + 1000).padStart(8, '0')}`;
    const channelName = order.payment_details?.channel_name || (order.payment_channel_code ? order.payment_channel_code.toUpperCase() : 'VA BANK');

    return (
        <>
            <Head title={`Pembayaran #${order.order_number} - Smart Canteen FEB`} />

            {/* SUCCESS TOAST OVERLAY */}
            {showSuccessToast && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card border border-emerald-500/30 p-6 rounded-3xl shadow-2xl text-center space-y-3 max-w-xs animate-in zoom-in-95 duration-200">
                        <div className="size-16 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
                            <CheckCircle2 className="size-9 animate-bounce" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-black text-foreground">Pembayaran Berhasil! 🚀</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Hore! Pesananmu telah dikonfirmasi dan sedang dikirim ke dapur.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full space-y-4 pb-28 pt-1 font-sans">
                {/* Header Navbar */}
                <div className="flex items-center justify-between px-1 py-1">
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
                                Pembayaran Pesanan
                            </h1>
                            <span className="text-[10px] text-muted-foreground font-mono">
                                #{order.order_number}
                            </span>
                        </div>
                    </div>

                    {!isExpired ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full font-mono text-xs font-black shadow-2xs animate-pulse">
                            <Timer className="size-3.5" />
                            <span>{formattedTime}</span>
                        </div>
                    ) : (
                        <Badge variant="destructive" className="text-[10px] font-black px-2.5 py-0.5 rounded-full">
                            Kadaluarsa
                        </Badge>
                    )}
                </div>

                {/* COUNTDOWN TIMER / EXPIRED HERO BANNER */}
                {!isExpired ? (
                    <div className="relative overflow-hidden p-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/25 space-y-2 shadow-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
                                    <Clock className="size-4 animate-spin-slow" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-xs font-black text-foreground">
                                        Batas Waktu Pembayaran ({maxMinutes} Mnt)
                                    </h3>
                                    <p className="text-[10.5px] text-muted-foreground leading-none">
                                        Selesaikan pembayaran sebelum waktu habis
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-xl font-black font-mono text-primary tracking-tight">
                                    {formattedTime}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-1000 ease-linear rounded-full"
                                style={{ width: `${Math.min(100, (remainingSeconds / (maxMinutes * 60)) * 100)}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    /* EXPIRED STATE BANNER */
                    <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3 shadow-sm">
                        <div className="size-12 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30 shadow-inner">
                            <AlertTriangle className="size-6 animate-bounce" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-base font-black text-rose-700 dark:text-rose-400">
                                Waktu Pembayaran Expired!
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                Batas waktu {maxMinutes} menit pembayaran telah habis. Pesanan ini otomatis dibatalkan oleh sistem.
                            </p>
                        </div>
                    </div>
                )}

                {/* STAND INFO & PICKUP CODE */}
                <div className="p-3.5 bg-card rounded-2xl border border-border/70 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Store className="size-4.5" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] text-muted-foreground block font-bold">
                                Stand Kantin FEB:
                            </span>
                            <span className="text-xs font-black text-foreground block">
                                {order.tenant?.name || 'Mitra Stand Kantin'}
                            </span>
                        </div>
                    </div>

                    <div className="text-right bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl">
                        <span className="text-[9px] uppercase font-bold text-muted-foreground block tracking-wider">
                            Kode Pickup
                        </span>
                        <span className="text-xs font-black font-mono text-primary">
                            {order.pickup_code}
                        </span>
                    </div>
                </div>

                {/* QRIS PAYMENT SECTION (ONLY IF NOT EXPIRED) */}
                {!isExpired && isQris && (
                    <div className="p-5 bg-card rounded-3xl border border-border/80 text-center space-y-4 shadow-sm relative overflow-hidden">
                        {/* Gen-Z Accent Glow Background */}
                        <div className="absolute -top-12 -right-12 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="space-y-1 relative z-10">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3.5 py-1 rounded-full border border-emerald-500/20 text-xs font-extrabold">
                                <QrCode className="size-3.5" />
                                <span>Scan QRIS Instant</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Scan QR di bawah menggunakan e-wallet atau mobile banking kamu
                            </p>
                        </div>

                        {/* Tight QR Frame */}
                        <div className="p-2 bg-white rounded-2xl border border-slate-200/90 inline-block shadow-md relative z-10">
                            <img
                                src={qrUrl}
                                alt="QRIS Code"
                                className="size-52 mx-auto object-contain rounded-xl select-none"
                            />
                        </div>

                        {/* Supported Payments Subtitle */}
                        <div className="text-muted-foreground font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 relative z-10">
                            <Sparkles className="size-3 text-emerald-500" />
                            <span>GoPay • OVO • ShopeePay • DANA • BCA</span>
                        </div>

                        {/* Action Buttons: Download & Copy QR */}
                        <div className="flex items-center justify-center gap-2 relative z-10 pt-1">
                            <a
                                href={qrUrl}
                                target="_blank"
                                rel="noreferrer"
                                download={`QRIS-${order.order_number}.png`}
                                className="h-8 px-3.5 rounded-xl bg-muted/70 hover:bg-muted text-[11px] font-bold flex items-center gap-1.5 border border-border/70 transition-all text-foreground shadow-2xs active:scale-95"
                            >
                                <Download className="size-3.5 text-primary" />
                                <span>Simpan Gambar QR</span>
                            </a>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopy(qrUrl, 'qr_link')}
                                className="h-8 px-3.5 rounded-xl text-[11px] font-bold gap-1.5 border-border/70 shadow-2xs active:scale-95"
                            >
                                {copiedText === 'qr_link' ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                                <span>{copiedText === 'qr_link' ? 'Tersalin' : 'Salin Text QR'}</span>
                            </Button>
                        </div>

                        {/* Exact Amount Display */}
                        <div className="bg-muted/50 p-3.5 rounded-2xl border border-border/70 text-center space-y-1 relative z-10">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block font-bold">
                                Total Nominal Pembayaran
                            </span>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl font-black font-mono text-primary tracking-tight">
                                    Rp{order.total_amount.toLocaleString('id-ID')}
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCopy(String(order.total_amount), 'total')}
                                    className="h-7 px-2.5 text-[10px] font-bold gap-1 rounded-lg border-border shadow-2xs hover:bg-muted"
                                >
                                    {copiedText === 'total' ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                                    <span>{copiedText === 'total' ? 'Tersalin' : 'Salin'}</span>
                                </Button>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="text-left bg-muted/30 p-3.5 rounded-2xl border border-border/50 space-y-1.5 relative z-10">
                            <span className="text-xs font-black text-foreground block flex items-center gap-1.5">
                                <Info className="size-3.5 text-primary" />
                                <span>Petunjuk Pembayaran:</span>
                            </span>
                            <ol className="list-decimal list-inside text-[11px] text-muted-foreground space-y-1 leading-relaxed">
                                <li>Buka aplikasi e-wallet (GoPay, OVO, ShopeePay, DANA) atau Mobile Banking.</li>
                                <li>Pilih menu <strong>Scan QR / Bayar</strong>.</li>
                                <li>Arahkan kamera ke Kode QRIS di atas.</li>
                                <li>Periksa nominal Rp{order.total_amount.toLocaleString('id-ID')} dan konfirmasi pembayaran.</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* VIRTUAL ACCOUNT PAYMENT SECTION (ONLY IF NOT EXPIRED) */}
                {!isExpired && isVa && (
                    <div className="p-5 bg-card rounded-3xl border border-border/80 text-center space-y-4 shadow-sm">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3.5 py-1 rounded-full border border-blue-500/20 text-xs font-extrabold">
                                <Building2 className="size-3.5" />
                                <span>Virtual Account ({channelName})</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Transfer sesuai nominal ke nomor Virtual Account di bawah
                            </p>
                        </div>

                        {/* VA Number Card */}
                        <div className="p-4 bg-muted/60 rounded-2xl border border-border/80 space-y-1.5 text-left">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block font-bold">
                                Nomor Virtual Account:
                            </span>
                            <div className="flex items-center justify-between gap-2 bg-card p-3 rounded-xl border border-border font-mono overflow-hidden">
                                <span className="text-xs sm:text-sm md:text-base font-black tracking-tight text-foreground select-all whitespace-nowrap min-w-0 overflow-x-auto scrollbar-none py-0.5">
                                    {vaNumber}
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCopy(vaNumber, 'va')}
                                    className="h-8 px-2.5 sm:px-3 text-xs font-bold gap-1 rounded-xl border-border shadow-2xs shrink-0"
                                >
                                    {copiedText === 'va' ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                                    <span>{copiedText === 'va' ? 'Tersalin' : 'Salin'}</span>
                                </Button>
                            </div>
                        </div>

                        {/* Exact Amount Display */}
                        <div className="bg-muted/50 p-3.5 rounded-2xl border border-border/70 text-left space-y-1">
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block font-bold">
                                Total Transfer Tepat
                            </span>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xl font-black font-mono text-primary min-w-0 truncate">
                                    Rp{order.total_amount.toLocaleString('id-ID')}
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopy(String(order.total_amount), 'total')}
                                    className="h-8 px-2.5 text-xs font-bold gap-1 shrink-0"
                                >
                                    {copiedText === 'total' ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                                    <span>{copiedText === 'total' ? 'Tersalin' : 'Salin Total'}</span>
                                </Button>
                            </div>
                        </div>

                        {/* Step-by-step Instructions */}
                        <div className="text-left bg-muted/30 p-3.5 rounded-2xl border border-border/50 space-y-1.5">
                            <span className="text-xs font-black text-foreground block flex items-center gap-1.5">
                                <Info className="size-3.5 text-primary" />
                                <span>Petunjuk Transfer VA:</span>
                            </span>
                            <ol className="list-decimal list-inside text-[11px] text-muted-foreground space-y-1 leading-relaxed">
                                <li>Buka aplikasi Mobile Banking / ATM bank kamu.</li>
                                <li>Pilih menu <strong>Transfer &gt; Virtual Account</strong>.</li>
                                <li>Masukkan nomor Virtual Account: <strong className="break-all">{vaNumber}</strong>.</li>
                                <li>Periksa nominal Rp{order.total_amount.toLocaleString('id-ID')} dan selesaikan transfer.</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* CASH PAYMENT SECTION */}
                {!isExpired && isCash && (
                    <div className="p-5 bg-card rounded-3xl border border-border/80 text-center space-y-4 shadow-sm">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3.5 py-1 rounded-full border border-emerald-500/20 text-xs font-extrabold">
                                <Banknote className="size-3.5" />
                                <span>Bayar Tunai di Kasir</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Lakukan pembayaran tunai saat mengambil makanan di kasir stand
                            </p>
                        </div>

                        <div className="p-4 bg-muted/60 rounded-2xl border border-border/80 text-left space-y-2">
                            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                <span className="text-xs text-muted-foreground font-bold">Stand Kantin:</span>
                                <span className="text-xs font-black text-foreground">{order.tenant?.name}</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                <span className="text-xs text-muted-foreground font-bold">Kode Pickup:</span>
                                <span className="text-sm font-mono font-black text-primary">{order.pickup_code}</span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <span className="text-xs text-muted-foreground font-bold">Total Tagihan Tunai:</span>
                                <span className="text-base font-mono font-black text-foreground">
                                    Rp{order.total_amount.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDER ITEM SUMMARY CARD */}
                <div className="bg-card rounded-2xl border border-border/70 p-4 space-y-3 shadow-2xs">
                    <h3 className="text-xs font-black text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <Receipt className="size-4 text-primary" />
                        <span>Rincian Pesanan #{order.order_number}</span>
                    </h3>

                    <div className="space-y-2.5">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-start justify-between text-xs border-b border-border/30 pb-2 last:border-0 last:pb-0">
                                <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                                        <span className="text-primary font-mono">{(item.quantity || item.qty)}x</span>
                                        <span className="truncate">{item.menu_name || item.name}</span>
                                    </div>
                                    {item.options && (
                                        <p className="text-[10px] text-muted-foreground">
                                            {Array.isArray(item.options)
                                                ? item.options.join(', ')
                                                : Object.values(item.options).map((opt) => (opt as { name: string }).name).join(', ')}
                                        </p>
                                    )}
                                    {item.note && (
                                        <p className="text-[10px] text-amber-600 italic">
                                            Catatan: {item.note}
                                        </p>
                                    )}
                                </div>
                                <span className="font-mono font-bold text-foreground shrink-0">
                                    Rp{(item.subtotal ?? item.price * (item.quantity || item.qty || 1)).toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>

                    <OrderSummaryCard
                        subtotalAmount={order.subtotal_amount}
                        appFee={order.app_fee}
                        channelFee={order.channel_fee}
                        totalAmount={order.total_amount}
                    />
                </div>

                {/* STICKY BOTTOM ACTION FOOTER */}
                <div className="fixed bottom-3 z-50 w-full max-w-[430px] left-1/2 -translate-x-1/2 px-3 pointer-events-none">
                    <div className="pointer-events-auto bg-card/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 h-16 rounded-3xl p-3 flex items-center justify-between gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/')}
                            className="h-11 px-4 text-xs font-bold rounded-2xl border-border hover:bg-muted active:scale-95 transition-all"
                        >
                            <span>Ke Katalog</span>
                        </Button>

                        {!isExpired ? (
                            <Button
                                type="button"
                                onClick={() => router.visit('/orders')}
                                className="h-11 flex-1 text-xs font-black rounded-2xl gap-1.5 shadow-md active:scale-95 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <CheckCircle2 className="size-4" />
                                <span>Saya Sudah Bayar / Cek Status</span>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => router.visit('/')}
                                className="h-11 flex-1 text-xs font-black rounded-2xl gap-1.5 shadow-md active:scale-95 transition-all bg-rose-600 text-white hover:bg-rose-700"
                            >
                                <RefreshCw className="size-4" />
                                <span>Pesan Ulang Makanan</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

OrderPayment.layout = (page: React.ReactNode) => <StudentLayout showBottomNav={false}>{page}</StudentLayout>;
