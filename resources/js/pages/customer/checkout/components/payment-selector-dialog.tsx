import { QrCode, Building2, Banknote, Check, AlertCircle, Info } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PaymentMethodItem } from '../types';

interface PaymentSelectorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    eWalletMethods: PaymentMethodItem[];
    bankTransferMethods: PaymentMethodItem[];
    selectedMethodCategory: 'qris' | 'va' | 'cash';
    selectedChannelCode: string;
    onSelectMethod: (category: 'qris' | 'va' | 'cash', code: string) => void;
    hasMidtrans?: boolean;
    tenantName?: string;
}

export default function PaymentSelectorDialog({
    open,
    onOpenChange,
    eWalletMethods,
    bankTransferMethods,
    selectedMethodCategory,
    selectedChannelCode,
    onSelectMethod,
    hasMidtrans = true,
    tenantName = 'Stand Kantin',
}: PaymentSelectorDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-1.5rem)] max-w-[390px] rounded-3xl p-5 text-left space-y-4 border-border/80 shadow-2xl bg-card">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-base font-black text-foreground">
                        Pilih Metode Pembayaran
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Metode pembayaran yang didukung oleh {tenantName}
                    </DialogDescription>
                </DialogHeader>

                {/* If stand has no Midtrans, show Cash-Only notice */}
                {!hasMidtrans ? (
                    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                            <Info className="size-4 shrink-0" />
                            <span>Khusus Pembayaran Tunai (Cash Only)</span>
                        </div>
                        <p className="text-[11px] text-amber-600 dark:text-amber-300 leading-relaxed">
                            Stand <span className="font-semibold">{tenantName}</span> belum mengaktifkan pembayaran digital. Silakan bayar langsung dengan uang pas di kasir stand saat mengambil pesanan.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* QRIS / E-Wallet Option */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-black text-foreground block">
                                QRIS & E-Wallet (Scan Instant via Midtrans)
                            </span>
                            {eWalletMethods.map((m) => {
                                const isSelected =
                                    selectedMethodCategory === 'qris' && selectedChannelCode === m.code;
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectMethod('qris', m.code);
                                            onOpenChange(false);
                                        }}
                                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20 font-black'
                                                : 'border-border/70 hover:bg-muted/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="size-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                                                <QrCode className="size-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground">
                                                    {m.name}
                                                </span>
                                                <span className="text-[9.5px] text-muted-foreground font-mono">
                                                    Biaya Gateway: {m.fee_amount}%
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected && <Check className="size-4 text-primary" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Virtual Account Option */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-black text-foreground block">
                                Virtual Account (Bank Transfer via Midtrans)
                            </span>
                            {bankTransferMethods.map((m) => {
                                const isSelected =
                                    selectedMethodCategory === 'va' && selectedChannelCode === m.code;
                                return (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectMethod('va', m.code);
                                            onOpenChange(false);
                                        }}
                                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20 font-black'
                                                : 'border-border/70 hover:bg-muted/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className="size-8 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                                                <Building2 className="size-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground">
                                                    {m.name}
                                                </span>
                                                <span className="text-[9.5px] text-muted-foreground font-mono">
                                                    Biaya Gateway: Rp{Number(m.fee_amount).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                        {isSelected && <Check className="size-4 text-primary" />}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Cash / Tunai Option */}
                <div className="space-y-2">
                    <span className="text-[11px] font-black text-foreground block">
                        Tunai (Bayar di Kasir Stand)
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            onSelectMethod('cash', 'cash');
                            onOpenChange(false);
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                            selectedMethodCategory === 'cash'
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20 font-black'
                                : 'border-border/70 hover:bg-muted/40'
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                                <Banknote className="size-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">
                                    Bayar Tunai di Kasir
                                </span>
                                <span className="text-[9.5px] text-emerald-600 font-bold">
                                    Bebas Biaya Layanan & Gateway (Rp 0 Fee)
                                </span>
                            </div>
                        </div>
                        {selectedMethodCategory === 'cash' && (
                            <Check className="size-4 text-primary" />
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
