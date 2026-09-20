import { router } from '@inertiajs/react';
import { AlertTriangle, Receipt, Trash2 } from 'lucide-react';
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
import { destroy as destroyOrder } from '@/routes/admin/orders';
import type { OrderItem } from '../../types';

type Props = {
    order: OrderItem | null;
    onClose: () => void;
};

export function OrderDeleteDialog({ order, onClose }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    const handleDelete = () => {
        if (!order) return;

        router.delete(destroyOrder.url(order.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md gap-5">
                <DialogHeader className="gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive border border-destructive/20 shadow-xs">
                            <Trash2 className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">
                                Pindahkan Transaksi ke Sampah?
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Catatan transaksi akan diarsipkan ke tempat sampah.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Target Order Card */}
                {order && (
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-primary" />
                                <span className="font-mono font-bold text-sm text-foreground">
                                    {order.order_number}
                                </span>
                            </div>
                            <Badge variant="secondary" className="font-mono text-xs font-semibold">
                                {order.pickup_code}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                            <span>{order.customer_name} • {order.tenant_name}</span>
                            <span className="font-mono font-bold text-foreground">
                                {formatCurrency(order.total_amount)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Warning Callout Box with Lucide SVG icon */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-semibold text-amber-800 dark:text-amber-300">
                            Perhatian Audit Transaksi:
                        </p>
                        <p className="text-amber-700/90 dark:text-amber-200/80 leading-relaxed">
                            Tindakan ini disarankan hanya untuk transaksi fiktif atau pengujian sistem. Transaksi riil sebaiknya tetap tercatat untuk keakuratan laporan keuangan kantin.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2 pt-1">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        className="w-full sm:w-auto gap-1.5 shadow-xs font-semibold"
                    >
                        <Trash2 className="h-4 w-4" />
                        Ya, Pindahkan ke Sampah
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
