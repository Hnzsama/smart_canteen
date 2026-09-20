import { type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Loader2, Plus, Tags } from 'lucide-react';
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
import { store as storeCategory } from '@/routes/admin/categories';
import type { CategoryTenantOption } from '../../types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    tenants: CategoryTenantOption[];
};

export function CategoryCreateDialog({ isOpen, onClose, tenants }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        tenant_id: tenants.length > 0 ? String(tenants[0].id) : '',
        name: '',
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(storeCategory.url(), {
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
                            <Tags className="h-5 w-5" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            Tambah Kategori Menu Baru
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Buat pengelompokan jenis makanan/minuman baru untuk mitra stand kantin FEB.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    {/* Select Tenant */}
                    <div className="space-y-1.5">
                        <Label htmlFor="tenant_id" className="text-xs font-semibold">
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
                        <Label htmlFor="name" className="text-xs font-semibold">
                            Nama Kategori Menu <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
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
                                <Plus className="h-3.5 w-3.5" />
                            )}
                            Simpan Kategori
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
