import { router } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
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
import { destroy as destroyTenant } from '@/routes/admin/tenants';
import type { TenantItem } from '../../types';

type Props = {
    tenant: TenantItem | null;
    onClose: () => void;
};

export function TenantDeleteDialog({ tenant, onClose }: Props) {
    const handleDelete = () => {
        if (!tenant) return;
        router.delete(destroyTenant.url(tenant.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={!!tenant} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md gap-5">
                <DialogHeader className="gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive border border-destructive/20 shadow-xs">
                            <Trash2 className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">
                                Pindahkan ke Tempat Sampah?
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Mitra stand kantin akan dinonaktifkan sementara dari operasional.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Target Tenant Card */}
                {tenant && (
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-sm text-primary border border-primary/20">
                                {tenant.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="font-semibold text-sm text-foreground truncate">
                                    {tenant.name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate font-mono">
                                    /{tenant.slug}
                                </div>
                            </div>
                            <Badge
                                variant={tenant.is_active ? 'secondary' : 'outline'}
                                className="shrink-0 text-[11px] font-medium py-0.5 px-2"
                            >
                                {tenant.is_active ? 'Aktif Buka' : 'Nonaktif'}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Warning Callout Box with Lucide SVG icon */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-semibold text-amber-800 dark:text-amber-300">
                            Konsekuensi Penonaktifan:
                        </p>
                        <p className="text-amber-700/90 dark:text-amber-200/80 leading-relaxed">
                            Stand tidak akan muncul pada daftar menu mahasiswa. Seluruh riwayat pembayaran dan data pesanan tetap aman dan dapat dipulihkan kapan saja melalui tab Tempat Sampah.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2 pt-1">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        className="w-full sm:w-auto gap-1.5 shadow-xs font-semibold"
                    >
                        <Trash2 className="h-4 w-4" />
                        Ya, Pindahkan ke Sampah
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
