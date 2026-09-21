import { Link } from '@inertiajs/react';
import { Store, Trash2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '../types';

interface TenantOrderItemGroupProps {
    itemsByTenant: Record<number, { tenant_name: string; items: CartItem[] }>;
    cartItems: CartItem[];
    foodFallback: string;
    onUpdateQty: (cartIndex: number, delta: number) => void;
    onRemoveItem: (cartIndex: number) => void;
}

export default function TenantOrderItemGroup({
    itemsByTenant,
    cartItems,
    foodFallback,
    onUpdateQty,
    onRemoveItem,
}: TenantOrderItemGroupProps) {
    return (
        <div className="space-y-3">
            {Object.entries(itemsByTenant).map(([tenantId, group]) => (
                <div
                    key={tenantId}
                    className="bg-card rounded-2xl border border-border/70 p-3.5 space-y-3 shadow-2xs"
                >
                    {/* Stand Header Row */}
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                            <Store className="size-4 text-primary shrink-0" />
                            <span className="text-xs font-black text-foreground truncate">
                                {group.tenant_name}
                            </span>
                        </div>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[11px] font-bold text-primary hover:text-primary p-0 hover:bg-transparent shrink-0"
                        >
                            <Link href="/">
                                <span>+ Tambah Menu</span>
                            </Link>
                        </Button>
                    </div>

                    {/* Food Items List */}
                    <div className="divide-y divide-border/40">
                        {group.items.map((item) => {
                            const cartIdx = cartItems.findIndex((c) => c === item);
                            const choicesArray = Object.entries(item.choices || {}).map(
                                ([groupName, choice]: [string, { name: string; price?: number }]) => `${groupName}: ${choice.name}`
                            );

                            return (
                                <div
                                    key={cartIdx}
                                    className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3"
                                >
                                    <img
                                        src={item.menu.image || foodFallback}
                                        alt={item.menu.name}
                                        className="size-16 rounded-xl object-cover border border-border bg-muted shrink-0"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = foodFallback;
                                        }}
                                    />

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between gap-1">
                                            <h4 className="text-xs font-bold text-foreground leading-snug line-clamp-1">
                                                {item.menu.name}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => onRemoveItem(cartIdx)}
                                                className="text-muted-foreground hover:text-destructive p-0.5 shrink-0"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>

                                        {choicesArray.length > 0 && (
                                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                {choicesArray.join(', ')}
                                            </p>
                                        )}

                                        {item.note && (
                                            <p className="text-[9.5px] text-muted-foreground italic">
                                                "{item.note}"
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-1">
                                            <span className="font-mono text-xs font-black text-primary">
                                                Rp{item.price.toLocaleString('id-ID')}
                                            </span>

                                            <div className="flex items-center gap-1.5 border border-border/80 rounded-lg p-0.5 bg-muted/30">
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateQty(cartIdx, -1)}
                                                    className="size-5 rounded bg-card flex items-center justify-center text-foreground hover:bg-accent font-bold"
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="font-mono text-xs font-black w-4 text-center">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => onUpdateQty(cartIdx, 1)}
                                                    className="size-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
