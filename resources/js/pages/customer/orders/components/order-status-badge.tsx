import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Banknote, CheckCircle2, Clock, CookingPot, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
    status: string;
    paymentStatus?: string;
    paymentMethod?: string;
    statusLabel?: string;
}

export function OrderStatusBadge({
    status,
    paymentStatus,
    paymentMethod,
    statusLabel,
}: OrderStatusBadgeProps) {
    if (paymentMethod !== 'cash' && paymentStatus === 'unpaid') {
        return (
            <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
            >
                <Clock className="size-3" />
                <span>Menunggu Pembayaran</span>
            </Badge>
        );
    }

    if (paymentMethod === 'cash' && paymentStatus === 'unpaid') {
        return (
            <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
            >
                <Banknote className="size-3" />
                <span>Bayar Tunai di Kasir</span>
            </Badge>
        );
    }

    if (status === 'ready') {
        return (
            <Badge
                variant="outline"
                className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse shrink-0"
            >
                <CheckCircle2 className="size-3" />
                <span>Siap Diambil!</span>
            </Badge>
        );
    }

    if (status === 'processing' || status === 'paid') {
        return (
            <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
            >
                <CookingPot className="size-3" />
                <span>Sedang Dimasak</span>
            </Badge>
        );
    }

    if (status === 'completed' || status === 'selesai') {
        return (
            <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
            >
                <CheckCircle2 className="size-3" />
                <span>Selesai</span>
            </Badge>
        );
    }

    if (status === 'cancelled' || status === 'failed' || status === 'expired') {
        return (
            <Badge
                variant="outline"
                className="bg-destructive/10 text-destructive border-destructive/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0"
            >
                <XCircle className="size-3" />
                <span>{statusLabel || 'Dibatalkan'}</span>
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0">
            {statusLabel || status}
        </Badge>
    );
}
