import { ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { OrderItem } from '../../types';

type Props = {
    order: OrderItem | null;
    onClose: () => void;
};

export function OrderReceiptDialog({ order, onClose }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg gap-5">
                <DialogHeader className="gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20 shadow-xs">
                            <ReceiptText className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">
                                Nota Transaksi #{order?.order_number}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Rincian pesanan menu kantin FEB oleh mahasiswa.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {order && (
                    <div className="space-y-4 text-sm">
                        {/* Pickup Code Banner */}
                        <div className="flex items-center justify-between rounded-xl bg-primary/10 p-3.5 border border-primary/20 shadow-xs">
                            <div>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Kode Antrian Pengambilan
                                </span>
                                <div className="text-2xl font-mono font-black text-primary tracking-wider mt-0.5">
                                    {order.pickup_code}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-muted-foreground font-medium">
                                    Metode Pembayaran
                                </span>
                                <div className="font-semibold text-foreground mt-0.5">
                                    {order.payment_method_label}
                                </div>
                            </div>
                        </div>

                        {/* Customer & Stand info */}
                        <div className="grid grid-cols-2 gap-3 text-xs border border-border/70 rounded-xl p-3.5 bg-muted/30">
                            <div>
                                <span className="text-muted-foreground font-medium">Pelanggan:</span>
                                <p className="font-semibold text-foreground mt-1 text-sm">
                                    {order.customer_name}
                                </p>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    {order.customer_email}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground font-medium">Mitra Stand:</span>
                                <p className="font-semibold text-foreground mt-1 text-sm">
                                    {order.tenant_name}
                                </p>
                                <p className="text-muted-foreground text-xs mt-0.5">
                                    Dipesan: {order.created_at}
                                </p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="rounded-xl border border-border/70 overflow-hidden shadow-xs">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-muted/50 font-semibold text-muted-foreground border-b border-border/70">
                                    <tr>
                                        <th className="p-2.5">Menu</th>
                                        <th className="p-2.5 text-center">Qty</th>
                                        <th className="p-2.5 text-right">Harga</th>
                                        <th className="p-2.5 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/30">
                                            <td className="p-2.5 font-medium text-foreground">
                                                {item.menu_name}
                                            </td>
                                            <td className="p-2.5 text-center font-mono font-semibold">
                                                {item.quantity}
                                            </td>
                                            <td className="p-2.5 text-right font-mono">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="p-2.5 text-right font-mono font-bold text-foreground">
                                                {formatCurrency(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-border/80 bg-muted/30 font-semibold">
                                    <tr>
                                        <td colSpan={3} className="p-2.5 text-right font-bold text-foreground">
                                            Total Pembayaran:
                                        </td>
                                        <td className="p-2.5 text-right text-sm font-mono font-black text-primary">
                                            {formatCurrency(order.total_amount)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Status Milestones Timeline */}
                        <div className="rounded-xl border border-border/70 p-3 bg-muted/20 text-xs text-muted-foreground space-y-1">
                            <div className="font-semibold text-foreground text-[11px] uppercase tracking-wider mb-1.5">
                                Riwayat Waktu Transaksi
                            </div>
                            <div className="flex justify-between">
                                <span>Dibuat:</span>
                                <span className="font-mono text-foreground">{order.created_at}</span>
                            </div>
                            {order.paid_at && (
                                <div className="flex justify-between">
                                    <span>Dibayar:</span>
                                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{order.paid_at}</span>
                                </div>
                            )}
                            {order.processing_at && (
                                <div className="flex justify-between">
                                    <span>Diproses Stand:</span>
                                    <span className="font-mono text-foreground">{order.processing_at}</span>
                                </div>
                            )}
                            {order.ready_at && (
                                <div className="flex justify-between">
                                    <span>Siap Diambil:</span>
                                    <span className="font-mono text-foreground">{order.ready_at}</span>
                                </div>
                            )}
                            {order.completed_at && (
                                <div className="flex justify-between">
                                    <span>Pesanan Selesai:</span>
                                    <span className="font-mono text-foreground">{order.completed_at}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter className="pt-1">
                    <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
