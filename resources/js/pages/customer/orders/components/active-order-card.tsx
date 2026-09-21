import React from 'react';
import { router } from '@inertiajs/react';
import { ChevronRight, CreditCard, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActiveOrder } from '../types';
import { OrderStatusBadge } from './order-status-badge';

interface ActiveOrderCardProps {
    order: ActiveOrder;
    foodFallback?: string;
}

export function ActiveOrderCard({
    order,
    foodFallback = '/images/food-placeholder.jpg',
}: ActiveOrderCardProps) {
    const firstItem = order.items[0];
    const extraItemsCount = order.items.length - 1;
    const isUnpaidCashless = order.payment_method !== 'cash' && order.payment_status === 'unpaid';

    return (
        <div className="bg-card rounded-2xl border border-border/80 p-4 space-y-3 shadow-2xs hover:border-primary/40 transition-colors">
            {/* Card Header: Tenant Name + Status Badge */}
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                    <Store className="size-4 text-primary shrink-0" />
                    <h3 className="text-xs font-black text-foreground truncate">
                        {order.tenant_name}
                    </h3>
                </div>
                <OrderStatusBadge
                    status={order.status}
                    paymentStatus={order.payment_status}
                    paymentMethod={order.payment_method}
                    statusLabel={order.status_label}
                />
            </div>

            {/* Meta Row: Pickup Code & Order Number */}
            <div className="flex items-center justify-between text-[10.5px] text-muted-foreground font-mono">
                <span>No: #{order.order_number}</span>
                <span className="font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    Kode Pickup: {order.pickup_code}
                </span>
            </div>

            {/* Item Summary Preview Row */}
            <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-xl border border-border/50">
                <img
                    src={firstItem?.image || foodFallback}
                    alt={firstItem?.name || 'Menu Item'}
                    className="size-11 rounded-lg object-cover border border-border shrink-0 bg-card"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = foodFallback;
                    }}
                />
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-foreground truncate">
                        {firstItem ? `${firstItem.qty}x ${firstItem.name}` : 'Item Pesanan'}
                    </span>
                    {extraItemsCount > 0 && (
                        <span className="text-[10px] text-muted-foreground font-medium">
                            +{extraItemsCount} menu lainnya
                        </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                        {order.created_at}
                    </span>
                </div>
            </div>

            {/* Card Footer: Total Amount & Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                        Total Pembayaran
                    </span>
                    <span className="font-mono font-black text-sm text-primary leading-tight mt-0.5">
                        Rp{order.total_amount.toLocaleString('id-ID')}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {isUnpaidCashless && (
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => router.visit(`/orders/${order.id}/payment`)}
                            className="h-8 px-3 text-[11px] font-extrabold rounded-xl gap-1 bg-amber-500 text-white hover:bg-amber-600 shadow-2xs active:scale-95"
                        >
                            <CreditCard className="size-3.5" />
                            <span>Bayar Sekarang</span>
                        </Button>
                    )}

                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => router.visit(`/orders/${order.id}`)}
                        className="h-8 px-3 text-[11px] font-black rounded-xl gap-1 border-border shadow-2xs active:scale-95 hover:bg-muted"
                    >
                        <span>Lihat Detail</span>
                        <ChevronRight className="size-3.5 text-primary" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
