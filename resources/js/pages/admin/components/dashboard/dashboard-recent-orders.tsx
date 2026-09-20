import { useMemo } from 'react';
import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpRight,
    CheckCircle2,
    Clock,
    CreditCard,
    Receipt,
    RefreshCw,
    Store,
    Wallet,
    XCircle,
} from 'lucide-react';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { orders as adminOrders } from '@/routes/admin';
import type { DashboardRecentOrder } from '../../types';

type Props = {
    recentOrders: DashboardRecentOrder[];
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

const getStatusBadge = (status: string, label: string) => {
    switch (status) {
        case 'completed':
            return (
                <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    {label}
                </Badge>
            );
        case 'ready':
            return (
                <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    <Store className="h-3 w-3" />
                    {label}
                </Badge>
            );
        case 'processing':
            return (
                <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    {label}
                </Badge>
            );
        case 'paid':
            return (
                <Badge variant="secondary" className="gap-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                    <CreditCard className="h-3 w-3" />
                    {label}
                </Badge>
            );
        case 'failed':
            return (
                <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {label}
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {label}
                </Badge>
            );
    }
};

export function DashboardRecentOrders({ recentOrders }: Props) {
    const columns = useMemo<ColumnDef<DashboardRecentOrder>[]>(
        () => [
            {
                accessorKey: 'order_number',
                header: 'No. Pesanan',
                cell: ({ row }) => (
                    <span className="font-mono text-xs font-semibold text-foreground">
                        {row.getValue('order_number')}
                    </span>
                ),
            },
            {
                accessorKey: 'pickup_code',
                header: 'Kode Pickup',
                cell: ({ row }) => (
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">
                        {row.getValue('pickup_code')}
                    </span>
                ),
            },
            {
                accessorKey: 'customer_name',
                header: 'Pelanggan',
                cell: ({ row }) => (
                    <span className="font-medium text-foreground">
                        {row.getValue('customer_name')}
                    </span>
                ),
            },
            {
                accessorKey: 'tenant_name',
                header: 'Stand Kantin',
                cell: ({ row }) => (
                    <span className="text-muted-foreground text-xs font-medium">
                        {row.getValue('tenant_name')}
                    </span>
                ),
            },
            {
                accessorKey: 'total_amount',
                header: 'Total',
                cell: ({ row }) => (
                    <span className="font-bold text-foreground font-mono">
                        {formatCurrency(Number(row.getValue('total_amount')))}
                    </span>
                ),
            },
            {
                accessorKey: 'payment_method_label',
                header: 'Metode Bayar',
                cell: ({ row }) => {
                    const isCashless = row.original.payment_method === 'cashless';
                    return (
                        <Badge variant="outline" className="gap-1 text-xs">
                            {isCashless ? (
                                <CreditCard className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                                <Wallet className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                            )}
                            {row.original.payment_method_label}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'payment_status',
                header: 'Status Bayar',
                cell: ({ row }) => {
                    const status = row.original.payment_status;
                    return (
                        <Badge
                            className={`text-[11px] py-0 ${
                                status === 'paid'
                                    ? 'bg-emerald-600 text-white'
                                    : status === 'failed'
                                      ? 'bg-destructive text-white'
                                      : 'border-amber-400 bg-amber-500/15 text-amber-700 dark:text-amber-400'
                            }`}
                        >
                            {row.original.payment_status_label}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status Pesanan',
                cell: ({ row }) => getStatusBadge(row.original.status, row.original.status_label),
            },
        ],
        []
    );

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    <div>
                        <h2 className="text-base font-bold tracking-tight text-foreground">
                            Transaksi Pesanan Terbaru
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Feed transaksi pemesanan kantin terkini yang terhubung dengan kasir dan sistem pembayaran
                        </p>
                    </div>
                </div>

                <Link
                    href={adminOrders.url()}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                    Lihat Semua Transaksi
                    <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={recentOrders}
                emptyMessage="Belum ada transaksi di kantin untuk filter ini."
            />
        </div>
    );
}
