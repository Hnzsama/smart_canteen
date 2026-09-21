import React from 'react';
import { Store } from 'lucide-react';

interface PickupQrCardProps {
    tenantName: string;
    tenantLocation: string;
    pickupCode: string;
    qrMd5?: string;
    orderNumber: string;
}

export function PickupQrCard({
    tenantName,
    tenantLocation,
    pickupCode,
    qrMd5,
    orderNumber,
}: PickupQrCardProps) {
    const md5Hash = qrMd5 || `order_${orderNumber}_${pickupCode}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(md5Hash)}`;

    return (
        <div className="p-4 bg-card rounded-3xl border border-border/80 text-center space-y-3.5 shadow-2xs relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 border-b border-border/40 pb-2.5 text-left">
                <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                    <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Store className="size-4" />
                    </div>
                    <h3 className="text-xs font-black text-foreground truncate max-w-[200px]">
                        {tenantName}
                    </h3>
                </div>
                <span className="text-[10.5px] text-muted-foreground font-mono shrink-0">
                    {tenantLocation}
                </span>
            </div>

            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block font-bold">
                Tiket QR Pickup (Tunjukkan Ke Kasir)
            </span>

            <div className="p-3 bg-white rounded-2xl border border-slate-200 inline-block mx-auto shadow-md">
                <img
                    src={qrUrl}
                    alt="QR Code Pickup Hash"
                    className="size-48 mx-auto object-contain rounded-lg select-none"
                />
            </div>

            <div className="space-y-2 pt-0.5 max-w-xs mx-auto">
                <div className="inline-flex items-center gap-1.5 bg-muted/60 px-3 py-1 rounded-full border border-border/60 text-[10px] font-mono text-muted-foreground shadow-2xs">
                    <span className="font-extrabold text-foreground">MD5:</span>
                    <span className="font-bold text-primary tracking-tight select-all">{md5Hash}</span>
                </div>

                <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-2xl space-y-0.5">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
                        Kode Pickup Manual
                    </span>
                    <span className="text-xl font-black font-mono text-primary tracking-widest block">
                        {pickupCode}
                    </span>
                </div>
            </div>
        </div>
    );
}
