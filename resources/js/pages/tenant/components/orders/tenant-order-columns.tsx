import type { ColumnDef } from '@tanstack/react-table';
import {
    CheckCircle2,
    Clock,
    CreditCard,
    Eye,
    RefreshCw,
    ShoppingBag,
    Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TenantOrderDetailItem } from '../../types';

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

export function getTenantOrderColumns(
    onSelectOrder: (order: TenantOrderDetailItem) => void
): ColumnDef<TenantOrderDetailItem>[] {
    return [
        {
            accessorKey: 'pickup_code',
            header: 'Kode Pickup',
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-mono font-bold text-sm tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block w-fit">
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
                    <span className="font-semibold text-foreground text-sm">{row.original.customer_name}</span>
                    {row.original.customer_phone && (
                        <span className="text-xs text-muted-foreground">{row.original.customer_phone}</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'items_summary',
            header: 'Menu Pesanan',
            cell: ({ row }) => {
                const summary =
                    row.original.items_summary ||
                    (row.original.items && row.original.items.length > 0
                        ? row.original.items.map((it: { name: string; quantity: number }) => `${it.name} x${it.quantity}`).join(', ')
                        : `${row.original.items_count || 0} item`);

                return (
                    <div className="max-w-[280px] text-xs text-foreground font-medium truncate">
                        {summary}
                    </div>
                );
            },
        },
        {
            accessorKey: 'subtotal_amount',
            header: () => (
                <div className="flex flex-col">
                    <span className="font-semibold text-foreground">Pendapatan Stand</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Bersih & Rincian Fee</span>
                </div>
            ),
            cell: ({ row }) => {
                const subtotal = row.original.subtotal_amount ?? row.original.total_amount;
                const total = row.original.total_amount;
                const appFee = row.original.app_fee ?? 0;
                const channelFee = row.original.channel_fee ?? 0;
                const hasFee = appFee > 0 || channelFee > 0;

                return (
                    <div className="flex flex-col items-start gap-1 py-1">
                        {/* Pendapatan Bersih Hak Stand */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold tracking-tight text-emerald-500 dark:text-emerald-400 tabular-nums">
                                {formatCurrency(subtotal)}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 leading-none">
                                Bersih
                            </span>
                        </div>

                        {/* Total Tagihan Pembeli */}
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <span>Total Bayar:</span>
                            <span className="font-semibold text-foreground/90 tabular-nums">
                                {formatCurrency(total)}
                            </span>
                        </div>

                        {/* Rincian Potongan Biaya (Micro-Chip) */}
                        {hasFee ? (
                            <div className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground/80 bg-muted/40 dark:bg-muted/30 px-1.5 py-0.5 rounded border border-border/50 w-fit">
                                {appFee > 0 && <span>App: {formatCurrency(appFee)}</span>}
                                {appFee > 0 && channelFee > 0 && <span className="text-muted-foreground/40">•</span>}
                                {channelFee > 0 && <span>PG: {formatCurrency(channelFee)}</span>}
                            </div>
                        ) : (
                            <span className="text-[10px] text-muted-foreground/60 italic">
                                Tanpa potongan fee
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'payment_method',
            header: 'Pembayaran',
            cell: ({ row }) => (
                <div className="flex flex-col items-start gap-1">
                    <Badge variant="outline" className="text-[11px] gap-1">
                        {row.original.payment_method === 'cash' ? <Wallet className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                        {row.original.payment_method_label}
                    </Badge>
                    <span className={`text-[10px] font-medium ${row.original.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {row.original.payment_status_label}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status Dapur',
            cell: ({ row }) => {
                const st = row.original.status;
                return (
                    <Badge
                        variant="secondary"
                        className={`gap-1 ${
                            st === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : st === 'ready'
                                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                : st === 'processing'
                                ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        }`}
                    >
                        {st === 'processing' && <RefreshCw className="h-3 w-3 animate-spin" />}
                        {st === 'ready' && <ShoppingBag className="h-3 w-3" />}
                        {st === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                        {st === 'pending' && <Clock className="h-3 w-3" />}
                        {row.original.status_label}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectOrder(row.original)}
                    className="h-8 gap-1 text-xs"
                >
                    <Eye className="h-3.5 w-3.5" />
                    Detail
                </Button>
            ),
        },
    ];
}
