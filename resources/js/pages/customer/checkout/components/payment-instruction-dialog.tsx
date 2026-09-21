import { router } from '@inertiajs/react';
import { QrCode, Building2, Sparkles, Check, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PaymentInfoState } from '../types';

interface PaymentInstructionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    paymentInfo: PaymentInfoState | null;
    grandTotal: number;
    copiedText: string | null;
    onCopy: (text: string, label: string) => void;
}

export default function PaymentInstructionDialog({
    open,
    onOpenChange,
    paymentInfo,
    grandTotal,
    copiedText,
    onCopy,
}: PaymentInstructionDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    onOpenChange(false);
                    router.get('/orders');
                }
            }}
        >
            <DialogContent className="w-[calc(100%-1.5rem)] max-w-[390px] rounded-3xl p-5 text-center space-y-3.5 border-border/80 shadow-2xl bg-card">
                <DialogHeader className="space-y-1">
                    <div className="mx-auto size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs mb-1">
                        {paymentInfo?.type === 'qris' ? (
                            <QrCode className="size-5 text-emerald-600" />
                        ) : (
                            <Building2 className="size-5 text-blue-600" />
                        )}
                    </div>
                    <DialogTitle className="text-base font-black text-foreground">
                        {paymentInfo?.type === 'qris'
                            ? 'Pembayaran QRIS Instant'
                            : `Virtual Account ${paymentInfo?.channel_name || ''}`}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Selesaikan pembayaran menggunakan detail di bawah ini
                    </DialogDescription>
                </DialogHeader>

                {/* QRIS Display Section */}
                {paymentInfo?.type === 'qris' && (
                    <div className="space-y-3">
                        <div className="p-3 bg-white rounded-2xl border border-slate-200 inline-block mx-auto shadow-md">
                            <img
                                src={paymentInfo.qr_url}
                                alt="QRIS Code"
                                className="size-44 mx-auto object-contain rounded-lg"
                            />
                            <div className="pt-1 text-slate-500 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                                <Sparkles className="size-3 text-emerald-600" />
                                <span>Scan via GoPay, OVO, ShopeePay, DANA</span>
                            </div>
                        </div>

                        <div className="space-y-0.5 bg-muted/40 p-2.5 rounded-xl border border-border/60">
                            <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">
                                Total Nominal QRIS
                            </span>
                            <span className="text-xl font-black font-mono text-primary">
                                Rp{grandTotal.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                )}

                {/* Virtual Account Display Section */}
                {paymentInfo?.type === 'bank_transfer' && (
                    <div className="space-y-3">
                        <div className="p-3 bg-card rounded-xl border border-border/80 space-y-1.5 text-left shadow-xs">
                            <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">
                                Nomor Virtual Account ({paymentInfo.channel_name})
                            </span>
                            <div className="flex items-center justify-between gap-2 bg-muted/60 p-2.5 rounded-lg border border-border/80 font-mono">
                                <span className="text-base font-black tracking-wider text-foreground select-all">
                                    {paymentInfo.va_number}
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onCopy(paymentInfo.va_number || '', 'va')}
                                    className="h-8 px-2.5 text-[10px] font-extrabold gap-1 rounded-lg shrink-0 border-border shadow-xs"
                                >
                                    {copiedText === 'va' ? (
                                        <Check className="size-3 text-emerald-500" />
                                    ) : (
                                        <Copy className="size-3" />
                                    )}
                                    <span>{copiedText === 'va' ? 'Tersalin' : 'Salin'}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="p-2.5 bg-muted/40 rounded-xl border border-border/60 text-left space-y-0.5">
                            <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider block">
                                Total Transfer Tepat
                            </span>
                            <div className="flex items-center justify-between">
                                <span className="text-base font-black font-mono text-primary">
                                    Rp{grandTotal.toLocaleString('id-ID')}
                                </span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onCopy(String(grandTotal), 'total')}
                                    className="h-7 px-2 text-[10px] font-bold gap-1"
                                >
                                    {copiedText === 'total' ? (
                                        <Check className="size-3 text-emerald-500" />
                                    ) : (
                                        <Copy className="size-3" />
                                    )}
                                    <span>{copiedText === 'total' ? 'Tersalin' : 'Salin'}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step-by-step Instructions */}
                {paymentInfo?.instructions && paymentInfo.instructions.length > 0 && (
                    <div className="text-left bg-muted/30 p-3 rounded-xl border border-border/40 space-y-1">
                        <span className="text-[10px] font-black text-foreground block">
                            Petunjuk Pembayaran:
                        </span>
                        <ol className="list-decimal list-inside text-[10px] text-muted-foreground space-y-0.5 leading-snug">
                            {paymentInfo.instructions.map((inst, i) => (
                                <li key={i}>{inst}</li>
                            ))}
                        </ol>
                    </div>
                )}

                <Button
                    type="button"
                    onClick={() => {
                        onOpenChange(false);
                        router.get('/orders');
                    }}
                    className="w-full h-11 text-xs font-black rounded-xl gap-1.5 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <CheckCircle2 className="size-4" />
                    <span>Saya Sudah Bayar / Lihat Status</span>
                </Button>
            </DialogContent>
        </Dialog>
    );
}
