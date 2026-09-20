import { useEffect, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { update as updateUser } from '@/routes/admin/users';
import type { UserItem, UserTenantOption } from '../../types';

type Props = {
    user: UserItem | null;
    onClose: () => void;
    tenants: UserTenantOption[];
    currentUserId: number;
};

export function UserEditDialog({
    user,
    onClose,
    tenants,
    currentUserId,
}: Props) {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: 'mahasiswa',
        tenant_id: '' as string | number,
        verify_email_now: false,
    });

    useEffect(() => {
        if (user) {
            form.setData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role,
                tenant_id: user.tenant_id ? user.tenant_id : '',
                verify_email_now: user.is_verified,
            });
            form.clearErrors();
        }
    }, [user]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;

        form.put(updateUser.url(user.id), {
            onSuccess: () => {
                onClose();
                form.reset();
            },
        });
    };

    return (
        <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={submit}>
                    <DialogHeader className="gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                                <Edit2 className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-foreground">
                                    Edit Profil Pengguna
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Perbarui informasi akun, role, atau ubah password {user?.name}.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">
                                Nama Lengkap <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                aria-invalid={!!form.errors.name}
                            />
                            {form.errors.name && (
                                <p className="text-xs text-destructive">{form.errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">
                                Alamat Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                aria-invalid={!!form.errors.email}
                            />
                            {form.errors.email && (
                                <p className="text-xs text-destructive">{form.errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">Password Baru (Opsional)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                placeholder="Kosongkan bila tidak ingin mengubah password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                aria-invalid={!!form.errors.password}
                            />
                            {form.errors.password && (
                                <p className="text-xs text-destructive">{form.errors.password}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-role">
                                Peran / Role Pengguna <span className="text-destructive">*</span>
                            </Label>
                            <select
                                id="edit-role"
                                value={form.data.role}
                                disabled={user?.id === currentUserId}
                                onChange={(e) => form.setData('role', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                            >
                                <option value="mahasiswa">Mahasiswa / Pembeli</option>
                                <option value="tenant">Penjual / Pengelola Stand Kantin</option>
                                <option value="admin">Administrator FEB</option>
                            </select>
                            {user?.id === currentUserId && (
                                <p className="text-xs text-muted-foreground">
                                    Role akun admin Anda sendiri tidak dapat diubah di sini.
                                </p>
                            )}
                        </div>

                        {form.data.role === 'tenant' && (
                            <div className="grid gap-2">
                                <Label htmlFor="edit-tenant">
                                    Pilih Stand Kantin Yang Dikelola <span className="text-destructive">*</span>
                                </Label>
                                <select
                                    id="edit-tenant"
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

                        {!user?.is_verified && (
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="edit-verify"
                                    checked={form.data.verify_email_now}
                                    onCheckedChange={(checked) =>
                                        form.setData('verify_email_now', Boolean(checked))
                                    }
                                />
                                <Label htmlFor="edit-verify" className="text-sm font-medium leading-none cursor-pointer">
                                    Tandai email sudah terverifikasi sekarang
                                </Label>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Menyimpan...' : 'Perbarui Pengguna'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
