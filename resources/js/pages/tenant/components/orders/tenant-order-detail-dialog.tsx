import {
    CheckCircle2,
    ChefHat,
    Clock,
    CreditCard,
    Info,
    Phone,
    RefreshCw,
    ShoppingBag,
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
import type { TenantOrderDetailItem, TenantOrderItemDetail } from '../../types';

export type { TenantOrderDetailItem, TenantOrderItemDetail };

type Props = {
    order: TenantOrderDetailItem | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (orderId: number, status: TenantOrderDetailItem['status']) => void;
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

export function TenantOrderDetailDialog({
    order,
    isOpen,
    onClose,
    onUpdateStatus,
}: Props) {
    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between pr-4">
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-lg bg-primary/10 text-primary px-2.5 py-0.5 rounded-lg">
                                {order.pickup_code}
                            </span>
                            <div>
                                <DialogTitle className="text-base font-bold">
                                    Pesanan #{order.order_number}
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                    Dibuat: {order.created_at}
                                </DialogDescription>
                            </div>
                        </div>
                        <Badge
                            variant="secondary"
                            className={`text-xs gap-1 ${
                                order.status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                    : order.status === 'ready'
                                    ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                    : order.status === 'processing'
                                    ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            }`}
                        >
                            {order.status_label}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-2 text-xs sm:text-sm">
                    {/* Customer & Payment Info */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
                        <div className="space-y-1">
                            <span className="text-muted-foreground text-[11px] font-semibold flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                Pemesan
                            </span>
                            <div className="font-bold text-foreground">{order.customer_name}</div>
                            {order.customer_phone && (
                                <div className="text-muted-foreground text-xs flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {order.customer_phone}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <span className="text-muted-foreground text-[11px] font-semibold flex items-center gap-1">
                                {order.payment_method === 'cash' ? (
                                    <Wallet className="h-3.5 w-3.5" />
                                ) : (
                                    <CreditCard className="h-3.5 w-3.5" />
                                )}
                                Pembayaran
                            </span>
                            <div className="font-medium text-foreground">
                                {order.payment_method_label}
                            </div>
                            <div
                                className={`text-xs font-semibold ${
                                    order.payment_status === 'paid'
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                {order.payment_status_label}
                            </div>
                        </div>
                    </div>

                    {/* Order Items Breakdown */}
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                            Rincian Menu ({order.items?.length || order.items_count || 0})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((it) => (
                                    <div
                                        key={it.id}
                                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/50 bg-card"
                                    >
                                        <div>
                                            <div className="font-semibold text-foreground">
                                                {it.name} <span className="text-muted-foreground text-xs">x{it.quantity}</span>
                                            </div>
                                            {it.notes && (
                                                <div className="text-xs italic text-muted-foreground">
                                                    Catatan: {it.notes}
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-mono font-semibold text-foreground">
                                            {formatCurrency(it.subtotal || it.price * it.quantity)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-muted-foreground font-medium rounded-lg border border-border/50 bg-card">
                                    {order.items_summary || 'Rincian menu tidak tersedia'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cost Breakdown & Revenue Transparency */}
                    <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-border/50">
                            <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                Rincian Pembayaran & Pendapatan
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Transparan
                            </span>
                        </div>

                        {/* Stand Clean Revenue */}
                        <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div>
                                <div className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                                    Pendapatan Bersih Stand (Subtotal)
                                </div>
                                <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                                    Hak penjual murni dari penjualan menu
                                </div>
                            </div>
                            <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-300">
                                {formatCurrency(order.subtotal_amount ?? (order.total_amount - (order.app_fee || 0) - (order.channel_fee || 0)))}
                            </span>
                        </div>

                        {/* Platform Fee */}
                        <div className="flex items-center justify-between px-2.5 text-xs text-muted-foreground">
                            <div>
                                <span className="font-medium text-foreground">Biaya Layanan Aplikasi:</span>
                                <span className="text-[10px] text-muted-foreground ml-1">(Operasional Sistem Canteen FEB)</span>
                            </div>
                            <span className="font-mono font-medium text-foreground">
                                {order.app_fee && order.app_fee > 0 ? `+ ${formatCurrency(order.app_fee)}` : 'Rp 0'}
                            </span>
                        </div>

                        {/* Payment Gateway Fee */}
                        <div className="flex items-center justify-between px-2.5 text-xs text-muted-foreground">
                            <div>
                                <span className="font-medium text-foreground">Biaya Payment Gateway:</span>
                                <span className="text-[10px] text-muted-foreground ml-1">
                                    {order.payment_method === 'cash' ? '(Tunai Kasir)' : '(Midtrans VA / QRIS)'}
                                </span>
                            </div>
                            <span className="font-mono font-medium text-foreground">
                                {order.channel_fee && order.channel_fee > 0 ? `+ ${formatCurrency(order.channel_fee)}` : 'Rp 0'}
                            </span>
                        </div>

                        {/* Total Billed to Customer */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/60 px-2.5">
                            <div>
                                <div className="font-bold text-xs text-foreground">Total Tagihan Mahasiswa:</div>
                                <div className="text-[10px] text-muted-foreground">Nominal yang dibayar oleh pemesan</div>
                            </div>
                            <span className="font-mono font-black text-base text-primary">
                                {formatCurrency(order.total_amount)}
                            </span>
                        </div>

                        <div className="flex items-start gap-1.5 p-2 rounded-lg bg-muted/40 border border-border/40 text-[11px] text-muted-foreground leading-relaxed">
                            <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span>
                                Uang yang menjadi hak stand adalah <strong>{formatCurrency(order.subtotal_amount ?? (order.total_amount - (order.app_fee || 0) - (order.channel_fee || 0)))}</strong>. Biaya layanan dan payment gateway ditagihkan ke mahasiswa untuk operasional server & transaksi switching.
                            </span>
                        </div>
                    </div>

                    {order.notes && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                            <span className="font-bold text-amber-700 dark:text-amber-400">Catatan Pesanan:</span>{' '}
                            <span className="text-muted-foreground">{order.notes}</span>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/50">
                    <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                        <X className="h-3.5 w-3.5 mr-1" /> Tutup
                    </Button>

                    {order.status === 'pending' && (
                        <Button
                            size="sm"
                            onClick={() => onUpdateStatus(order.id, 'processing')}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5"
                        >
                            <ChefHat className="h-3.5 w-3.5" />
                            Mulai Masak (Processing)
                        </Button>
                    )}

                    {order.status === 'processing' && (
                        <Button
                            size="sm"
                            onClick={() => onUpdateStatus(order.id, 'ready')}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
                        >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Tandai Siap Pickup (Ready)
                        </Button>
                    )}

                    {order.status === 'ready' && (
                        <Button
                            size="sm"
                            onClick={() => onUpdateStatus(order.id, 'completed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Pesanan Diambil (Selesai)
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
