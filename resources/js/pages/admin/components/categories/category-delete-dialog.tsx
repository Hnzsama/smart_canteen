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
import { destroy as destroyCategory } from '@/routes/admin/categories';
import type { CategoryItem } from '../../types';

type Props = {
    category: CategoryItem | null;
    isOpen: boolean;
    onClose: () => void;
};

export function CategoryDeleteDialog({ category, isOpen, onClose }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!category) return null;

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(destroyCategory.url(category.id), {
            onFinish: () => {
                setIsDeleting(false);
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            Hapus Kategori Menu?
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground pt-2 leading-relaxed">
                        Apakah Anda yakin ingin menghapus kategori <b>"{category.name}"</b> dari stand{' '}
                        <b>{category.tenant_name}</b>?
                        {category.menus_count > 0 && (
                            <span className="block mt-1 text-destructive font-semibold">
                                Peringatan: Terdapat {category.menus_count} menu makanan/minuman yang saat ini terhubung dengan kategori ini.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="pt-4 border-t border-border/50 flex flex-col sm:flex-row gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="h-9 text-xs"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="h-9 text-xs gap-1.5"
                    >
                        {isDeleting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Ya, Hapus Kategori
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
