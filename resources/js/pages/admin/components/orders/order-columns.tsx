import type { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    CheckCircle2,
    Clock,
    CreditCard,
    Edit2,
    Eye,
    MoreHorizontal,
    Receipt,
    RefreshCw,
    Store,
    Trash2,
    Wallet,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { OrderItem } from '../../types';

interface GetOrderColumnsProps {
    onView: (order: OrderItem) => void;
    onEdit: (order: OrderItem) => void;
    onDelete: (order: OrderItem) => void;
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function getOrderStatusBadge(status: string, label: string) {
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
}

export function getPaymentStatusBadge(status: string, label: string) {
    switch (status) {
        case 'paid':
            return (
                <Badge className="bg-emerald-600 text-white text-[11px] py-0">
                    {label}
                </Badge>
            );
        case 'failed':
            return (
                <Badge variant="destructive" className="text-[11px] py-0">
                    {label}
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="border-amber-400 bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[11px] py-0">
                    {label}
                </Badge>
            );
    }
}

export function getOrderColumns({
    onView,
    onEdit,
    onDelete,
}: GetOrderColumnsProps): ColumnDef<OrderItem>[] {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <div className="px-1">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && 'indeterminate')
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Pilih semua baris"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Pilih baris"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'order_number',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span>No. Order & Pickup</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div>
                        <span className="font-mono font-bold text-foreground text-xs">
                            {order.order_number}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                            <span className="font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.2 rounded text-[11px]">
                                {order.pickup_code}
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                                • {order.created_at}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'customer_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span>Pelanggan</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div>
                        <div className="font-semibold text-foreground text-sm">
                            {order.customer_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {order.customer_email}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'tenant_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span>Mitra Stand</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                    <Store className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{row.original.tenant_name}</span>
                </div>
            ),
        },
        {
            accessorKey: 'total_amount',
            header: ({ column }) => (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        <span>Total & Item</span>
                        <ArrowUpDown className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div className="text-right">
                        <div className="font-mono font-bold text-foreground text-sm">
                            {formatCurrency(order.total_amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {order.items.length} menu
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'payment_method_label',
            header: 'Metode Bayar',
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <Badge variant="outline" className="gap-1 text-xs font-normal">
                        {order.payment_method === 'cashless' ? (
                            <CreditCard className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                            <Wallet className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        )}
                        {order.payment_method_label}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'payment_status',
            header: 'Status Bayar',
            cell: ({ row }) =>
                getPaymentStatusBadge(
                    row.original.payment_status,
                    row.original.payment_status_label
                ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 gap-1.5 font-bold hover:bg-muted/80 text-muted-foreground"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    <span>Status Alur</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) =>
                getOrderStatusBadge(
                    row.original.status,
                    row.original.status_label
                ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Aksi</div>,
            cell: ({ row }) => {
                const order = row.original;
                return (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => onView(order)}
                            title="Lihat nota struk"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="sr-only">Lihat</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    title="Opsi aksi lainnya"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu opsi</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs">
                                    Pilihan Transaksi
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => onView(order)}
                                    className="gap-2 text-xs"
                                >
                                    <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                                    Buka Struk Nota
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onEdit(order)}
                                    className="gap-2 text-xs"
                                >
                                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    Audit / Ubah Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="gap-2 text-xs text-destructive focus:text-destructive"
                                    onClick={() => onDelete(order)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Hapus ke Sampah
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];
}
