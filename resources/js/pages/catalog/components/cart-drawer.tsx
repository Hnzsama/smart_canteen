import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    Utensils,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CartItem } from '../types';

type CartDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    foodFallback: string;
};

export default function CartDrawer({
    isOpen,
    onClose,
    cartItems,
    setCartItems,
    foodFallback,
}: CartDrawerProps) {
    const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalCartPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

    const handleUpdateQty = (index: number, delta: number) => {
        setCartItems((prev) => {
            const item = prev[index];
            if (!item) return prev;

            const newQty = item.qty + delta;
            if (newQty <= 0) {
                // Remove item from cart
                return prev.filter((_, i) => i !== index);
            }

            const unitPrice = item.qty > 0 ? item.price / item.qty : item.price;
            return prev.map((itm, i) => {
                if (i !== index) return itm;
                return {
                    ...itm,
                    qty: newQty,
                    price: unitPrice * newQty,
                };
            });
        });
    };

    const handleRemoveItem = (index: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCheckout = () => {
        onClose();
        router.get('/checkout');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="w-[calc(100%-1.5rem)] max-w-[390px] rounded-3xl p-0 overflow-hidden shadow-2xl border-border/80">
                {/* Header */}
                <DialogHeader className="p-4 border-b border-border bg-card flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <ShoppingBag className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-black text-foreground">
                                Keranjang Belanja ({totalCartCount} Porsi)
                            </DialogTitle>
                            <DialogDescription className="text-[10px] text-muted-foreground">
                                Periksa rincian varian & catatan pesananmu sebelum bayar
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content Items List */}
                <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <div className="py-12 text-center space-y-2 text-muted-foreground">
                            <Utensils className="size-8 mx-auto opacity-30" />
                            <p className="text-xs font-semibold">Keranjang belanjaanmu kosong.</p>
                        </div>
                    ) : (
                        cartItems.map((item, idx) => {
                            const choicesArray = Object.entries(item.choices || {}).map(
                                ([groupName, choice]) => `${groupName}: ${choice.name}`
                            );

                            return (
                                <div
                                    key={idx}
                                    className="p-3 rounded-2xl border border-border bg-card/60 flex items-start justify-between gap-3 shadow-2xs"
                                >
                                    <img
                                        src={item.menu.image || foodFallback}
                                        alt={item.menu.name}
                                        className="h-12 w-12 rounded-xl object-cover border border-border shrink-0 bg-muted"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = foodFallback;
                                        }}
                                    />

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between gap-1">
                                            <h4 className="font-extrabold text-xs text-foreground truncate">
                                                {item.menu.name}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(idx)}
                                                className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                                                title="Hapus menu ini"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>

                                        <span className="text-[10px] text-primary font-bold block">
                                            {item.menu.tenant_name}
                                        </span>

                                        {/* Addons Choices Pills */}
                                        {choicesArray.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-0.5">
                                                {choicesArray.map((c, cIdx) => (
                                                    <Badge
                                                        key={cIdx}
                                                        variant="secondary"
                                                        className="text-[9px] px-1.5 py-0 h-3.5 font-medium"
                                                    >
                                                        {c}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Note */}
                                        {item.note && (
                                            <p className="text-[10px] text-muted-foreground italic bg-muted/40 p-1.5 rounded-lg border border-border/40 mt-1">
                                                Catatan: "{item.note}"
                                            </p>
                                        )}

                                        {/* Quantity & Price Row */}
                                        <div className="flex items-center justify-between pt-1.5 border-t border-border/40 mt-1">
                                            <span className="font-mono font-black text-xs text-primary">
                                                Rp {item.price.toLocaleString('id-ID')}
                                            </span>

                                            <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQty(idx, -1)}
                                                    className="size-5 rounded-lg bg-card flex items-center justify-center text-foreground hover:bg-accent active:scale-90 font-bold"
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="font-mono text-xs font-black w-4 text-center">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQty(idx, 1)}
                                                    className="size-5 rounded-lg bg-card flex items-center justify-center text-foreground hover:bg-accent active:scale-90 font-bold"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <DialogFooter className="p-3.5 bg-muted/30 border-t border-border flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-col">
                            <span className="text-[9.5px] text-muted-foreground uppercase font-bold tracking-wider">
                                Subtotal Pembayaran
                            </span>
                            <span className="font-mono font-black text-base text-primary">
                                Rp {totalCartPrice.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <Button
                            type="button"
                            onClick={handleCheckout}
                            className="h-10 px-5 text-xs font-black rounded-2xl gap-1.5 shadow-md"
                        >
                            <span>Lanjut Checkout</span>
                            <ArrowRight className="size-4" />
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
