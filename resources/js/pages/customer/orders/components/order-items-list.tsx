import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderItem } from '../types';

interface OrderItemsListProps {
    items: OrderItem[];
    foodFallback?: string;
    showSubtotal?: boolean;
}

export function OrderItemsList({
    items,
    foodFallback = '/images/food-placeholder.jpg',
    showSubtotal = false,
}: OrderItemsListProps) {
    return (
        <div className="divide-y divide-border/40">
            {items.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                    <img
                        src={item.image || foodFallback}
                        alt={item.name}
                        className="size-14 rounded-xl object-cover border border-border bg-card shrink-0"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = foodFallback;
                        }}
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-1">
                                {item.name}
                            </h4>
                            <span className="font-mono text-xs font-black text-foreground shrink-0">
                                Rp{(showSubtotal && item.subtotal ? item.subtotal : item.price * item.qty).toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                            <span>{item.qty}x @ Rp{item.price.toLocaleString('id-ID')}</span>
                        </div>

                        {item.choices && item.choices.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                                {item.choices.map((choice, cIdx) => (
                                    <Badge
                                        key={cIdx}
                                        variant="secondary"
                                        className="text-[9px] px-1.5 py-0 h-4 font-medium"
                                    >
                                        {choice}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {item.note && (
                            <p className="text-[10px] text-muted-foreground italic pt-0.5">
                                "{item.note}"
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
