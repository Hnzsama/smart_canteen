import { Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CheckoutBottomBarProps {
    grandTotal: number;
    isSubmitting: boolean;
    isDisabled: boolean;
    onSubmit: () => void;
}

export default function CheckoutBottomBar({
    grandTotal,
    isSubmitting,
    isDisabled,
    onSubmit,
}: CheckoutBottomBarProps) {
    return (
        <div className="fixed bottom-3 z-50 w-full max-w-[430px] left-1/2 -translate-x-1/2 px-3 pointer-events-none">
            <div className="pointer-events-auto bg-card/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-border/80 dark:border-white/15 h-16 rounded-3xl p-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                <div className="flex flex-col pl-1">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider leading-none">
                        Total Payment
                    </span>
                    <span className="font-mono font-black text-base text-primary leading-tight mt-0.5">
                        Rp{grandTotal.toLocaleString('id-ID')}
                    </span>
                </div>

                <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={isDisabled || isSubmitting}
                    className="h-11 px-6 text-xs font-black rounded-2xl gap-1.5 shadow-md active:scale-95 transition-all bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <span>Place Order</span>
                            <ChevronRight className="size-4 opacity-80" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
