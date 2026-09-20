import { useEffect, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { updateStatus as updateOrderStatus } from '@/routes/admin/orders';
import type { OrderItem } from '../../types';

type Props = {
    order: OrderItem | null;
    onClose: () => void;
};

export function OrderStatusDialog({ order, onClose }: Props) {
    const form = useForm({
        status: '',
        payment_status: '',
    });

    useEffect(() => {
        if (order) {
            form.setData({
                status: order.status,
                payment_status: order.payment_status,
            });
            form.clearErrors();
        }
    }, [order]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!order) return;

        form.patch(updateOrderStatus.url(order.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                form.reset();
            },
        });
    };

    return (
        <Dialog open={!!order} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md gap-5">
                <form onSubmit={submit}>
                    <DialogHeader className="gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20 shadow-xs">
                                <RefreshCw className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-foreground">
                                    Audit Status #{order?.order_number}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Perbarui status pesanan atau status pembayaran secara manual.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-status" className="text-xs font-semibold">
                                Status Alur Pesanan
                            </Label>
                            <Select
                                value={form.data.status}
                                onValueChange={(val) => form.setData('status', val)}
                            >
                                <SelectTrigger id="edit-status" className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Pilih status alur pesanan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                                    <SelectItem value="paid">Dibayar (Menunggu Dikonfirmasi Stand)</SelectItem>
                                    <SelectItem value="processing">Sedang Diproses Stand</SelectItem>
                                    <SelectItem value="ready">Siap Diambil Mahasiswa</SelectItem>
                                    <SelectItem value="completed">Selesai (Sudah Diterima)</SelectItem>
                                    <SelectItem value="failed">Gagal / Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-payment-status" className="text-xs font-semibold">
                                Status Pembayaran
                            </Label>
                            <Select
                                value={form.data.payment_status}
                                onValueChange={(val) => form.setData('payment_status', val)}
                            >
                                <SelectTrigger id="edit-payment-status" className="h-9 w-full text-sm">
                                    <SelectValue placeholder="Pilih status pembayaran..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                                    <SelectItem value="paid">Lunas (Terbayar)</SelectItem>
                                    <SelectItem value="failed">Gagal / Ditolak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2 pt-1">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="w-full sm:w-auto font-semibold shadow-xs"
                        >
                            {form.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
