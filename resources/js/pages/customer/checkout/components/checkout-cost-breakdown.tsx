import { ChevronRight, ChevronDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CheckoutCostBreakdownProps {
    selectedMethodLabel: string;
    onOpenPaymentPicker: () => void;
    showCostDetails: boolean;
    onToggleCostDetails: () => void;
    totalItemQty: number;
    totalCartPrice: number;
    effectiveAppFee: number;
    channelFee: number;
    grandTotal: number;
    orderNotes: string;
    onOrderNotesChange: (value: string) => void;
}

export default function CheckoutCostBreakdown({
    selectedMethodLabel,
    onOpenPaymentPicker,
    showCostDetails,
    onToggleCostDetails,
    totalItemQty,
    totalCartPrice,
    effectiveAppFee,
    channelFee,
    grandTotal,
    orderNotes,
    onOrderNotesChange,
}: CheckoutCostBreakdownProps) {
    return (
        <div className="space-y-3">
            {/* Payment Option Row */}
            <button
                type="button"
                onClick={onOpenPaymentPicker}
                className="w-full p-3.5 bg-card rounded-2xl border border-border/70 flex items-center justify-between text-left hover:bg-muted/30 transition-colors shadow-2xs"
            >
                <span className="text-xs font-bold text-muted-foreground">Payment Option</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span className="truncate max-w-[190px]">{selectedMethodLabel}</span>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </div>
            </button>

            {/* Total Payment Row (With Expandable Cost Breakdown Toggle) */}
            <div className="bg-card rounded-2xl border border-border/70 p-3.5 space-y-2 shadow-2xs">
                <button
                    type="button"
                    onClick={onToggleCostDetails}
                    className="w-full flex items-center justify-between text-left"
                >
                    <span className="text-xs font-bold text-muted-foreground">Total Payment</span>
                    <div className="flex items-center gap-1 text-sm font-black font-mono text-primary">
                        <span>Rp{grandTotal.toLocaleString('id-ID')}</span>
                        <ChevronDown
                            className={`size-4 text-muted-foreground transition-transform ${
                                showCostDetails ? 'rotate-180' : ''
                            }`}
                        />
                    </div>
                </button>

                {/* Expandable Breakdown Drawer */}
                {showCostDetails && (
                    <div className="pt-2 border-t border-border/40 space-y-1.5 text-[11px] text-muted-foreground animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex justify-between items-center">
                            <span>Subtotal Menu ({totalItemQty} porsi)</span>
                            <span className="font-mono font-bold text-foreground">
                                Rp{totalCartPrice.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Admin Service</span>
                            <span
                                className={`font-mono font-bold ${
                                    effectiveAppFee === 0 ? 'text-emerald-500' : 'text-foreground'
                                }`}
                            >
                                {effectiveAppFee === 0
                                    ? 'Rp 0 (Free)'
                                    : `Rp${effectiveAppFee.toLocaleString('id-ID')}`}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span>Payment Service</span>
                            <span
                                className={`font-mono font-bold ${
                                    channelFee === 0 ? 'text-emerald-500' : 'text-foreground'
                                }`}
                            >
                                {channelFee === 0
                                    ? 'Rp 0 (Free)'
                                    : `Rp${channelFee.toLocaleString('id-ID')}`}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Note Input Row */}
            <div className="p-3.5 bg-card rounded-2xl border border-border/70 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">Note:</span>
                    <span className="text-[10px] text-muted-foreground">Catatan ke penjual</span>
                </div>
                <Textarea
                    placeholder="Contoh: Sambal dipisah, sendok ekstra..."
                    value={orderNotes}
                    onChange={(e) => onOrderNotesChange(e.target.value)}
                    className="text-xs min-h-[55px] rounded-xl resize-none bg-muted/20 border-border/70 focus:ring-primary"
                />
            </div>
        </div>
    );
}
