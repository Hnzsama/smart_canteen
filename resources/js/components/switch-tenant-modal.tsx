import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Store } from 'lucide-react';

interface SwitchTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    currentTenantName: string;
    newTenantName: string;
}

export function SwitchTenantModal({
    isOpen,
    onClose,
    onConfirm,
    currentTenantName,
    newTenantName,
}: SwitchTenantModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-6">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-center text-lg font-bold">
                        Ganti Stand Kantin?
                    </DialogTitle>
                    <DialogDescription className="text-center text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Keranjangmu saat ini berisi menu dari{' '}
                        <span className="font-semibold text-foreground underline decoration-amber-500 decoration-2">
                            {currentTenantName || 'Stand Lain'}
                        </span>
                        . Menambahkan menu dari{' '}
                        <span className="font-semibold text-foreground underline decoration-amber-500 decoration-2">
                            {newTenantName || 'Stand Baru'}
                        </span>{' '}
                        akan mengosongkan keranjang belanja sebelumnya.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 my-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <Store className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>
                        Setiap transaksi checkout hanya melayani pesanan dari 1 stand untuk kemudahan pembayaran dan pengambilan pesanan.
                    </span>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto text-xs font-semibold"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="w-full sm:w-auto text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white"
                    >
                        Ganti Stand & Kosongkan Keranjang
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
