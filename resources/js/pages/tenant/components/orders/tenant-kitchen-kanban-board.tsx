import { CheckCircle2, ChefHat, Clock, Eye, RefreshCw, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TenantOrderDetailItem } from '../../types';

type Props = {
    orders: TenantOrderDetailItem[];
    onSelectOrder: (order: TenantOrderDetailItem) => void;
    onUpdateStatus: (orderId: number, status: TenantOrderDetailItem['status']) => void;
};

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

const columnsConfig: {
    key: TenantOrderDetailItem['status'];
    title: string;
    icon: any;
    badgeBg: string;
    borderColor: string;
    nextStatus?: TenantOrderDetailItem['status'];
    nextActionLabel?: string;
    nextActionIcon?: any;
    nextActionBg?: string;
}[] = [
    {
        key: 'pending',
        title: '1. Pesanan Baru (Pending)',
        icon: Clock,
        badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
        borderColor: 'border-amber-500/30',
        nextStatus: 'processing',
        nextActionLabel: 'Mulai Masak',
        nextActionIcon: ChefHat,
        nextActionBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    {
        key: 'processing',
        title: '2. Dimasak Dapur (Processing)',
        icon: RefreshCw,
        badgeBg: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
        borderColor: 'border-orange-500/30',
        nextStatus: 'ready',
        nextActionLabel: 'Siap Pickup',
        nextActionIcon: ShoppingBag,
        nextActionBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
        key: 'ready',
        title: '3. Siap Diambil (Ready)',
        icon: ShoppingBag,
        badgeBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
        borderColor: 'border-blue-500/30',
        nextStatus: 'completed',
        nextActionLabel: 'Diambil Mahasiswa',
        nextActionIcon: CheckCircle2,
        nextActionBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
        key: 'completed',
        title: '4. Selesai (Completed)',
        icon: CheckCircle2,
        badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        borderColor: 'border-emerald-500/30',
    },
];

export function TenantKitchenKanbanBoard({
    orders,
    onSelectOrder,
    onUpdateStatus,
}: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {columnsConfig.map((col) => {
                const IconComponent = col.icon;
                const columnOrders = orders.filter((o) => o.status === col.key);

                return (
                    <div
                        key={col.key}
                        className={`flex flex-col rounded-xl border ${col.borderColor} bg-card/60 p-3 shadow-xs min-h-[450px]`}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                                    {col.title}
                                </h3>
                            </div>
                            <Badge variant="secondary" className="font-mono text-xs font-bold">
                                {columnOrders.length}
                            </Badge>
                        </div>

                        {/* Order Cards Container with Shadcn ScrollArea */}
                        <ScrollArea className="h-[600px] mt-3 pr-2.5">
                            <div className="flex flex-col gap-3 pb-2">
                                {columnOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground text-xs italic">
                                        Tidak ada pesanan
                                    </div>
                                ) : (
                                    columnOrders.map((ord) => {
                                        const ActionIcon = col.nextActionIcon;
                                        return (
                                            <div
                                                key={ord.id}
                                                className="flex flex-col justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:shadow-md transition-all space-y-3"
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-mono font-black text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                                                            {ord.pickup_code}
                                                        </span>
                                                        <span className="font-mono text-[10px] text-muted-foreground">
                                                            #{ord.order_number}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <div className="font-bold text-sm text-foreground">
                                                            {ord.customer_name}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5 font-medium">
                                                            {ord.items_summary ||
                                                                (ord.items && ord.items.length > 0
                                                                    ? ord.items
                                                                          .map(
                                                                              (it: { name: string; quantity: number }) =>
                                                                                  `${it.name} x${it.quantity}`
                                                                          )
                                                                          .join(', ')
                                                                    : 'Menu items')}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                                                    <span className="font-mono font-semibold text-muted-foreground text-[11px]">
                                                        {ord.created_at}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                                                            ord.payment_status === 'paid'
                                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                                                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400'
                                                        }`}>
                                                            {ord.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                                                        </span>
                                                        <span className="font-mono font-bold text-foreground">
                                                            {formatCurrency(ord.total_amount)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2 pt-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onSelectOrder(ord)}
                                                        className="h-8 flex-1 text-xs gap-1"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        Detail
                                                    </Button>

                                                    {col.nextStatus && (
                                                        <Button
                                                            size="sm"
                                                            disabled={col.key === 'pending' && ord.payment_status !== 'paid'}
                                                            onClick={() =>
                                                                onUpdateStatus(ord.id, col.nextStatus!)
                                                            }
                                                            className={`h-8 flex-1 text-xs gap-1 ${
                                                                col.key === 'pending' && ord.payment_status !== 'paid'
                                                                    ? 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                                                                    : col.nextActionBg
                                                            }`}
                                                            title={
                                                                col.key === 'pending' && ord.payment_status !== 'paid'
                                                                    ? 'Pesanan belum dibayar. Mohon verifikasi pembayaran terlebih dahulu.'
                                                                    : undefined
                                                            }
                                                        >
                                                            {ActionIcon && <ActionIcon className="h-3.5 w-3.5" />}
                                                            <span>
                                                                {col.key === 'pending' && ord.payment_status !== 'paid'
                                                                    ? 'Belum Bayar'
                                                                    : col.nextActionLabel}
                                                            </span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                );
            })}
        </div>
    );
}
