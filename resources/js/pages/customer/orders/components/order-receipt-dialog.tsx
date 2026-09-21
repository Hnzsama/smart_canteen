import React from 'react';
import { Printer, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { SuccessOrderData } from '../types';

interface OrderReceiptDialogProps {
    order: SuccessOrderData;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderReceiptDialog({
    order,
    isOpen,
    onClose,
}: OrderReceiptDialogProps) {
    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
                                    {item.choices && item.choices.length > 0 && (
                                        <span className="text-[9.5px] text-slate-500 block">
                                            {item.choices.join(', ')}
                                        </span>
                                    )}
                                </div>
                                <span className="font-mono font-bold text-slate-900 shrink-0">
                                    Rp{(item.subtotal ?? item.price * item.qty).toLocaleString('id-ID')}
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
                        onClick={onClose}
                        className="h-11 px-4 text-xs font-bold rounded-xl"
                    >
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
