import React from 'react';
import { Receipt } from 'lucide-react';

interface OrderSummaryCardProps {
    subtotalAmount: number;
    appFee: number;
    channelFee: number;
    totalAmount: number;
}

export function OrderSummaryCard({
    subtotalAmount,
    appFee,
    channelFee,
    totalAmount,
}: OrderSummaryCardProps) {
    return (
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
                <Receipt className="size-4 text-primary shrink-0" />
                <h3 className="text-xs font-black text-foreground">Rincian Pembayaran</h3>
            </div>

            <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal Makanan</span>
                    <span className="font-mono text-foreground font-semibold">
                        Rp{subtotalAmount.toLocaleString('id-ID')}
                    </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                    <span>Biaya Layanan Aplikasi</span>
                    <span className="font-mono text-foreground font-semibold">
                        Rp{appFee.toLocaleString('id-ID')}
                    </span>
                </div>

                {channelFee > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                        <span>Biaya Penanganan Pembayaran</span>
                        <span className="font-mono text-foreground font-semibold">
                            Rp{channelFee.toLocaleString('id-ID')}
                        </span>
                    </div>
                )}

                <div className="border-t border-border/60 pt-2.5 flex justify-between items-center">
                    <span className="font-bold text-foreground">Total Pembayaran</span>
                    <span className="font-mono font-black text-sm text-primary">
                        Rp{totalAmount.toLocaleString('id-ID')}
                    </span>
                </div>
            </div>
        </div>
    );
}
