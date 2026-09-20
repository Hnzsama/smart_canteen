import { useState } from 'react';
import { router } from '@inertiajs/react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { destroy as destroyMenuRoute } from '@/routes/tenant/menus';
import type { TenantMenuItem } from '../../types';

type Props = {
    menu: TenantMenuItem | null;
    isOpen: boolean;
    onClose: () => void;
};

export function MenuDeleteDialog({ menu, isOpen, onClose }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!menu) return null;

    const handleDelete = () => {
        setIsDeleting(true);

        router.delete(destroyMenuRoute.url(menu.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                onClose();
            },
            onError: () => {
                setIsDeleting(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold">
                                Hapus Menu Ke Sampah?
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Konfirmasi penghapusan (Soft Delete) menu dari katalog stand.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-2 text-xs text-muted-foreground space-y-2">
                    <p>
                        Apakah Anda yakin ingin memindahkan menu <strong className="text-foreground">{menu.name}</strong> ({menu.formatted_price}) ke tempat sampah?
                    </p>
                    <p className="text-[11px] bg-muted/50 p-2.5 rounded-lg border border-border/50">
                        * Data menu ini tidak dihapus secara permanen dari database. Anda dapat memulihkannya kembali dari tab filter &quot;Terhapus (Trash)&quot;.
                    </p>
                </div>

                <DialogFooter className="pt-3 border-t border-border/50 gap-2 sm:gap-0">
                    <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        className="gap-1.5 text-xs font-semibold"
                    >
                        {isDeleting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                        )}
                        <span>Pindahkan Ke Sampah</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
