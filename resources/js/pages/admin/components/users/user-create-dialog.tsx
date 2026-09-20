import { type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as storeUser } from '@/routes/admin/users';
import type { UserTenantOption } from '../../types';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenants: UserTenantOption[];
};

export function UserCreateDialog({ open, onOpenChange, tenants }: Props) {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: 'mahasiswa',
        tenant_id: '' as string | number,
        verify_email_now: true,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(storeUser.url(), {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={submit}>
                    <DialogHeader className="gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                                <Plus className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-foreground">
                                    Tambah Pengguna Baru
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Daftarkan akun baru untuk Mahasiswa, Penjual Stand, atau Admin.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="create-name">
                                Nama Lengkap <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="create-name"
                                placeholder="Contoh: Ahmad Fauzi"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                aria-invalid={!!form.errors.name}
                            />
                            {form.errors.name && (
                                <p className="text-xs text-destructive">{form.errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-email">
                                Alamat Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="create-email"
                                type="email"
                                placeholder="fauzi@feb.student.ac.id"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                aria-invalid={!!form.errors.email}
                            />
                            {form.errors.email && (
                                <p className="text-xs text-destructive">{form.errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-password">
                                Password Awal <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="create-password"
                                type="password"
                                placeholder="Minimal 8 karakter"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                aria-invalid={!!form.errors.password}
                            />
                            {form.errors.password && (
                                <p className="text-xs text-destructive">{form.errors.password}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="create-role">
                                Peran / Role Pengguna <span className="text-destructive">*</span>
                            </Label>
                            <select
                                id="create-role"
                                value={form.data.role}
                                onChange={(e) => form.setData('role', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="mahasiswa">Mahasiswa / Pembeli</option>
                                <option value="tenant">Penjual / Pengelola Stand Kantin</option>
                                <option value="admin">Administrator FEB</option>
                            </select>
                        </div>

                        {form.data.role === 'tenant' && (
                            <div className="grid gap-2">
                                <Label htmlFor="create-tenant">
                                    Pilih Stand Kantin Yang Dikelola <span className="text-destructive">*</span>
                                </Label>
                                <select
                                    id="create-tenant"
                                    value={form.data.tenant_id}
                                    onChange={(e) => form.setData('tenant_id', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">-- Pilih Stand Kantin --</option>
                                    {tenants.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.tenant_id && (
                                    <p className="text-xs text-destructive">{form.errors.tenant_id}</p>
                                )}
                            </div>
                        )}

                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="create-verify"
                                checked={form.data.verify_email_now}
                                onCheckedChange={(checked) =>
                                    form.setData('verify_email_now', Boolean(checked))
                                }
                            />
                            <Label htmlFor="create-verify" className="text-sm font-medium leading-none cursor-pointer">
                                Tandai email sebagai sudah terverifikasi sekarang
                            </Label>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
