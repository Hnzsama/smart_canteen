import React from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, Star, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HistoryOrder } from '../types';

interface HistoryOrderCardProps {
    order: HistoryOrder;
    onOpenRating: (order: HistoryOrder, e: React.MouseEvent) => void;
    foodFallback?: string;
}

export function HistoryOrderCard({
    order,
    onOpenRating,
    foodFallback = '/images/food-placeholder.jpg',
}: HistoryOrderCardProps) {
    return (
        <Link
            href={`/orders/${order.id}`}
            className="block rounded-2xl border border-border/80 bg-card p-4 space-y-3.5 shadow-2xs hover:border-primary/40 active:scale-[0.99] transition-all group"
        >
            {/* Merchant Header & Status */}
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Store className="size-4 text-primary shrink-0" />
                        <h3 className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-0.5">
                            <span>{order.tenant_name}</span>
                            <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        </h3>
                    </div>

                    <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-0.5 h-5 rounded-full shrink-0 gap-1"
                    >
                        <CheckCircle2 className="size-3" />
                        <span>Selesai</span>
                    </Badge>
                </div>

                <p className="text-[10px] font-mono text-muted-foreground">
                    {order.date} • No: #{order.order_number}
                </p>
            </div>

            <hr className="border-border/50" />

            {/* Food Items List */}
            <div className="space-y-3">
                {order.items.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-start justify-between gap-3 pb-3 border-b border-border/40 last:border-none last:pb-0"
                    >
                        <div className="flex items-start gap-3 min-w-0">
                            <img
                                src={item.image || foodFallback}
                                alt={item.name}
                                className="size-12 rounded-2xl object-cover border border-border shrink-0 bg-muted"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = foodFallback;
                                }}
                            />
                            <div className="flex flex-col min-w-0 space-y-1">
                                <span className="text-xs font-bold text-foreground leading-snug">
                                    {item.qty}x {item.name}
                                </span>

                                {item.choices && item.choices.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
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
                                    <p className="text-[10px] text-muted-foreground italic leading-tight">
                                        Catatan: "{item.note}"
                                    </p>
                                )}
                            </div>
                        </div>

                        <span className="font-mono text-xs font-black text-foreground shrink-0 pt-0.5">
                            Rp {item.price.toLocaleString('id-ID')}
                        </span>
                    </div>
                ))}
            </div>

            {/* Order Rating & Total Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div>
                    {order.rating_given ? (
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                            <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span className="text-[11px]">Bintang {order.rating_given}/5</span>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={(e) => onOpenRating(order, e)}
                            className="h-8 text-[11px] font-black rounded-xl border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 gap-1.5 shadow-2xs"
                        >
                            <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span>Beri Ulasan</span>
                        </Button>
                    )}
                </div>

                <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">
                        Total Bayar
                    </span>
                    <span className="font-mono font-black text-sm text-primary">
                        Rp {order.total_amount.toLocaleString('id-ID')}
                    </span>
                </div>
            </div>
        </Link>
    );
}
