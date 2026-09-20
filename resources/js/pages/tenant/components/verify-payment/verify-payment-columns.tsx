import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, CreditCard, Eye, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TenantOrderDetailItem } from '../../types';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

export function getVerifyPaymentColumns(
    onSelectOrder: (order: TenantOrderDetailItem) => void
): ColumnDef<TenantOrderDetailItem>[] {
    return [
        {
            accessorKey: 'pickup_code',
            header: 'Kode Pickup',
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-mono font-black text-sm tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block w-fit">
                        {row.original.pickup_code}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                        #{row.original.order_number}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'customer_name',
            header: 'Pemesan',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-sm">
                        {row.original.customer_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {row.original.created_at}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'items_summary',
            header: 'Rincian Menu',
            cell: ({ row }) => (
                <div className="max-w-[280px] text-xs text-foreground font-medium truncate">
                    {row.original.items_summary || `${row.original.items_count || 0} item`}
                </div>
            ),
        },
        {
            accessorKey: 'total_amount',
            header: 'Tagihan Tunai',
            cell: ({ row }) => (
                <span className="font-mono font-black text-sm text-foreground">
                    {formatCurrency(row.original.total_amount)}
                </span>
            ),
        },
        {
            accessorKey: 'payment_status',
            header: 'Status Kasir',
            cell: ({ row }) => {
                const isPaid = row.original.payment_status === 'paid';
                return (
                    <Badge
                        variant="secondary"
                        className={`gap-1 ${
                            isPaid
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        }`}
                    >
                        {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Wallet className="h-3 w-3" />}
                        <span>{isPaid ? 'Lunas' : 'Belum Dibayar'}</span>
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const isPaid = row.original.payment_status === 'paid';
                return (
                    <Button
                        size="sm"
                        variant={isPaid ? 'outline' : 'default'}
                        onClick={() => onSelectOrder(row.original)}
                        className={`h-8 gap-1.5 text-xs font-semibold ${
                            !isPaid ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                        }`}
                    >
                        {isPaid ? <Eye className="h-3.5 w-3.5" /> : <Wallet className="h-3.5 w-3.5" />}
                        <span>{isPaid ? 'Lihat Detail' : 'Verifikasi Bayar Tunai'}</span>
                    </Button>
                );
            },
        },
    ];
}
