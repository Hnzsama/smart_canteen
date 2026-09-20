import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    CheckCircle2,
    Loader2,
    QrCode,
    Search,
    User,
    Wallet,
    X,
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { confirmCash as confirmCashRoute } from '@/routes/tenant/orders';
import type { TenantOrderDetailItem } from '../../types';

type Props = {
    order: TenantOrderDetailItem | null;
    orders?: TenantOrderDetailItem[];
    isOpen: boolean;
    onClose: () => void;
    onSelectOrder?: (order: TenantOrderDetailItem) => void;
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

export function VerifyPaymentDialog({
    order,
    orders = [],
    isOpen,
    onClose,
    onSelectOrder,
}: Props) {
    const [lookupCode, setLookupCode] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [lookupError, setLookupError] = useState<string | null>(null);

    const activeOrder = order;

    const handleLookup = (e: React.FormEvent) => {
        e.preventDefault();
        setLookupError(null);
        const code = lookupCode.trim().toUpperCase();

        if (!code) {
            setLookupError('Silakan masukkan atau scan kode pickup (cth: FEB-1047).');
            return;
        }

        const found = orders.find(
            (o) =>
                o.pickup_code.toUpperCase() === code ||
                o.order_number.toUpperCase() === code
        );

        if (found) {
            onSelectOrder?.(found);
            setLookupCode('');
        } else {
            setLookupError(`Pesanan dengan kode "${code}" tidak ditemukan pada daftar kasir tunai.`);
        }
    };

    const handleConfirmPayment = () => {
        if (!activeOrder) return;

        setIsConfirming(true);
        router.post(
            confirmCashRoute({ order: activeOrder.id }).url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsConfirming(false);
                    onClose();
                },
                onError: () => {
                    setIsConfirming(false);
                },
                onFinish: () => {
                    setIsConfirming(false);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <QrCode className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold">
                                Verifikasi Kasir & Scan Pembayaran Tunai
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Ketik kode pickup mahasiswa atau scan QR Pass untuk konfirmasi terima tunai.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Quick Code Lookup Form */}
                    <form onSubmit={handleLookup} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ketik / Scan Kode (cth: FEB-1047)..."
                                value={lookupCode}
                                onChange={(e) => {
                                    setLookupCode(e.target.value);
                                    if (lookupError) setLookupError(null);
                                }}
                                className="pl-9 text-xs font-mono uppercase"
                            />
                        </div>
                        <Button type="submit" size="sm" variant="secondary" className="text-xs font-semibold">
                            Cari Pesanan
                        </Button>
                    </form>

                    {lookupError && (
                        <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium">
                            {lookupError}
                        </div>
                    )}

                    {/* Selected Order Billing Details */}
                    {activeOrder ? (
                        <div className="space-y-3 p-4 rounded-xl border border-border/70 bg-card">
                            <div className="flex items-center justify-between border-b border-border/50 pb-3">
                                <div className="space-y-0.5">
                                    <span className="font-mono font-black text-lg bg-primary/10 text-primary px-2.5 py-0.5 rounded-lg inline-block">
                                        {activeOrder.pickup_code}
                                    </span>
                                    <div className="text-[11px] text-muted-foreground font-mono">
                                        #{activeOrder.order_number}
                                    </div>
                                </div>

                                <Badge
                                    variant="secondary"
                                    className={`text-xs gap-1 ${
                                        activeOrder.payment_status === 'paid'
                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                    }`}
                                >
                                    {activeOrder.payment_status === 'paid' ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                        <Wallet className="h-3 w-3" />
                                    )}
                                    <span>
                                        {activeOrder.payment_status === 'paid' ? 'Lunas' : 'Belum Dibayar'}
                                    </span>
                                </Badge>
                            </div>

                            {/* Customer & Item list */}
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{activeOrder.customer_name}</span>
                                </div>

                                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 space-y-1">
                                    <div className="text-[11px] font-semibold text-muted-foreground uppercase">
                                        Rincian Pesanan
                                    </div>
                                    <div className="font-medium text-foreground">
                                        {activeOrder.items_summary || 'Rincian menu tidak tersedia'}
                                    </div>
                                </div>

                                {/* Large Total Cash Highlight */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                                        Total Wajib Bayar (Cash):
                                    </span>
                                    <span className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(activeOrder.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed text-center text-muted-foreground">
                            <QrCode className="h-10 w-10 mb-2 opacity-40" />
                            <p className="text-xs font-medium">
                                Pilih pesanan dari tabel atau ketik kode pickup mahasiswa di atas.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/50">
                    <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                        <X className="h-3.5 w-3.5 mr-1" /> Batal
                    </Button>

                    {activeOrder && activeOrder.payment_status !== 'paid' && (
                        <Button
                            size="sm"
                            disabled={isConfirming}
                            onClick={handleConfirmPayment}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 font-semibold"
                        >
                            {isConfirming ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            <span>Konfirmasi Terima Uang Tunai ({formatCurrency(activeOrder.total_amount)})</span>
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
