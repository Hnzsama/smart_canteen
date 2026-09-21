import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutEmptyState() {
    return (
        <>
            <Head title="Confirm Order - Smart Canteen FEB" />
            <div className="min-h-[420px] rounded-3xl border border-dashed border-border/80 bg-card/60 backdrop-blur-md p-6 text-center flex flex-col items-center justify-center space-y-4 my-4 shadow-xs">
                <div className="relative">
                    <div className="size-16 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                        <ShoppingBag className="size-8 text-primary animate-bounce" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="font-black text-base text-foreground tracking-tight">Keranjang Kosong</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Yuk pilih makanan favoritmu di Kantin FEB!
                    </p>
                </div>

                <Button
                    asChild
                    className="font-black text-xs rounded-2xl h-11 px-6 gap-2 shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                    <Link href="/">
                        <Utensils className="size-4" />
                        <span>Jelajahi Menu</span>
                    </Link>
                </Button>
            </div>
        </>
    );
}
