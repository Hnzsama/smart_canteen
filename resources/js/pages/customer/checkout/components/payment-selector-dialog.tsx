import { QrCode, Building2, Banknote, Check } from 'lucide-react';
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
}

export default function PaymentSelectorDialog({
    open,
    onOpenChange,
    eWalletMethods,
    bankTransferMethods,
    selectedMethodCategory,
    selectedChannelCode,
    onSelectMethod,
}: PaymentSelectorDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-1.5rem)] max-w-[390px] rounded-3xl p-5 text-left space-y-4 border-border/80 shadow-2xl bg-card">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-base font-black text-foreground">
                        Pilih Metode Pembayaran
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Pilih cara pembayaran yang kamu inginkan
                    </DialogDescription>
                </DialogHeader>

                {/* QRIS / E-Wallet Option */}
                <div className="space-y-2">
                    <span className="text-[11px] font-black text-foreground block">
                        QRIS & E-Wallet (Scan Instant)
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
                                            Fee: {m.fee_amount}%
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
                        Virtual Account (Bank Transfer)
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
                                            Fee: Rp{Number(m.fee_amount).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                                {isSelected && <Check className="size-4 text-primary" />}
                            </button>
                        );
                    })}
                </div>

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
                                    Bebas Biaya Admin (Rp 0 Fee)
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
