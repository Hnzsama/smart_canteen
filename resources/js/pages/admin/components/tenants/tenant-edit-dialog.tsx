import { useEffect, useState, type FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Edit2, Eye, EyeOff, ShieldCheck, UserCheck, UserPlus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { update as updateTenant } from '@/routes/admin/tenants';
import type { AvailableUser, TenantItem } from '../../types';

type Props = {
    tenant: TenantItem | null;
    onClose: () => void;
    availableUsers?: AvailableUser[];
};

export function TenantEditDialog({ tenant, onClose, availableUsers = [] }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        name: '',
        description: '',
        is_active: true,
        manager_mode: 'keep' as 'keep' | 'new' | 'existing',
        manager_name: '',
        manager_email: '',
        manager_password: '',
        manager_user_id: '',
    });

    const hasManagers = (tenant?.managers?.length ?? 0) > 0;

    useEffect(() => {
        if (tenant) {
            const hasExisting = tenant.managers.length > 0;
            form.setData({
                name: tenant.name,
                description: tenant.description || '',
                is_active: tenant.is_active,
                manager_mode: hasExisting ? 'keep' : 'new',
                manager_name: '',
                manager_email: '',
                manager_password: '',
                manager_user_id: '',
            });
            form.clearErrors();
            setShowPassword(false);
        }
    }, [tenant]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!tenant) return;

        form.put(updateTenant.url(tenant.id), {
            onSuccess: () => {
                onClose();
                form.reset();
            },
        });
    };

    return (
        <Dialog open={!!tenant} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <form onSubmit={submit}>
                    <DialogHeader className="gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                                <Edit2 className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-foreground">
                                    Edit Data Stand Kantin
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Perbarui nama stand, penugasan akun pengelola, atau status buka.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-5 py-4">
                        {/* Stand Information */}
                        <div className="space-y-4">
                            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Informasi Mitra Stand
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">
                                    Nama Stand <span className="text-destructive">*</span>
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
                                <Label htmlFor="edit-description">Deskripsi Singkat</Label>
                                <Input
                                    id="edit-description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    aria-invalid={!!form.errors.description}
                                />
                                {form.errors.description && (
                                    <p className="text-xs text-destructive">{form.errors.description}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                                <Checkbox
                                    id="edit-active"
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) => form.setData('is_active', Boolean(checked))}
                                />
                                <Label htmlFor="edit-active" className="text-sm font-medium leading-none cursor-pointer">
                                    Status operasional aktif (Buka menerima pesanan)
                                </Label>
                            </div>
                        </div>

                        {/* Manager Account Section */}
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                        Akun Pengelola Stand <span className="text-destructive">* (Wajib)</span>
                                    </span>
                                </div>
                            </div>

                            {/* Current Manager Status */}
                            {hasManagers ? (
                                <div className="rounded-lg bg-background p-3 border space-y-2">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Pengelola Aktif Saat Ini:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tenant?.managers.map((m) => (
                                            <Badge key={m.id} variant="secondary" className="gap-1.5 py-1 px-2.5">
                                                <Users className="h-3.5 w-3.5 text-primary" />
                                                <span className="font-semibold text-foreground">{m.name}</span>
                                                <span className="text-muted-foreground font-mono text-[10px]">({m.email})</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Stand ini belum memiliki akun pengelola!</p>
                                        <p className="mt-0.5 text-muted-foreground">
                                            Akun pengelola wajib ditetapkan agar stand dapat beroperasi dan login ke sistem.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Options for Manager */}
                            <div className="text-xs font-medium text-muted-foreground pt-1">
                                Opsi Pengaturan Pengelola:
                            </div>

                            <div className={`grid ${hasManagers ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 rounded-lg bg-background p-1 border text-xs`}>
                                {hasManagers && (
                                    <button
                                        type="button"
                                        onClick={() => form.setData('manager_mode', 'keep')}
                                        className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-all ${
                                            form.data.manager_mode === 'keep'
                                                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Tetap Gunakan
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => form.setData('manager_mode', 'new')}
                                    className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-all ${
                                        form.data.manager_mode === 'new'
                                            ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    {hasManagers ? 'Tambah Akun Baru' : 'Buat Akun Baru'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => form.setData('manager_mode', 'existing')}
                                    className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition-all ${
                                        form.data.manager_mode === 'existing'
                                            ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <UserCheck className="h-3.5 w-3.5" />
                                    {hasManagers ? 'Tautkan Akun Lain' : 'Pilih Akun Terdaftar'}
                                </button>
                            </div>

                            {form.data.manager_mode === 'new' && (
                                <div className="space-y-3 pt-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-manager-name" className="text-xs">
                                            Nama Pengelola Baru <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="edit-manager-name"
                                            placeholder="Nama lengkap penjual / pengelola"
                                            value={form.data.manager_name}
                                            onChange={(e) => form.setData('manager_name', e.target.value)}
                                            aria-invalid={!!form.errors.manager_name}
                                            className="h-9 bg-background"
                                        />
                                        {form.errors.manager_name && (
                                            <p className="text-xs text-destructive">{form.errors.manager_name}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-manager-email" className="text-xs">
                                            Email Login Pengelola <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="edit-manager-email"
                                            type="email"
                                            placeholder="pengelola@feb.ac.id"
                                            value={form.data.manager_email}
                                            onChange={(e) => form.setData('manager_email', e.target.value)}
                                            aria-invalid={!!form.errors.manager_email}
                                            className="h-9 bg-background"
                                        />
                                        {form.errors.manager_email && (
                                            <p className="text-xs text-destructive">{form.errors.manager_email}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-manager-password" className="text-xs">
                                            Password Login <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="edit-manager-password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Minimal 8 karakter"
                                                value={form.data.manager_password}
                                                onChange={(e) => form.setData('manager_password', e.target.value)}
                                                aria-invalid={!!form.errors.manager_password}
                                                className="h-9 pr-9 bg-background"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {form.errors.manager_password && (
                                            <p className="text-xs text-destructive">{form.errors.manager_password}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {form.data.manager_mode === 'existing' && (
                                <div className="space-y-3 pt-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-manager-user-id" className="text-xs">
                                            Pilih Pengguna Yang Akan Ditugaskan <span className="text-destructive">*</span>
                                        </Label>
                                        <select
                                            id="edit-manager-user-id"
                                            value={form.data.manager_user_id}
                                            onChange={(e) => form.setData('manager_user_id', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-ring"
                                        >
                                            <option value="">-- Pilih Akun Pengguna --</option>
                                            {availableUsers.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email}) - Peran: {user.role} {user.tenant_id ? '(Sudah ditautkan)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {form.errors.manager_user_id && (
                                            <p className="text-xs text-destructive">{form.errors.manager_user_id}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {form.errors.manager_mode && (
                                <p className="text-xs text-destructive">{form.errors.manager_mode}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Menyimpan...' : 'Perbarui Stand'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
