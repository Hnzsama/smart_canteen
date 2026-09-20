import { useEffect, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { update as updateCategory } from '@/routes/admin/categories';
import type { CategoryItem, CategoryTenantOption } from '../../types';

type Props = {
    category: CategoryItem | null;
    isOpen: boolean;
    onClose: () => void;
    tenants: CategoryTenantOption[];
};

export function CategoryEditDialog({ category, isOpen, onClose, tenants }: Props) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        tenant_id: '',
        name: '',
    });

    useEffect(() => {
        if (category) {
            setData({
                tenant_id: String(category.tenant_id),
                name: category.name,
            });
            clearErrors();
        }
    }, [category]);

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!category) return;

        put(updateCategory.url(category.id), {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Edit2 className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            Edit Kategori Menu
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Perbarui nama atau pengalokasian stand untuk kategori menu ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Select Tenant */}
                    <div className="space-y-1.5">
                        <Label htmlFor="edit_tenant_id" className="text-xs font-semibold">
                            Pilih Stand Kantin <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={data.tenant_id}
                            onValueChange={(val) => setData('tenant_id', val)}
                        >
                            <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder="Pilih mitra stand..." />
                            </SelectTrigger>
                            <SelectContent>
                                {tenants.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)} className="text-xs">
                                        {t.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.tenant_id && (
                            <p className="text-xs font-medium text-destructive">{errors.tenant_id}</p>
                        )}
                    </div>

                    {/* Category Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="edit_name" className="text-xs font-semibold">
                            Nama Kategori Menu <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit_name"
                            placeholder="cth: Makanan Utama, Minuman Cold, Snack"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="h-9 text-xs"
                        />
                        {errors.name && (
                            <p className="text-xs font-medium text-destructive">{errors.name}</p>
                        )}
                    </div>

                    <DialogFooter className="pt-4 border-t border-border/50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                            className="h-9 text-xs"
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing} className="h-9 text-xs gap-1.5">
                            {processing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Edit2 className="h-3.5 w-3.5" />
                            )}
                            Perbarui Data
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
