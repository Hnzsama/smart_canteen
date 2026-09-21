import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FloatingCartStripProps = {
    totalCartCount: number;
    totalCartPrice: number;
    onViewCart: () => void;
};

export default function FloatingCartStrip({
    totalCartCount,
    totalCartPrice,
    onViewCart,
}: FloatingCartStripProps) {
    if (totalCartCount <= 0) return null;

    return (
        <div className="fixed bottom-[82px] z-40 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-3.5 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-none">
            <div
                onClick={onViewCart}
                className="pointer-events-auto bg-card/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 rounded-3xl p-3 shadow-[0_12px_35px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
            >
                <div className="flex items-center gap-3">
                    <div className="relative size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shrink-0">
                        <ShoppingBag className="size-5" />
                        <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-rose-500 text-white text-[10px] font-black border-2 border-card flex items-center justify-center shadow-xs animate-in zoom-in-75">
                            {totalCartCount}
                        </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="text-[9.5px] text-muted-foreground uppercase font-extrabold tracking-wider truncate">
                            Keranjang Belanja • {totalCartCount} Menu
                        </span>
                        <span className="font-mono font-black text-base text-primary leading-tight truncate">
                            Rp {totalCartPrice.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewCart();
                    }}
                    className="h-10 px-4 text-xs font-black rounded-2xl gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md active:scale-95 transition-all group shrink-0"
                >
                    <span>Keranjang</span>
                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
            </div>
        </div>
    );
}
